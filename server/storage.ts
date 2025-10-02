import { 
  type User, 
  type InsertUser,
  type Meme,
  type InsertMeme,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";
import { ensureFirebase } from "./firebase";

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

class FirestoreStorage implements IStorage {
  private collectionUsers = "users";
  private collectionMemes = "memes";
  private collectionChat = "chat_messages";

  async getUser(id: string): Promise<User | undefined> {
    const db = ensureFirebase();
    const snap = await db.collection(this.collectionUsers).doc(id).get();
    if (!snap.exists) return undefined;
    const data = snap.data() as any;
    return { id: snap.id, username: data.username, password: data.password } as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = ensureFirebase();
    const q = await db.collection(this.collectionUsers).where("username", "==", username).limit(1).get();
    if (q.empty) return undefined;
    const doc = q.docs[0];
    const d = doc.data() as any;
    return { id: doc.id, username: d.username, password: d.password } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = ensureFirebase();
    const docRef = await db.collection(this.collectionUsers).add({
      username: insertUser.username,
      password: insertUser.password,
    });
    return { id: docRef.id, username: insertUser.username, password: insertUser.password } as User;
  }

  async getMemes(limit: number = 50): Promise<Meme[]> {
    const db = ensureFirebase();
    const q = await db
      .collection(this.collectionMemes)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    return q.docs.map((doc) => {
      const d = doc.data() as any;
      return {
        id: doc.id,
        imageUrl: d.imageUrl,
        caption: d.caption,
        likes: d.likes ?? 0,
        createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt),
      } as Meme;
    });
  }

  async createMeme(insertMeme: InsertMeme): Promise<Meme> {
    const db = ensureFirebase();
    const now = new Date();
    const docRef = await db.collection(this.collectionMemes).add({
      imageUrl: insertMeme.imageUrl,
      caption: insertMeme.caption,
      likes: insertMeme.likes ?? 0,
      createdAt: now,
    });
    return { id: docRef.id, imageUrl: insertMeme.imageUrl, caption: insertMeme.caption, likes: insertMeme.likes ?? 0, createdAt: now } as Meme;
  }

  async likeMeme(id: string): Promise<Meme | undefined> {
    const db = ensureFirebase();
    const ref = db.collection(this.collectionMemes).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return undefined;
    const d = snap.data() as any;
    const likes = (d.likes ?? 0) + 1;
    await ref.update({ likes });
    return {
      id: snap.id,
      imageUrl: d.imageUrl,
      caption: d.caption,
      likes,
      createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt),
    } as Meme;
  }

  async getChatMessages(limit: number = 100): Promise<ChatMessage[]> {
    const db = ensureFirebase();
    const q = await db
      .collection(this.collectionChat)
      .orderBy("timestamp", "asc")
      .limit(limit)
      .get();
    return q.docs.map((doc) => {
      const d = doc.data() as any;
      return {
        id: doc.id,
        user: d.user,
        message: d.message,
        timestamp: d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp),
      } as ChatMessage;
    });
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const db = ensureFirebase();
    const now = new Date();
    const docRef = await db.collection(this.collectionChat).add({
      user: insertMessage.user,
      message: insertMessage.message,
      timestamp: now,
    });
    return { id: docRef.id, user: insertMessage.user, message: insertMessage.message, timestamp: now } as ChatMessage;
  }
}

const useFirestore = process.env.USE_FIRESTORE === "true";
export const storage: IStorage = useFirestore ? new FirestoreStorage() : new MemStorage();
