import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { getAIResponse } from "./gemini";
import { insertMemeSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to chat');

    // Send recent chat history to new client
    storage.getChatMessages(50).then((messages) => {
      ws.send(JSON.stringify({
        type: 'history',
        messages: messages.map(msg => ({
          id: msg.id,
          user: msg.user,
          message: msg.message,
          timestamp: msg.timestamp.toISOString(),
        })),
      }));
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
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message must be a non-empty string' });
      }
      
      if (message.length > 1000) {
        return res.status(400).json({ error: 'Message must be less than 1000 characters' });
      }
      
      const response = await getAIResponse(message.trim());
      res.json({ response });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: 'AI service error' });
    }
  });

  // Trending topics - mock data placeholder for future Google Trends API integration
  app.get('/api/trending/topics', async (req, res) => {
    try {
      // TODO: Integrate with actual Google Trends API when ready
      // This endpoint currently returns static data as a placeholder
      // Future implementation should:
      // 1. Make authenticated request to Google Trends API
      // 2. Parse and transform response data
      // 3. Handle rate limiting and errors
      // 4. Cache results with appropriate TTL
      const mockTopics = [
        { id: '1', topic: 'Messi Transfer', searchVolume: '500K', trend: 'up' },
        { id: '2', topic: 'Arsenal vs Chelsea', searchVolume: '350K', trend: 'up' },
        { id: '3', topic: 'CAF Champions League', searchVolume: '280K', trend: 'up' },
        { id: '4', topic: 'Salah Injury Update', searchVolume: '220K', trend: 'stable' },
        { id: '5', topic: 'Real Madrid Rumors', searchVolume: '180K', trend: 'up' },
      ];
      res.json(mockTopics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trending topics' });
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

  // Hot searches - mock data placeholder for future search trends API integration
  app.get('/api/trending/searches', async (req, res) => {
    try {
      // TODO: Integrate with actual search trends API when ready
      // This endpoint currently returns static data as a placeholder
      const mockSearches = [
        { id: '1', keyword: 'Messi', size: 'xl', brief: "Breaking: Messi's Next Move", details: 'Details about Messi transfer...' },
        { id: '2', keyword: 'Champions League', size: 'lg', brief: 'UCL Drama Unfolds', details: 'Champions League updates...' },
        { id: '3', keyword: 'Premier League', size: 'lg', brief: 'Premier League Thriller', details: 'EPL title race...' },
        { id: '4', keyword: 'Salah', size: 'md', brief: "Salah's Stunning Strike", details: 'Mohamed Salah scored...' },
        { id: '5', keyword: 'Haaland', size: 'lg', brief: "Haaland's Record Pace", details: 'Erling Haaland...' },
        { id: '6', keyword: 'VAR', size: 'sm', brief: 'VAR Sparks Debate', details: 'Another controversial VAR...' },
        { id: '7', keyword: 'AFCON', size: 'md', brief: 'AFCON Drama', details: 'African football fans...' },
        { id: '8', keyword: 'Arsenal', size: 'md', brief: 'Gunners On Fire', details: 'Arsenal showing...' },
        { id: '9', keyword: 'Ronaldo', size: 'lg', brief: 'CR7 Legacy', details: 'Cristiano Ronaldo...' },
        { id: '10', keyword: 'Transfer Window', size: 'sm', brief: 'Transfer News', details: 'Clubs preparing...' },
        { id: '11', keyword: 'El Clasico', size: 'md', brief: 'El Clasico Preview', details: 'Real Madrid vs Barcelona...' },
        { id: '12', keyword: 'Mbappe', size: 'md', brief: 'Mbappe Watch', details: "Kylian Mbappe's future..." },
      ];
      res.json(mockSearches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hot searches' });
    }
  });

  return httpServer;
}
