import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  if (!config.mongoUri) {
    console.warn('⚠️  MONGODB_URI is not set. Operating in in-memory cache mode.');
    return false;
  }

  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas (Collection: audit_reports)');
    return true;
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed, falling back to memory store:', (err as Error).message);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}

