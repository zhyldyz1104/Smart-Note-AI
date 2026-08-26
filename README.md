# Smart Note AI — Expo React Native App

A cross-platform (iOS, Android, Web) note-taking app with AI features powered by the OpenAI ChatGPT API.

## ✨ Features

- 📝 Notes home with search, counters (Total / Starred / Trashed), and filter tabs
- ⭐ Favorites and 🗑️ Trash support
- 📄 Note details with AI actions: Summarize, Improve Writing, Flashcards, Quiz
- 📊 Word/character/read-time stats
- 🤖 AI Tools screen with progress bars and categories
- ⚙️ Settings: profile, accessibility, account, preferences, support
- 🎨 Purple/pink gradient theme with glass-style surfaces
- 🫧 Reanimated fade-in & slide-up animations
- 🧭 Expo Router navigation + bottom nav
- 🛟 Error boundaries + loading skeletons
- 💾 Local storage via AsyncStorage

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Expo SDK 57
- An OpenAI API key

### Install
```bash
npm install
```

### Configure AI
Create a `.env` file in the project root:
```
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key-here
```

### Run
```bash
# Dev client (iOS/Android)
npx expo start --dev-client

# Web
npx expo start --web
```

## 📁 Structure
```
app/                 # Expo Router screens
  _layout.tsx        # Root layout (providers, error boundary)
  index.tsx          # Onboarding
  notes/index.tsx    # Notes home
  notes/[id].tsx     # Note details + AI actions
  ai-tools/index.tsx # AI tools hub
  settings/index.tsx # Settings
components/           # Reusable UI (Header, NoteCard, BottomNav, AIButtons, ProgressBars, ErrorBoundary, Skeleton, NewNoteModal)
lib/ai/chatgpt.ts     # OpenAI service (summarize, improve, flashcards, quiz)
lib/storage/         # Notes + categories storage
constants/           # colors, typography, spacing
hooks/               # useNotes, useAI
```

## 🎨 Theming
- `constants/colors.ts` — purple/pink palette + gradients
- `constants/typography.ts` — Poppins/Inter font roles
- `constants/spacing.ts` — spacing, radius, layout constants

## 🤖 AI Service
`lib/ai/chatgpt.ts` exposes:
- `summarizeNote(text)` → string
- `improveWriting(text)` → string
- `generateFlashcards(text)` → Flashcard[]
- `generateQuiz(text)` → QuizQuestion[]

Uses `gpt-4o-mini` by default. Swap to `gpt-4o` in the file for higher quality.

## 📝 License
MIT