## Smart Notes AI — Expo React Native App
A cross‑platform (iOS, Android, Web) intelligent note‑taking app with AI‑powered learning tools, built using Expo, React Native, Firebase, and Gemini Flash API.

Smart Notes AI helps users not only store notes, but also understand, summarize, study, and improve them using integrated AI features.

✨ Features
- 📝 Category‑based notes with search, filters, and real‑time Firestore syncing

- ⭐ Starred notes and 🗑️ Trash system

- 📄 Note details with AI actions: Summarize, Improve Writing, Flashcards, Quiz

- 📊 Word count, character count, and reading‑time stats

- 🤖 AI Tools screen with progress bars and study utilities

- 📁 Category pages that dynamically load notes based on userId + category

- 🔐 Firebase Authentication (user accounts)

- 🔥 Firestore backend with per‑user note collections

- 🎨 Dark theme with gradients, spacing system, and custom typography

- 🧭 Expo Router navigation + bottom navigation bar

- 🛟 Loading skeletons, error boundaries, and safe AI request handling

- 💾 Local caching for faster navigation

- 📱 Fully reusable components (NoteCard, Header, BottomNav, NewNoteModal)

🚀 Getting Started
# Prerequisites
- Node.js 20+

- Expo SDK 50+

- Firebase project

- Gemini Flash API key

Install
```
bash
npm install
```
### Configure Firebase
Create firebase.ts inside /firebase:

ts
```
export const db = getFirestore(app);
export const auth = getAuth(app);
```
### Configure AI
Create a .env file:

Code
```
EXPO_PUBLIC_GEMINI_API_KEY=your-key-here
```
Run
bash
# Dev client (Android/iOS)
```
npx expo start --dev-client
```

# Web
npx expo start --web
📁 Project Structure
Code
```
app/                     # Expo Router screens
  _layout.tsx            # Root layout (providers, theme, error boundary)
  index.tsx              # Home / onboarding
  category/[id].tsx      # Category-based notes
  notes/index.tsx        # Notes home
  notes/[id].tsx         # Note details + AI actions
  ai-tools/index.tsx     # AI tools hub

components/              # Reusable UI components
  Header.tsx
  NoteCard.tsx
  BottomNav.tsx
  NewNoteModal.tsx
  ProgressBars.tsx
  Skeleton.tsx

hooks/
  useNotes.ts            # Firestore CRUD + stats
  useAI.ts               # Summaries, improvements, flashcards, quizzes

constants/
  colors.ts              # Dark theme + gradients
  typography.ts          # Inter/Poppins font roles
  spacing.ts             # Spacing, radius, layout constants

firebase/
  firebase.ts            # Firebase initialization

lib/
  storage/categories.ts  # Category definitions
```
🎨 Theming
- constants/colors.ts — dark palette + gradients

- constants/typography.ts — font sizes, weights, roles

- constants/spacing.ts — spacing scale, radius, layout constants

🤖 AI Service
useAI() exposes:
- summarize(text) → short summary

- improve(text) → improved writing

- flashcards(text) → list of flashcards

- quiz(text) → generated quiz questions

Powered by Gemini Flash API, wrapped in a safe request handler with:

- Retry logic

- Error handling

- Loading states

- Unified response format

### 🔥 Firestore Structure
Code
```
users/{userId}
   name: string
   email: string
   notes/
      {noteId}
         title: string
         content: string
         category: string
         preview: string
         starred: boolean
         trashed: boolean
         createdAt: timestamp
         updatedAt: timestamp
```
### 📝 License
MIT
