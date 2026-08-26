import { useState } from 'react';
import {
  summarizeNote,
  improveWriting,
  generateFlashcards,
  generateQuiz,
  type Flashcard,
  type QuizQuestion,
} from '../lib/ai/chatgpt';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
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

  const summarize = (text: string) => run(() => summarizeNote(text));
  const improve = (text: string) => run(() => improveWriting(text));
  const flashcards = (text: string) => run(() => generateFlashcards(text));
  const quiz = (text: string) => run(() => generateQuiz(text));

  return { loading, error, summarize, improve, flashcards, quiz };
}