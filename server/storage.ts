import { 
  users, 
  type User, 
  type InsertUser,
  chatHistory,
  chatMessages,
  type InsertChatHistory,
  type ChatHistory,
  type InsertChatMessage,
  type ChatMessage
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Storage interface with additional methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Chat history methods
  getChatHistories(userId: number): Promise<ChatHistory[]>;
  getChatHistory(id: number): Promise<ChatHistory | undefined>;
  createChatHistory(history: InsertChatHistory): Promise<ChatHistory>;
  updateChatHistoryTitle(id: number, title: string): Promise<ChatHistory | undefined>;
  deleteChatHistory(id: number): Promise<boolean>;
  
  // Chat messages methods
  getChatMessages(chatId: number): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  sessionStore: any; // Store type
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any; // Store type

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return !!deletedUser;
  }

  // Chat history methods
  async getChatHistories(userId: number): Promise<ChatHistory[]> {
    return await db
      .select()
      .from(chatHistory)
      .where(eq(chatHistory.userId, userId))
      .orderBy(desc(chatHistory.updatedAt));
  }

  async getChatHistory(id: number): Promise<ChatHistory | undefined> {
    const [history] = await db
      .select()
      .from(chatHistory)
      .where(eq(chatHistory.id, id));
    return history;
  }

  async createChatHistory(history: InsertChatHistory): Promise<ChatHistory> {
    const [newHistory] = await db
      .insert(chatHistory)
      .values(history)
      .returning();
    return newHistory;
  }

  async updateChatHistoryTitle(id: number, title: string): Promise<ChatHistory | undefined> {
    const [updatedHistory] = await db
      .update(chatHistory)
      .set({ 
        title,
        updatedAt: new Date()
      })
      .where(eq(chatHistory.id, id))
      .returning();
    return updatedHistory;
  }

  async deleteChatHistory(id: number): Promise<boolean> {
    // First delete all messages in this chat
    await db
      .delete(chatMessages)
      .where(eq(chatMessages.chatId, id));
    
    // Then delete the chat history
    const [result] = await db
      .delete(chatHistory)
      .where(eq(chatHistory.id, id))
      .returning({ id: chatHistory.id });
    
    return !!result;
  }

  // Chat messages methods
  async getChatMessages(chatId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.chatId, chatId))
      .orderBy(chatMessages.timestamp);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    
    // Update the updated_at field of the chat history
    await db
      .update(chatHistory)
      .set({ updatedAt: new Date() })
      .where(eq(chatHistory.id, message.chatId));
      
    return newMessage;
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();
