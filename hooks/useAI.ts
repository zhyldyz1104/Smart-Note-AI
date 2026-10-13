import { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";
// Initialize Gemini using Expo-safe environment variable
const geminiKey =
  Constants.expoConfig?.extra?.geminiApiKey ??
  (Constants.manifest as (typeof Constants.manifest & {
    extra?: { geminiApiKey?: string };
  }) | null)?.extra?.geminiApiKey;

if (!geminiKey) {
  console.log( Constants.expoConfig?.extra?.geminiApiKey)
  throw new Error("Gemini API key is missing. Check app.config.js and .env.");
}

const genAI = new GoogleGenerativeAI(geminiKey);


// Configure the model
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash-lite",
  systemInstruction: "Respond concisely. Use fast reasoning."
});

// ---------- RETRY WRAPPER ----------
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err: any) {
      const retryable =
        err?.status === 429 ||
        err?.status === 503 ||
        err?.message?.includes("rate") ||
        err?.message?.includes("quota");

      if (!retryable) throw err;

      attempt++;
      await new Promise((res) => setTimeout(res, 1500 * attempt)); // exponential backoff
    }
  }

  throw new Error("Max retries reached");
}

// ---------- STREAMING REQUEST ----------
export async function safeRequest(
  prompt: string,
  onChunk: (text: string) => void
) {
  return withRetry(async () => {
    const result = await model.generateContentStream(prompt);

    let fullText = "";

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }

    return fullText;
  });
}

// ---------- MAIN HOOK ----------
export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const run = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await fn();
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI request failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------- SUMMARIZE ----------
  const summarize = (text: string) => {
    return run(async () => {
      setSummary("");
      let fullText = "";

      await safeRequest(
        `Summarize the following note into a concise summary (3–5 sentences). Return only the summary text:\n${text}`,
        (chunk) => {
          fullText += chunk;
          setSummary((prev) => prev + chunk);
        }
      );

      return fullText;
    });
  };

  // ---------- IMPROVE ----------
  const improve = (text: string) => {
    return run(async () => {
      setSummary("");
      let fullText = "";

      await safeRequest(
        `Improve the writing clarity, grammar, and flow of the following note. Keep the meaning intact. Return only the improved text:\n${text}`,
        (chunk) => {
          fullText += chunk;
          setSummary((prev) => prev + chunk);
        }
      );

      return fullText;
    });
  };

  return {
    loading,
    error,
    summary,
    summarize,
    improve,
  };
}
