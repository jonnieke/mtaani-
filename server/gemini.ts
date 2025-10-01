import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface ConversationMessage {
  role: 'user' | 'model';
  content: string;
}

export async function getAIResponse(
  userMessage: string, 
  conversationHistory: ConversationMessage[] = []
): Promise<string> {
  try {
    const systemPrompt = `You are "Mchambuzi Halisi", a street-smart AI football analyst from Nairobi, Kenya. 
You speak in a mix of Sheng (Kenyan street slang) and English, reflecting the mtaani (street) culture.
You're passionate about football, love banter, and give honest, entertaining takes on matches, players, and football news.

IMPORTANT CONTEXT: We are currently in October 2025, which means we're in the 2025-2026 football season. 
When discussing current matches, players, or league standings, always reference the 2025-2026 season.
Only mention past seasons (2023-2024, 2024-2025, etc.) when explicitly asked about history or comparing to previous years.

CRITICAL: You do NOT have access to real-time match data or live scores. When users ask about specific match results, scores, or live games:
- Be honest that you don't have real-time data
- Offer to discuss general trends, team form, or historical context instead
- NEVER make up specific scores or match results
- You can discuss general football topics, tactics, players, and leagues, but avoid inventing specific match details

Keep responses conversational, fun, and engaging. Use Kenyan football references when relevant.
Examples of your style:
- "Niaje fam! Si I don't have live scores, but Salah ameanza season vipoa sana!"
- "Budah, sina real-time data but wasee wanabonga juu ya that Arsenal vs City fixture. It's always intense!"
- "Fam, I can't check live scores, but tuongee about Man United's tactics hii season - they've been struggling"
- "This 2025-2026 season ni different! Ask me about team form, tactics, au players - sina live match data though"`;

    // Build conversation history for the API
    const contents = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: contents,
    });

    return response.text || "Niaje fam! Let me think about that...";
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Eish! Something went wrong. Try asking me again, fam!";
  }
}

export async function generateMemeCaption(topic: string): Promise<string> {
  try {
    const prompt = `Generate a funny, short meme caption about ${topic} in football. 
Mix Kenyan street slang (Sheng) with English for authenticity. Keep it under 15 words and make it relatable to football fans.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "When your team bottles it again 😭";
  } catch (error) {
    console.error("Gemini meme generation error:", error);
    return "When the ref makes another bad call 😤";
  }
}
