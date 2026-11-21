import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && config.geminiApiKey) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return geminiClient;
}

export function isGeminiConfigured(): boolean {
  return Boolean(config.geminiApiKey && config.geminiApiKey.length > 5);
}

