import { 
  type User, 
  type InsertUser,
  type Meme,
  type InsertMeme,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMemes(limit?: number): Promise<Meme[]>;
  createMeme(meme: InsertMeme): Promise<Meme>;
  likeMeme(id: string): Promise<Meme | undefined>;
  
  getChatMessages(limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private memes: Map<string, Meme>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.memes = new Map();
    this.chatMessages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMemes(limit: number = 50): Promise<Meme[]> {
    return Array.from(this.memes.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createMeme(insertMeme: InsertMeme): Promise<Meme> {
    const id = randomUUID();
    const meme: Meme = {
      ...insertMeme,
      id,
      likes: insertMeme.likes ?? 0,
      createdAt: new Date(),
    };
    this.memes.set(id, meme);
    return meme;
  }

  async likeMeme(id: string): Promise<Meme | undefined> {
    const meme = this.memes.get(id);
    if (meme) {
      meme.likes += 1;
      this.memes.set(id, meme);
      return meme;
    }
    return undefined;
  }

  async getChatMessages(limit: number = 100): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
