import { useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import { getAI, getGenerativeModel } from '@react-native-firebase/ai';
import {
  generateFlashcards,
  generateQuiz
} from '../lib/ai/ai';

// Initialize Firebase AI Logic using your existing Firebase App
const app = getApp();
const ai = getAI(app);

// Configure the model globally
// We use gemini-3.8-flash for the fastest possible response time
const model = getGenerativeModel(ai, {
  model: 'gemini-3.8-flash',
  systemInstruction: 'Respond concisely. Use fast reasoning.'
});

export async function safeRequest(prompt: string, onChunk: (text: string) => void) {
  try {
    // generateContentStream gives us "antigravity" speed by streaming chunks 
    // as soon as the model thinks of them, rather than waiting for the whole response.
    const result = await model.generateContentStream(prompt);

    let fullText = "";

    // Iterate over the stream
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        onChunk(chunkText); // Send partial text directly to your UI
      }
    }

    return fullText;
  } catch (error: any) {
    console.log("Streaming Error:", error.message);
    throw error;
  }
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);
  const [summary, setSummary] = useState<string | undefined>('');

  const run = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    setRetries(0);

    try {
      const result = await fn();
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'AI request failed';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Summarize uses safeRequest to stream chunks directly into the summary state
  const summarize = (text: string) => {
    return run(async () => {
      setSummary(""); // clear previous summary
      let fullText = "";

      await safeRequest(
        `Summarize the following note into a concise summary (3-5 sentences). Return only the summary text:\n${text}`,
        (chunk) => {
          fullText += chunk;
          setSummary(prev => prev + chunk);
        }
      );

      return fullText;
    });
  };

  // ⭐ Improve uses safeRequest to stream chunks directly into the summary state
  const improve = (text: string) => {
    return run(async () => {
      setSummary(""); // clear previous summary
      let fullText = "";

      await safeRequest(
        `Improve the writing clarity, grammar, and flow of the following note. Keep the meaning intact. Return only the improved text:\n${text}`,
        (chunk) => {
          fullText += chunk;
          setSummary(prev => prev + chunk);
        }
      );

      return fullText;
    });
  };

  const flashcards = (text: string) => run(() => generateFlashcards(text));
  const quiz = (text: string) => run(() => generateQuiz(text));

  return { loading, error, retries, summary, summarize, improve, flashcards, quiz };
}