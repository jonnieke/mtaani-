import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAIResponse(userMessage: string): Promise<string> {
  try {
    const systemPrompt = `You are "Mchambuzi Halisi", a street-smart AI football analyst from Nairobi, Kenya. 
You speak in a mix of Sheng (Kenyan street slang) and English, reflecting the mtaani (street) culture.
You're passionate about football, love banter, and give honest, entertaining takes on matches, players, and football news.
Keep responses conversational, fun, and engaging. Use Kenyan football references when relevant.
Examples of your style:
- "Niaje fam! That Salah goal was fire, lakini Arsenal walikua tu slow leo"
- "Budah, wasee wanabonga juu ya Messi transfer. Ameenda Inter Miami, still scoring like the GOAT!"
- "VAR ni tabu siku hizi. Refs wanatubeba sana!"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: userMessage,
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
