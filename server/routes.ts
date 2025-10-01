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
        { 
          id: '1', 
          topic: 'Messi Transfer', 
          searchVolume: '500K', 
          trend: 'up',
          description: 'Inter Miami star Lionel Messi is rumored to be considering his options for next season. Speculation includes a possible return to Barcelona or a move to Saudi Arabia. Fans worldwide are following every development in this ongoing saga.'
        },
        { 
          id: '2', 
          topic: 'Arsenal vs Chelsea', 
          searchVolume: '350K', 
          trend: 'up',
          description: 'The North London derby is heating up as Arsenal and Chelsea prepare for their crucial Premier League clash. Both teams need the points in their respective campaigns. Historical rivalry adds extra spice to this fixture.'
        },
        { 
          id: '3', 
          topic: 'CAF Champions League', 
          searchVolume: '280K', 
          trend: 'up',
          description: 'African club football elite competition is reaching its climax. Top teams from across the continent are battling for continental glory and a spot in the FIFA Club World Cup. The quality of play has impressed observers worldwide.'
        },
        { 
          id: '4', 
          topic: 'Salah Injury Update', 
          searchVolume: '220K', 
          trend: 'stable',
          description: 'Liverpool fans are anxiously awaiting news on Mohamed Salah fitness. The Egyptian forward picked up a knock in the last match. His availability for upcoming crucial fixtures could determine Liverpool season outcome.'
        },
        { 
          id: '5', 
          topic: 'Real Madrid Rumors', 
          searchVolume: '180K', 
          trend: 'up',
          description: 'Real Madrid are reportedly preparing a massive summer transfer overhaul. Links to Mbappe, Haaland, and other superstars continue to dominate headlines. The Spanish giants are looking to build another galactico era.'
        },
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
        { 
          id: '1', 
          keyword: 'Messi', 
          size: 'xl', 
          brief: "Messi's Inter Miami Magic", 
          details: 'Lionel Messi continues to dominate headlines with his incredible performances at Inter Miami. The Argentine legend has scored 15 goals in his first season, leading the team to their first trophy. Fans worldwide are debating whether this marks a new chapter in his legendary career or if a return to Europe is still possible. His impact on MLS has been massive, with attendance records broken at every stadium he visits.' 
        },
        { 
          id: '2', 
          keyword: 'Champions League', 
          size: 'lg', 
          brief: 'UCL Knockout Drama', 
          details: 'The Champions League knockout stages are delivering non-stop excitement. Real Madrid narrowly defeated Manchester City in a thriller, while Bayern Munich shocked Barcelona with a comeback win. Underdogs are making their mark with surprise victories over traditional powerhouses. Every matchday brings new drama as teams battle for European glory.' 
        },
        { 
          id: '3', 
          keyword: 'Premier League', 
          size: 'lg', 
          brief: 'Title Race Goes Down to Wire', 
          details: 'The Premier League title race is the most competitive in years. Arsenal, Manchester City, and Liverpool are separated by just 2 points with 10 games remaining. Every match is crucial as one slip-up could cost a team the championship. Tactical battles between top managers are fascinating fans worldwide.' 
        },
        { 
          id: '4', 
          keyword: 'Salah', 
          size: 'md', 
          brief: "Salah's Golden Boot Chase", 
          details: 'Mohamed Salah is in red-hot form, chasing his third Premier League Golden Boot. The Egyptian King has scored 25 goals this season, terrorizing defenses with his pace and clinical finishing. Liverpool fans are celebrating his renewed form as he leads the Reds push for silverware.' 
        },
        { 
          id: '5', 
          keyword: 'Haaland', 
          size: 'lg', 
          brief: 'Haaland Breaks Records', 
          details: 'Erling Haaland continues to rewrite the record books at Manchester City. The Norwegian striker has already surpassed the 30-goal mark this season, breaking multiple Premier League records. His combination of speed, power, and finishing ability makes him virtually unstoppable. Pundits are comparing him to the greatest strikers in football history.' 
        },
        { 
          id: '6', 
          keyword: 'VAR', 
          size: 'sm', 
          brief: 'VAR Controversy Continues', 
          details: 'Another weekend, another VAR controversy. Multiple questionable decisions have sparked heated debates about the technology implementation. Fans and pundits are divided on whether VAR is improving or harming the beautiful game.' 
        },
        { 
          id: '7', 
          keyword: 'AFCON', 
          size: 'md', 
          brief: 'AFCON Fever Grips Africa', 
          details: 'The Africa Cup of Nations is delivering spectacular football. Host nation Ivory Coast is battling favorites Nigeria and Senegal for continental supremacy. Star players like Salah, Mane, and Osimhen are showcasing African talent on the global stage. Every match brings passionate celebrations and emotional moments.' 
        },
        { 
          id: '8', 
          keyword: 'Arsenal', 
          size: 'md', 
          brief: 'Gunners Back in Form', 
          details: 'Arsenal are showing championship mentality with a string of impressive victories. Mikel Arteta tactical setup has transformed them into genuine title contenders. Young stars like Saka and Martinelli are stepping up in crucial moments, while experienced players provide leadership.' 
        },
        { 
          id: '9', 
          keyword: 'Ronaldo', 
          size: 'lg', 
          brief: 'CR7 Saudi Success Story', 
          details: 'Cristiano Ronaldo is thriving in the Saudi Pro League, proving age is just a number. The Portuguese icon has scored 35 goals this season, helping Al-Nassr compete for the title. His presence has elevated the entire league profile, attracting global attention and top players.' 
        },
        { 
          id: '10', 
          keyword: 'Transfer Window', 
          size: 'sm', 
          brief: 'Transfer Deadline Approaching', 
          details: 'Clubs are scrambling to complete deals before the transfer window closes. Big money moves and surprise signings are expected in the final hours. Agents and directors are working around the clock to finalize contracts.' 
        },
        { 
          id: '11', 
          keyword: 'El Clasico', 
          size: 'md', 
          brief: 'El Clasico Anticipation Builds', 
          details: 'Real Madrid vs Barcelona is just days away. Both teams are in excellent form, setting up a potential classic encounter. The rivalry continues to captivate football fans globally, with bragging rights and crucial points on the line.' 
        },
        { 
          id: '12', 
          keyword: 'Mbappe', 
          size: 'md', 
          brief: 'Mbappe Transfer Saga', 
          details: "Kylian Mbappe's future remains football's biggest question. Real Madrid, PSG, and Premier League clubs are all reportedly interested. The French superstar holds all the cards as he decides where to continue his career." 
        },
      ];
      res.json(mockSearches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hot searches' });
    }
  });

  return httpServer;
}
