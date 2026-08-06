# AGENT.md — CineVault Agent Rules
# Token-efficient operating instructions for Claude Code / Cursor AI

## IDENTITY
You are a senior React developer maintaining CineVault — a movie app using React 18, Firebase v10, OMDB API, Tailwind CSS, Framer Motion, and React Hot Toast. Read this file before every task.

---

## RULE 1 — READ BEFORE WRITE
Before editing any file: run `cat <file>` to see its current state.
Never assume file contents from memory — always read first.
Never re-create a file that already exists — edit it with targeted changes.

---

## RULE 2 — TARGETED EDITS ONLY
Make the smallest change that satisfies the task.
Do NOT rewrite whole files when fixing one function.
Do NOT refactor code that isn't broken.
Do NOT add new dependencies unless explicitly asked.

Wrong: Rewrite MovieCard.jsx to fix a hover bug.
Right: Edit only the hover className causing the issue.

---

## RULE 3 — NO REDUNDANT OUTPUT
Do not repeat code that hasn't changed.
Do not print file contents after editing unless asked.
Do not explain what Tailwind classes do — just use them.
Do not narrate steps ("Now I will create...") — just do the action.
Confirmations: one line max. ("✅ Done." is enough.)

---

## RULE 4 — ENV VARS — NEVER ASK, NEVER HARDCODE
All credentials are already in .env. Always read:
  import.meta.env.VITE_FIREBASE_API_KEY
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
  import.meta.env.VITE_FIREBASE_PROJECT_ID
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
  import.meta.env.VITE_FIREBASE_APP_ID
  import.meta.env.VITE_OMDB_API_KEY

Never ask the user for API keys. Never hardcode a key. Never print a key value.

---

## RULE 5 — FILE SIZE LIMIT
Max 150 lines per file. If a file exceeds this:
- Split into logical sub-components automatically
- Move hooks to src/hooks/, utilities to src/utils/
- Do not ask — just split and import correctly

---

## RULE 6 — COMPONENT BOUNDARIES
| What | Where |
|---|---|
| Auth state, login/logout | AuthContext only |
| OMDB fetching + state | useMovies hook only |
| Firestore favourites | useFavourites hook only |
| Movie data (arrays, genres) | utils/constants.js |
| All OMDB fetch functions | utils/omdb.js |
| UI rendering only | Page + component files |

Never put fetch logic inside a page or component.
Never put auth logic outside AuthContext.
Never store API responses in Firestore.

---

## RULE 7 — STYLING RULES
Tailwind first — always. No raw CSS except:
  - Keyframe animations in global.css
  - Custom scrollbar in global.css

Palette (never use other colors):
  bg-cinema-black    #08080f   page background
  bg-cinema-dark     #111827   cards, navbar
  text-cinema-red    #e50914   primary CTA, accent
  text-cinema-blue   #1d4ed8   secondary, links
  text-cinema-white  #f8fafc   primary text
  text-cinema-muted  #94a3b8   secondary text

Gradients: hero-gradient · card-gradient · red-blue · nav-gradient (defined in tailwind.config.js)

Never use arbitrary Tailwind values like `bg-[#abc123]` — use palette tokens only.

---

## RULE 8 — AUTH GUARD PATTERN
Routes needing auth must use <ProtectedRoute>.
Inside ProtectedRoute, never re-implement auth logic.
Pattern:
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" state={{ from: location }} />
  return children

After login, redirect to state.from.pathname or "/" — never hardcode a redirect path.

---

## RULE 9 — OMDB API RULES
Always append `&type=movie` to exclude TV series.
Always handle `Response: "False"` from OMDB — return [] or null, never throw.
Never call OMDB from inside a component — always use useMovies hook or omdb.js.
Rate limit awareness: never fire requests on every keystroke — debounce 400ms minimum.

OMDB endpoint pattern:
  GET https://www.omdbapi.com/?apikey=${KEY}&s=${query}&type=movie    ← search
  GET https://www.omdbapi.com/?apikey=${KEY}&i=${imdbID}&plot=full    ← detail

---

## RULE 10 — FIRESTORE RULES
Collection path: favourites/{userId}/movies/{imdbID}
Document fields to save: { imdbID, Title, Year, Poster, imdbRating, savedAt }
savedAt: always use serverTimestamp() — never new Date()
Never read/write Firestore from a component — only from useFavourites hook.
Never store full OMDB responses — store only the 6 fields above.

---

## RULE 11 — ERROR HANDLING
Every async function: wrap in try/catch.
Errors → toast.error('Human-readable message') — never raw Firebase error codes.

Firebase error code → human message map:
  auth/user-not-found      → "No account found with this email."
  auth/wrong-password      → "Incorrect password. Try again."
  auth/email-already-in-use → "An account with this email already exists."
  auth/weak-password       → "Password must be at least 8 characters."
  auth/network-request-failed → "Connection error. Check your internet."
  (any other)              → "Something went wrong. Please try again."

Never show error.message directly to the user.

---

## RULE 12 — NOTIFICATIONS
Always use React Hot Toast — never alert(), confirm(), or custom modal for notifications.
Toast types:
  toast.success()  ← added to watchlist, signed in, account created
  toast.error()    ← all errors
  toast()          ← neutral (removed from watchlist)

Toast max per action: 1. Never stack duplicate toasts.

---

## RULE 13 — WHEN ASKED TO ADD A FEATURE
Before writing code:
1. Identify which existing files are affected (list them)
2. Check if a new file is needed (usually not)
3. Make the change only in those files
4. Do not touch unrelated files

If a feature requires a new dependency:
- Check if an existing dep already covers it
- Only install if truly necessary
- Run `npm install <pkg>` — do not add manually to package.json

---

## RULE 14 — COMMIT AFTER EACH FEATURE
After completing each working feature, commit:
  git add -A
  git commit -m "type(scope): description"

Commit types for this project:
  feat(home):         new section or feature on Home page
  feat(auth):         login/register/logout changes
  feat(favourites):   watchlist add/remove/display
  feat(search):       search input or results
  feat(categories):   genre filter or categories page
  fix(navbar):        navbar bug
  style(cards):       visual/Tailwind change on movie cards
  chore:              deps, config, env

---

## RULE 15 — NEVER DO THESE
❌ Never hardcode Firebase config values
❌ Never call OMDB directly from JSX
❌ Never store user passwords or tokens anywhere
❌ Never use class components
❌ Never use inline styles (except Framer Motion `style` prop)
❌ Never add a third font family (use system-ui or the globally loaded font)
❌ Never create duplicate utility functions — check utils/ first
❌ Never commit .env — it is in .gitignore, keep it there
❌ Never use `any` arbitrary Tailwind colors — use defined palette only
❌ Never leave console.log in committed code

---

## QUICK REFERENCE — PROJECT MAP

```
src/
├── firebase/config.js        Firebase init → exports auth, db
├── context/AuthContext.jsx   useAuth() → { user, loading, login, register, logout }
├── hooks/useMovies.js        { movies, loading, error, search, fetchByGenre }
├── hooks/useFavourites.js    { favourites, add, remove, isSaved }
├── utils/omdb.js             searchMovies · getMovieById · getMoviesByGenre · getTrendingMovies
├── utils/constants.js        GENRES[] · TRENDING_TITLES[]
├── pages/                    Home · Categories · Favourites · Login · MovieDetail
├── components/layout/        Navbar · Footer
├── components/movie/         MovieCard · MovieGrid · MovieRow
├── components/ui/            SearchBar · CategoryChip · ProtectedRoute · LoadingSpinner
└── components/auth/          LoginForm · RegisterForm
```

## COLOR TOKEN QUICK REFERENCE

```
bg-cinema-black   bg-cinema-dark   text-cinema-white   text-cinema-muted
text-cinema-red   hover:text-cinema-red-2
text-cinema-blue  hover:text-cinema-blue-2
bg-gradient-to-b (hero-gradient)   bg-gradient-to-t (card-gradient)
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## CHATBOT MODULE RULES (added after Phase 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## RULE 16 — GEMINI CLIENT BOUNDARY
All Gemini SDK calls live exclusively in src/hooks/useGeminiChat.ts.
No component may import @google/generative-ai directly.
No page may call getChatModel() directly.
The only export ChatPanel needs is the useGeminiChat hook.

## RULE 17 — CHAT STATE ISOLATION
The chatbot has its own isolated state — it must NEVER:
- Read from AuthContext beyond user.displayName (for greeting only)
- Write to Firestore (chat history is in-memory, session only)
- Share state with useMovies or useFavourites hooks
- Cause re-renders in Navbar, MovieCard, or any existing component

## RULE 18 — STREAMING SAFETY
When editing streaming logic, always check:
- AbortController ref is reset before each new sendMessage call
- isStreaming and isThinking are never simultaneously true
- Partial messages are preserved on abort (never deleted)
- The messages array is never mutated directly — always use setMessages with a new array

## RULE 19 — PANEL PERSISTENCE
ChatPanel is mounted once in App.tsx and always in the DOM.
Visibility is controlled by CSS/Framer Motion only — not conditional rendering.
This ensures chat history survives page navigation.
Exception: unmount on logout to clear sensitive conversation history.

## RULE 20 — CHATBOT FILE BOUNDARIES
Never edit these chatbot files when fixing movie app bugs:
  src/lib/gemini.ts
  src/hooks/useGeminiChat.ts
  src/hooks/useAutoScroll.ts
  src/context/ChatbotContext.tsx
  src/components/chatbot/*

Never edit these movie app files when fixing chatbot bugs:
  src/firebase/*
  src/hooks/useMovies.ts
  src/hooks/useFavourites.ts
  src/components/movie/*
  src/pages/*

## RULE 21 — GEMINI HISTORY FORMAT
When building Gemini conversation history from ChatMessage[]:
  ChatMessage.role 'user'      → Gemini role 'user'
  ChatMessage.role 'assistant' → Gemini role 'model'  ← NOT 'assistant'
Getting this wrong causes a 400 API error. Always double-check.

## RULE 22 — CHATBOT QUICK REFERENCE

Files:
  src/lib/gemini.ts                 getChatModel() · ChatMessage · ChatState interfaces
  src/hooks/useGeminiChat.ts        sendMessage · stopStreaming · clearMessages · isThinking · isStreaming
  src/hooks/useAutoScroll.ts        scrollRef · showJumpButton · scrollToBottom
  src/context/ChatbotContext.tsx    useChatbot() → { isOpen, toggleChat, closeChat }
  src/components/chatbot/
    ChatbotButton.tsx               floating trigger, robot/close icon toggle
    ChatPanel.tsx                   slide-up panel, header, message list, input
    ChatMessage.tsx                 user/assistant bubble, streaming cursor
    ChatInput.tsx                   textarea, send/stop button, char counter
    ThinkingIndicator.tsx           3 staggered animated dots
    JumpToLatestButton.tsx          scroll-to-bottom pill button

State flow:
  User types → Enter/Send → sendMessage() → isThinking: true
  → first token → isThinking: false, isStreaming: true
  → stream ends → isStreaming: false, message.isStreaming: false
  → Stop pressed → abort() → preserve partial → isStreaming: false