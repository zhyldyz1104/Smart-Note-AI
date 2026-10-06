import { GoogleGenAI } from "@google/genai";
import { useState } from 'react';
import {
  generateFlashcards,
  generateQuiz,
  improveWriting
} from '../lib/ai/ai';

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: "AQ.Ab8RN6Jt3fjttQf7fuxsuXTZ9SHAC04aJVFQwa0q7vYOonzCLA",
});

// Universal safe request with retry logic (only used for summarize for now)
async function safeRequest(prompt: string) {
  const maxRetries = 2;      // Try up to 2 times
  const delay = 30000;        // Wait 30 seconds between tries
  let retries = 0;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        input: prompt,
      });

      console.log("2 safeRequest result:", interaction.output_text);
      return { text: interaction.output_text, retries };
    }
    catch (error: any) {
      // Rate limit or temporary service overload
      console.log(error.status)
      if (error.status == 429 && error.status == 503) {
        retries++;
        console.log(`Retry ${retries}/${maxRetries} — waiting ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Other errors should not retry
      }
    }
  }

  throw new Error("Failed after multiple retries.");
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);
  const [summary, setSummary] = useState<string | undefined>('');

  const run = async <T>(fn: () => Promise<T>): Promise<T | null> => {
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

  // ⭐ Summarize uses safeRequest with retry logic
  const summarize = (text: string) => {
    return run(async () => {
      const result = await safeRequest(`Summarize the following note into a concise summary (3-5 sentences). Return only the summary text:\n${text}`);
      setRetries(result.retries);
      setSummary(result.text);
      return result.text;
    });
  }


  // ⭐ Other functions remain untouched (no retry logic yet)
  const improve = (text: string) => {
    return run(async () => {
      const result = await safeRequest(`Improve the writing clarity, grammar, and flow of the following note. Keep the meaning intact. Return only the improved text:\n${text}`);   // your AI call

      setRetries(result.retries);
      setSummary(result.text);                     // or setImproved(result.text)

      return result.text;                          // return improved text
    });
  };
  const flashcards = (text: string) => run(() => generateFlashcards(text));
  const quiz = (text: string) => run(() => generateQuiz(text));

  return { loading, error, retries, summary, summarize, improve, flashcards, quiz };
}
