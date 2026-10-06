const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';
const SYSTEM_PROMPT = 'You are Smart Note AI assistant.';
export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AIResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function callChatGPT(userPrompt: string, jsonMode = false): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_OPENAI_API_KEY. Set it in your .env file.');
  }
  const body: Record<string, unknown> = {
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? '';
}

export async function summarizeNote(text: string): Promise<string> {
  const prompt = `Summarize the following note into a concise summary (3-5 sentences). Return only the summary text.\n\nNote:\n${text}`;
  return callChatGPT(prompt, false);
}

export async function improveWriting(text: string): Promise<string> {
  const prompt = `Improve the writing clarity, grammar, and flow of the following note. Keep the meaning intact. Return only the improved text.\n\nNote:\n${text}`;
  return callChatGPT(prompt, false);
}

export async function generateFlashcards(text: string): Promise<Flashcard[]> {
  const prompt = `Generate 5 study flashcards from the following note. Return JSON in this exact format: {"flashcards":[{"front":"question","back":"answer"}]}\n\nNote:\n${text}`;
  const raw = await callChatGPT(prompt, true);
  const parsed = JSON.parse(raw);
  const cards = Array.isArray(parsed.flashcards) ? parsed.flashcards : [];
  return cards.map((c: { front: string; back: string }, i: number) => ({
    id: `fc_${Date.now()}_${i}`,
    front: c.front,
    back: c.back,
  }));
}

export async function generateQuiz(text: string): Promise<QuizQuestion[]> {
  const prompt = `Generate 5 multiple-choice quiz questions from the following note. Each question has 4 options. Return JSON in this exact format: {"questions":[{"question":"q","options":["a","b","c","d"],"correctIndex":0,"explanation":"why"}]}\n\nNote:\n${text}`;
  const raw = await callChatGPT(prompt, true);
  const parsed = JSON.parse(raw);
  const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
  return questions.map(
    (q: { question: string; options: string[]; correctIndex: number; explanation: string }, i: number) => ({
      id: `qz_${Date.now()}_${i}`,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    })
  );
}