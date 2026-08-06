# 🎬 CineVault — Movie Discovery App

> A modern React + Vite movie application for discovering movies, browsing genres, saving favourites, and chatting with an AI movie assistant powered by a free AI SDK integration.

---

## ✨ Overview

CineVault is a cinematic web app built to deliver a polished movie discovery experience. Users can browse movies, explore categories, view details, save favourites, and ask an AI assistant for recommendations, comparisons, and general movie guidance.

The app combines a clean dark-themed UI with modern React architecture and external APIs to create a smooth, engaging experience for movie lovers.

---

## 🚀 Features

- Browse trending and popular movies
- Search and discover titles by keyword
- Explore movies by genre
- View detailed movie information
- Save favourite movies to a personal watchlist
- Chat with an AI movie assistant for recommendations and movie help
- Responsive design for desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router DOM |
| Styling | Tailwind CSS |
| UI Motion | Framer Motion |
| Authentication | Firebase Auth |
| Database | Firestore |
| Notifications | React Hot Toast |
| Icons | React Icons |
| AI Integration | AI SDK + OpenAI-compatible API |
| APIs | OMDB API |

---

## 🔌 APIs Used

### OMDB API
- Used to fetch movie search results, metadata, and details.
- Movies are queried with a movie-only filter to avoid series results.

### Firebase
- Authentication is handled through Firebase Auth.
- Favourite movies are stored in Firestore for each signed-in user.

### AI SDK / AI Provider
- The chatbot uses the AI SDK with an OpenAI-compatible provider.
- The app is configured to work with a free API key and a free model such as:
  - inclusionai/ling-3.0-tiny:free

---

## 🤖 AI Chat Assistant

CineVault includes a floating AI assistant called CineBot.

It can help users with:
- Movie recommendations
- “Is this worth watching?” style advice
- Similar movie suggestions
- Genre-based recommendations
- General movie-related questions

The assistant is designed to feel native to the app and supports streaming-style responses for a more interactive experience.

---

## 📁 Project Structure

```bash
src/
├── components/
│   ├── auth/
│   ├── layout/
│   ├── movie/
│   ├── ui/
│   └── chatbot/
├── context/
├── firebase/
├── hooks/
├── lib/
├── pages/
├── styles/
├── utils/
└── App.jsx
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (LTS)
- npm or yarn

### Installation

```bash
git clone <your-repo-url>
cd Capstone
npm install
```

### Environment Variables

Create a `.env` file in the root of the project and add:

```env
VITE_OMDB_API_KEY=your_omdb_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_AI_API_KEY=your_ai_provider_key
VITE_AI_MODEL=inclusionai/ling-3.0-tiny:free
```

### Run locally

```bash
npm run dev
```

Then open: http://localhost:5173

### Build for production

```bash
npm run build
```

---

## 🧪 Development Notes

This project was built with a focus on:
- modular React component structure
- clean separation of concerns
- reusable hooks and utilities
- scalable UI architecture
- smooth user experience with animations and transitions

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Amr Alshabasy
Software Engineer · FlyRank Intern
