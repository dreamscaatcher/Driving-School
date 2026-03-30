# Driving Theory Study App — Complete Project Plan

## Project Overview

A web-based German driving theory (Fahrschule) study application deployed on Cloudflare Pages at `theory.gurinderghuman22.work`. The app presents multiple-choice questions with image/video support, tracks user progress, supports exam simulation, and syncs across devices via Supabase auth.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| UI Framework | React 18 + TypeScript | Type safety, component model, ecosystem |
| Build Tool | Vite 5 | Fast builds, zero-config Cloudflare Pages compatibility |
| Routing | React Router v7 | File-like routing, lazy loading |
| Styling | Tailwind CSS v3 | Rapid UI development, consistent design |
| State (local) | Zustand | Lightweight (~1KB), simple API |
| Auth & Database | Supabase (free tier) | Auth, PostgreSQL, real-time sync |
| i18n | react-i18next | Industry standard, lazy-loaded translations |
| Deployment | Cloudflare Pages | Free, global CDN, custom domain support |
| Testing | Vitest + React Testing Library | Fast, Vite-native |
| Linting | ESLint + Prettier | Code consistency |

---

## Feature Set (MVP)

### Core Quiz Engine
- Category-based question selection
- Support for text-only and image-based questions
- Randomised question order within categories
- Immediate feedback on answer selection (correct/incorrect with explanation)
- Score tracking per quiz session

### Progress Tracking
- Dashboard showing completion % per category
- Scores history per category
- Streak tracking (consecutive days studied)
- Weak areas identification (categories with lowest scores)

### Exam Simulation Mode
- Timed exam (30 questions, 30 minutes — mirrors German theory test)
- Random selection across all categories
- No immediate feedback (results shown at end)
- Pass/fail result (minimum 90% to pass)
- Exam history with date and score

### Study Tools
- Bookmark/favourite questions for review
- "Review wrong answers" mode — replays only previously incorrect questions
- Category filter and search

### Dark Mode
- System preference detection with manual toggle
- Persisted preference

### Accounts & Sync (Supabase)
- Email/password and Google OAuth sign-up/sign-in
- Progress synced to cloud database
- Works offline with localStorage, syncs when online
- Leaderboard (optional — top scores on exam simulation)

### i18n Ready
- All UI strings in translation files
- English as default language
- Infrastructure to add German, Turkish, Arabic, etc. later
- Questions themselves stay in English for now (can be extended)

---

## Project Structure

```
driving-theory-app/
├── public/
│   ├── images/
│   │   ├── signs/                  # Q21-Q40: SVG traffic sign files
│   │   ├── scenarios/              # Q1-Q20: intersection diagrams
│   │   ├── urban/                  # Q81-Q100: urban hazard photos
│   │   ├── motorway/              # Q71-Q80: motorway scenario images
│   │   └── conditions/            # Q41-Q70: road condition photos
│   ├── favicon.svg
│   └── manifest.json              # PWA manifest
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Root component + router
│   ├── vite-env.d.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Nav bar, dark mode toggle, user menu
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx         # Category navigation
│   │   │   └── Layout.tsx          # Shared layout wrapper
│   │   ├── quiz/
│   │   │   ├── QuestionCard.tsx    # Main question display (text + optional image)
│   │   │   ├── OptionButton.tsx    # Single answer option (A/B/C)
│   │   │   ├── ImageQuestion.tsx   # Image rendering (SVG/PNG/video)
│   │   │   ├── QuizProgress.tsx    # Progress bar within a quiz
│   │   │   ├── QuizResult.tsx      # End-of-quiz score summary
│   │   │   ├── Timer.tsx           # Countdown timer for exam mode
│   │   │   └── BookmarkButton.tsx  # Favourite/bookmark toggle
│   │   ├── dashboard/
│   │   │   ├── CategoryCard.tsx    # Category with progress ring
│   │   │   ├── StatsOverview.tsx   # Overall stats (questions answered, streak, etc.)
│   │   │   ├── WeakAreas.tsx       # Categories needing improvement
│   │   │   └── ExamHistory.tsx     # Past exam simulation results
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── AuthGuard.tsx       # Protected route wrapper
│   │   │   └── UserMenu.tsx        # Avatar, logout, settings
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── ProgressRing.tsx
│   │       ├── Toggle.tsx
│   │       └── Skeleton.tsx        # Loading placeholder
│   │
│   ├── pages/
│   │   ├── Home.tsx                # Landing / dashboard
│   │   ├── Quiz.tsx                # Active quiz page
│   │   ├── ExamMode.tsx            # Timed exam simulation
│   │   ├── Results.tsx             # Quiz/exam results
│   │   ├── Bookmarks.tsx           # Saved questions
│   │   ├── ReviewWrong.tsx         # Review incorrect answers
│   │   ├── Login.tsx               # Auth page
│   │   ├── Profile.tsx             # User profile & settings
│   │   └── Leaderboard.tsx         # Top exam scores
│   │
│   ├── stores/
│   │   ├── quizStore.ts            # Current quiz state (questions, answers, score)
│   │   ├── progressStore.ts        # Overall progress per category
│   │   ├── bookmarkStore.ts        # Bookmarked question IDs
│   │   ├── settingsStore.ts        # Dark mode, language preference
│   │   └── authStore.ts            # Auth state (user, session)
│   │
│   ├── lib/
│   │   ├── quiz-engine.ts          # Question selection, scoring, randomisation
│   │   ├── exam-engine.ts          # Exam mode logic (timer, pass/fail)
│   │   ├── supabase.ts             # Supabase client initialisation
│   │   ├── sync.ts                 # Offline-first sync logic
│   │   └── analytics.ts            # Weak area calculation, streak logic
│   │
│   ├── hooks/
│   │   ├── useQuiz.ts              # Quiz flow hook
│   │   ├── useAuth.ts              # Auth state hook
│   │   ├── useProgress.ts          # Progress data hook
│   │   ├── useTheme.ts             # Dark mode hook
│   │   └── useSync.ts              # Online/offline sync hook
│   │
│   ├── data/
│   │   ├── questions.json          # All questions (extended with image refs)
│   │   └── categories.ts           # Category metadata (name, icon, colour)
│   │
│   ├── i18n/
│   │   ├── index.ts                # i18next configuration
│   │   └── locales/
│   │       ├── en/
│   │       │   └── translation.json
│   │       └── de/                 # Ready for German translation
│   │           └── translation.json
│   │
│   ├── types/
│   │   ├── question.ts             # Question, Option, Category types
│   │   ├── progress.ts             # Progress, Score, Streak types
│   │   └── user.ts                 # User, Session types
│   │
│   └── styles/
│       └── globals.css             # Tailwind imports + custom CSS vars
│
├── supabase/
│   └── migrations/
│       ├── 001_create_profiles.sql
│       ├── 002_create_progress.sql
│       ├── 003_create_bookmarks.sql
│       └── 004_create_exam_results.sql
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
└── wrangler.toml                   # Cloudflare Pages config (optional)
```

---

## Updated Question JSON Schema

```json
{
  "id": 21,
  "category": "2 - Traffic Signs",
  "question": "What does this sign indicate?",
  "image": {
    "src": "/images/signs/sign-021-give-way-oncoming.svg",
    "alt": "Red triangle warning sign with red upward arrow and black downward arrow",
    "type": "sign"
  },
  "options": [
    { "label": "A", "text": "You must yield to oncoming traffic" },
    { "label": "B", "text": "You have priority" },
    { "label": "C", "text": "No overtaking" }
  ],
  "correct": "A",
  "explanation": "This sign indicates you must give way to oncoming traffic on a narrow road. The red arrow represents your direction of travel."
}
```

Key additions:
- `image` field (optional) — questions without images omit this
- `image.type` — helps the UI decide how to render (sign = centered icon, scenario = full-width photo, etc.)
- `explanation` — shown after answering, helps learning

---

## Supabase Database Schema

### Table: profiles
```sql
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: progress
```sql
CREATE TABLE progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    answered_correctly BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_id, answered_at)
);
```

### Table: bookmarks
```sql
CREATE TABLE bookmarks (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, question_id)
);
```

### Table: exam_results
```sql
CREATE TABLE exam_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    duration_seconds INTEGER,
    taken_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Implementation Phases

### Phase 1: Project Setup (Day 1)
1. Scaffold Vite + React + TypeScript project
2. Install and configure Tailwind CSS
3. Install and configure React Router
4. Set up ESLint + Prettier
5. Set up folder structure
6. Import questions.json
7. Create TypeScript types for Question, Option, Category
8. Set up i18next with English locale
9. Initialise Git repo and push to GitHub
10. Connect GitHub repo to Cloudflare Pages
11. Verify deployment at subdomain

### Phase 2: Core Quiz UI (Days 2–3)
1. Build Layout component (Header, Sidebar, Footer)
2. Build Home page with category cards
3. Build QuestionCard component (text-only first)
4. Build OptionButton with correct/incorrect states
5. Build QuizProgress bar
6. Build QuizResult summary page
7. Implement quiz-engine.ts (selection, scoring, randomisation)
8. Wire up Zustand quizStore
9. Add category routing (/quiz/:category)
10. Implement dark mode toggle with useTheme hook

### Phase 3: Image Support (Day 4)
1. Add sample sign SVGs to public/images/signs/
2. Update questions.json with image references for Q21-Q40
3. Build ImageQuestion component (handles SVG, PNG, future video)
4. Update QuestionCard to conditionally render images
5. Test responsive image display on mobile/desktop
6. Add lazy loading for images

### Phase 4: Study Tools (Day 5)
1. Build BookmarkButton component
2. Implement bookmarkStore with localStorage
3. Build Bookmarks page
4. Implement "Review Wrong Answers" logic
5. Build ReviewWrong page
6. Add question search/filter functionality

### Phase 5: Exam Simulation (Day 6)
1. Build Timer component
2. Implement exam-engine.ts (30 questions, 30 min, pass/fail at 90%)
3. Build ExamMode page
4. Build exam-specific Results page with pass/fail display
5. Store exam history in localStorage

### Phase 6: Supabase Integration (Days 7–8)
1. Create Supabase project
2. Run database migrations (profiles, progress, bookmarks, exam_results)
3. Set up Row Level Security policies
4. Configure Google OAuth provider
5. Build LoginForm and SignupForm components
6. Build AuthGuard for protected routes
7. Implement authStore
8. Build sync.ts — merge localStorage data with Supabase on login
9. Implement real-time progress sync
10. Build UserMenu component (avatar, logout)

### Phase 7: Dashboard & Analytics (Day 9)
1. Build StatsOverview (total questions answered, streak, accuracy %)
2. Build CategoryCard with progress ring
3. Build WeakAreas component (lowest-scoring categories)
4. Build ExamHistory component
5. Implement analytics.ts (streak calculation, weak area detection)
6. Build Leaderboard page (top exam scores from Supabase)

### Phase 8: Polish & PWA (Day 10)
1. Add manifest.json for PWA install
2. Add service worker for offline support
3. Add loading skeletons
4. Add page transitions / animations
5. Responsive testing (mobile, tablet, desktop)
6. Accessibility audit (keyboard nav, screen reader, contrast)
7. Performance audit (Lighthouse)
8. Final Cloudflare Pages deployment with custom domain

---

## Commands Reference (for Claude Code in VS Code)

### Phase 1 — Scaffold
```bash
# Create project
npm create vite@latest driving-theory-app -- --template react-ts
cd driving-theory-app

# Install core dependencies
npm install react-router-dom zustand @supabase/supabase-js react-i18next i18next

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react-hooks
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Initialise Tailwind
npx tailwindcss init -p

# Create folder structure
mkdir -p src/{components/{layout,quiz,dashboard,auth,ui},pages,stores,lib,hooks,data,i18n/locales/{en,de},types,styles}
mkdir -p public/images/{signs,scenarios,urban,motorway,conditions}
mkdir -p supabase/migrations
```

### Build & Dev
```bash
npm run dev          # Local dev server (port 5173)
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build locally
npm run test         # Run Vitest
npm run lint         # ESLint check
```

### Cloudflare Pages Deployment
```bash
# In Cloudflare Pages dashboard:
# Build command: npm run build
# Build output directory: dist
# Node.js version: 18
```

---

## Key Design Decisions

1. **Offline-first**: localStorage is the primary store. Supabase syncs in background. App works fully without internet.

2. **Image strategy**: SVGs for signs (small, scalable), optimised PNGs for scenarios (max 200KB each, 800px wide). All served from `/public/images/` via Cloudflare CDN.

3. **No SSR needed**: This is a client-side app. All data is either static JSON or fetched from Supabase. Vite's static build is perfect for Cloudflare Pages.

4. **i18n from day 1**: Even though only English is active, every UI string goes through `react-i18next`. Adding German later is just adding a translation file — zero code changes.

5. **Component-first**: Every visual element is a reusable component. This makes it easy to reskin or add new question types (e.g., video, drag-and-drop) later.

6. **German theory test rules**: Exam simulation mirrors the real test — 30 questions, mixed categories, 30-minute limit, 90% pass threshold.

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Supabase free tier limits | All core features work offline via localStorage. Supabase is enhancement, not dependency. |
| Image files too large | Enforce max 200KB per PNG. SVGs are already tiny. Use Cloudflare's built-in image compression. |
| Cloudflare Pages build failures | Vite builds are simple and reliable. No server-side runtime needed. |
| Question data grows large | JSON is loaded once and cached. 500 questions ≈ 500KB — negligible. |
| User loses progress | Dual storage (localStorage + Supabase). Data survives browser clear if logged in. |

---

## What You Need Before Starting

1. **GitHub account** — to host the repo and connect to Cloudflare Pages
2. **Cloudflare account** — you already have this (gurinderghuman22.work)
3. **Supabase account** — free at supabase.com (create project, get API keys)
4. **Node.js 18+** — for local development
5. **Sign images** — start with Q21-Q40 SVGs from Wikimedia Commons
6. **Google OAuth credentials** — from Google Cloud Console (for "Sign in with Google")

---

*This plan is ready to execute. Each phase is self-contained — the app is functional and deployable after Phase 2, with each subsequent phase adding features incrementally.*
