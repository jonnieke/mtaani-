import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import { storage } from "./storage";
import { getAIResponse, generateMemeCaption } from "./gemini";
import { insertMemeSchema, insertChatMessageSchema } from "@shared/schema";
import { getCachedTrendingTopics, refreshAndCacheTrendingTopics } from "./trends";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Configure multer for file uploads
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      const fs = require('fs');
      const path = require('path');
      const uploadsDir = path.resolve(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const extension = file.originalname.split('.').pop() || 'jpg';
      cb(null, `meme_${timestamp}_${randomSuffix}.${extension}`);
    }
  });

  const upload = multer({
    storage: storageConfig,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to chat');

    // Send recent chat history to new client
    storage.getChatMessages(50)
      .then((messages) => {
        ws.send(JSON.stringify({
          type: 'history',
          messages: messages.map(msg => ({
            id: msg.id,
            user: msg.user,
            message: msg.message,
            timestamp: msg.timestamp.toISOString(),
          })),
        }));
      })
      .catch((err) => {
        console.error('Failed to load chat history:', err?.message || err);
        ws.send(JSON.stringify({ type: 'history', messages: [] }));
      });

    ws.on('message', async (data: string) => {
      try {
        const parsed = JSON.parse(data.toString());
        
        if (parsed.type === 'chat') {
          // Validate message against schema
          let validatedData;
          try {
            validatedData = insertChatMessageSchema.parse({
              user: parsed.user,
              message: parsed.message,
            });
          } catch (validationError) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format',
            }));
            return;
          }
          
          // Save message to storage
          const chatMessage = await storage.createChatMessage(validatedData);

          // Broadcast to all clients
          const broadcast = JSON.stringify({
            type: 'message',
            id: chatMessage.id,
            user: chatMessage.user,
            message: chatMessage.message,
            timestamp: chatMessage.timestamp.toISOString(),
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcast);
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from chat');
    });
  });

  // API Routes
  
  // Get memes
  app.get('/api/memes', async (req, res) => {
    try {
      const memes = await storage.getMemes();
      res.json(memes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch memes' });
    }
  });

  // Create meme
  app.post('/api/memes', async (req, res) => {
    try {
      const validatedData = insertMemeSchema.parse(req.body);
      const meme = await storage.createMeme(validatedData);
      res.json(meme);
    } catch (error) {
      res.status(400).json({ error: 'Invalid meme data' });
    }
  });

  // Upload image for meme
  app.post('/api/memes/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // File is already saved by multer, just return the URL
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  // Daily-limited AI meme generation (max 10/day)
  let inMemoryMemeGen = { date: new Date().toISOString().slice(0,10), count: 0 } as { date: string; count: number };
  app.get('/api/memes/generate/status', async (req, res) => {
    try {
      const today = new Date().toISOString().slice(0,10);
      const guestId = (req.get('x-guest-id') || '').trim() || 'anonymous';
      if (process.env.USE_FIRESTORE === 'true') {
        try {
          const { ensureFirebase } = await import('./firebase.js');
          const db = ensureFirebase();
          const metaRef = db.collection('meta').doc('limits');
          const metaSnap = await metaRef.get();
          const data = metaSnap.exists ? metaSnap.data() as any : {};
          const date = data?.memeGenDate || today;
          let count = data?.memeGenCount || 0;
          if (date !== today) count = 0;
          const userKey = `memeGen_${today}_${guestId}`;
          const userSnap = await db.collection('meta').doc(userKey).get();
          const userCount = userSnap.exists ? ((userSnap.data() as any)?.count || 0) : 0;
          return res.json({ date: today, globalCount: count, globalLimit: 10, userCount, userLimit: 1 });
        } catch {}
      }
      // Fallback to in-memory
      const key = `${today}:${guestId}`;
      const usedSet: Set<string> = (global as any).__memeGenUsers || new Set<string>();
      const userCount = usedSet.has(key) ? 1 : 0;
      return res.json({ date: today, globalCount: inMemoryMemeGen.count, globalLimit: 10, userCount, userLimit: 1 });
    } catch (e) {
      return res.status(200).json({ date: new Date().toISOString().slice(0,10), globalCount: 0, globalLimit: 10, userCount: 0, userLimit: 1 });
    }
  });
  app.post('/api/memes/generate', async (req, res) => {
    try {
      const today = new Date().toISOString().slice(0,10);
      if (inMemoryMemeGen.date !== today) {
        inMemoryMemeGen = { date: today, count: 0 };
      }

      // Attempt Firestore-backed counter if available
      let useFirestoreCounter = false;
      const guestId = (req.get('x-guest-id') || '').trim() || 'anonymous';
      try {
        if (process.env.USE_FIRESTORE === 'true') {
          const { ensureFirebase } = await import('./firebase.js');
          const db = ensureFirebase();
          // Global counter
          const metaRef = db.collection('meta').doc('limits');
          const snap = await metaRef.get();
          const data = snap.exists ? snap.data() as any : {};
          const date = data?.memeGenDate || today;
          let count = data?.memeGenCount || 0;
          if (date !== today) { count = 0; }
          if (count >= 10) {
            return res.status(429).json({ error: 'Daily generation limit reached (10).' });
          }
          useFirestoreCounter = true;
          // Per-user counter
          const userKey = `memeGen_${today}_${guestId}`;
          const userRef = db.collection('meta').doc(userKey);
          const userSnap = await userRef.get();
          const userCount = userSnap.exists ? ((userSnap.data() as any)?.count || 0) : 0;
          if (userCount >= 1) {
            return res.status(429).json({ error: 'User daily limit reached (1).' });
          }
          // reserve slots
          await metaRef.set({ memeGenDate: today, memeGenCount: count + 1 }, { merge: true });
          await userRef.set({ count: userCount + 1 }, { merge: true });
        }
      } catch {
        // fall back to in-memory
      }

      if (!useFirestoreCounter) {
        // per-user in-memory
        const key = `${today}:${guestId}`;
        (global as any).__memeGenUsers = (global as any).__memeGenUsers || new Set<string>();
        const usedSet: Set<string> = (global as any).__memeGenUsers;
        if (usedSet.has(key)) {
          return res.status(429).json({ error: 'User daily limit reached (1).' });
        }
        if (inMemoryMemeGen.count >= 10) {
          return res.status(429).json({ error: 'Daily generation limit reached (10).' });
        }
        inMemoryMemeGen.count += 1;
        usedSet.add(key);
      }

      const topic = typeof req.body?.topic === 'string' && req.body.topic.trim() ? req.body.topic.trim() : 'football banter';
      const caption = await generateMemeCaption(topic);
      // Cycle through football cartoon assets we ship
      const assets = [
        '/assets/generated/Football_celebration_meme_cartoon_de70cf47.png',
        '/assets/generated/Goalkeeper_fail_meme_cartoon_b7d29a9c.png',
        '/assets/generated/Referee_controversy_meme_cartoon_01c5281f.png',
      ];
      let imageUrl = assets[0];
      try {
        const todayKey = new Date().toISOString().slice(0,10);
        if (process.env.USE_FIRESTORE === 'true') {
          const { ensureFirebase } = await import('./firebase.js');
          const db = ensureFirebase();
          const rotRef = db.collection('meta').doc('imageRotation');
          const snap = await rotRef.get();
          const data = snap.exists ? (snap.data() as any) : {};
          const date = data?.date || todayKey;
          let used: number[] = Array.isArray(data?.used) ? data.used : [];
          if (date !== todayKey) used = [];
          const targetUnique = 10;
          // Pick next index not used (mod assets.length)
          let idx = 0;
          const usedSet = new Set(used);
          for (let i = 0; i < assets.length; i++) {
            if (!usedSet.has(i)) { idx = i; break; }
          }
          imageUrl = assets[idx % assets.length];
          if (usedSet.size < Math.min(targetUnique, assets.length)) {
            usedSet.add(idx % assets.length);
          }
          await rotRef.set({ date: todayKey, used: Array.from(usedSet) }, { merge: true });
        } else {
          (global as any).__imageRotation = (global as any).__imageRotation || { date: todayKey, used: [] as number[] };
          const state = (global as any).__imageRotation as { date: string; used: number[] };
          if (state.date !== todayKey) { state.date = todayKey; state.used = []; }
          const usedSet = new Set(state.used);
          let idx = 0;
          for (let i = 0; i < assets.length; i++) {
            if (!usedSet.has(i)) { idx = i; break; }
          }
          imageUrl = assets[idx % assets.length];
          const targetUnique = 10;
          if (usedSet.size < Math.min(targetUnique, assets.length)) {
            usedSet.add(idx % assets.length);
            state.used = Array.from(usedSet);
          }
        }
      } catch {
        // fallback random
        const pick = Math.floor(Math.random() * assets.length);
        imageUrl = assets[pick];
      }
      const meme = await storage.createMeme({ imageUrl, caption, likes: 0 });
      return res.json(meme);
    } catch (error) {
      console.error('Meme generate error:', error);
      return res.status(500).json({ error: 'Failed to generate meme' });
    }
  });

  // Like meme
  app.post('/api/memes/:id/like', async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: 'Meme ID is required' });
      }
      
      const meme = await storage.likeMeme(req.params.id);
      if (meme) {
        res.json(meme);
      } else {
        res.status(404).json({ error: 'Meme not found' });
      }
    } catch (error) {
      console.error('Error liking meme:', error);
      res.status(500).json({ error: 'Failed to like meme' });
    }
  });

  // Get chat messages
  app.get('/api/chat/messages', async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // AI Assistant
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message must be a non-empty string' });
      }
      
      if (message.length > 1000) {
        return res.status(400).json({ error: 'Message must be less than 1000 characters' });
      }

      // Validate conversation history if provided
      const history = Array.isArray(conversationHistory) 
        ? conversationHistory.slice(-10) // Keep last 10 messages for context
        : [];
      
      const response = await getAIResponse(message.trim(), history);
      res.json({ response });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: 'AI service error' });
    }
  });

  // Trending topics - live via Google Trends (cached)
  app.get('/api/trending/topics', async (_req, res) => {
    try {
      const topics = await getCachedTrendingTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trending topics' });
    }
  });

  // Manual refresh (use sparingly)
  app.post('/api/trending/topics/refresh', async (_req, res) => {
    try {
      const items = await refreshAndCacheTrendingTopics();
      res.json({ refreshed: items.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to refresh trending topics' });
    }
  });

  // Today's matches - mock data placeholder for future Oddspedia API integration
  app.get('/api/matches/today', async (req, res) => {
    try {
      // TODO: Integrate with actual Oddspedia API when ready
      // This endpoint currently returns static data as a placeholder
      // Future implementation should:
      // 1. Make authenticated request to Oddspedia API
      // 2. Parse match data and odds
      // 3. Handle API rate limits and errors
      // 4. Cache results with appropriate TTL
      const mockMatches = [
        {
          id: '1',
          homeTeam: 'Liverpool',
          awayTeam: 'Man City',
          homeScore: '2',
          awayScore: '1',
          isLive: true,
          odds: { home: '2.05', draw: '3.50', away: '2.80' },
        },
        {
          id: '2',
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          homeScore: '1',
          awayScore: '1',
          isLive: false,
          odds: { home: '1.95', draw: '3.60', away: '3.10' },
        },
        {
          id: '3',
          homeTeam: 'Man Utd',
          awayTeam: 'Fulham',
          homeScore: '3',
          awayScore: '0',
          isLive: false,
          odds: { home: '1.60', draw: '3.90', away: '5.20' },
        },
      ];
      res.json(mockMatches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch matches' });
    }
  });

  // Hot searches mirror topics for now (clickable labels)
  app.get('/api/trending/searches', async (_req, res) => {
    try {
      const topics = await getCachedTrendingTopics();
      const searches = topics.slice(0, 10).map((t, idx) => ({
        id: String(idx + 1),
        keyword: t.topic,
        size: idx < 1 ? 'xl' : idx < 3 ? 'lg' : 'md',
        brief: t.topic,
        details: t.description || '',
      }));
      res.json(searches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hot searches' });
    }
  });

  // Debug: storage type
  app.get('/api/_debug/storage', (_req, res) => {
    const useFirestore = process.env.USE_FIRESTORE === 'true';
    res.json({ useFirestore });
  });

  return httpServer;
}
