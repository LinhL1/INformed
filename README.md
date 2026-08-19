# INformed

A gamified, browser-based media literacy course framed as an intelligence
analyst simulation. Users play as newly recruited analysts at a fictional
agency, working through six story-driven modules that teach real-world
skills: telling misinformation from disinformation, evaluating sources,
spotting deepfakes and manipulated images, recognizing propaganda and
coordinated social media manipulation, and fact-checking.

Each module unlocks narrative "case" scenes and lessons made of interactive
activities (quizzes, true/false drills, sorting, fill-in-the-blank,
scenario-based decisions). Progress and XP earned along the way are saved
per-user and persist across devices.

## Features

- **Story-driven modules** — six modules, each opening/closing with narrative
  scenes, building on a single running "case" across the whole course.
- **Interactive lessons** — quizzes, true/false, sorting, fill-in-the-blank,
  and scenario activities, each awarding XP.
- **Progression system** — XP, badges, and module unlocking based on
  completing the previous module.
- **Accounts** — email/password auth via Supabase; progress and
  XP sync across devices.
- **An in-app AI mentor** *(optional feature)* — a chat widget backed by
  a Supabase Edge Function that proxies to Gemini, scoped to course content.

## Tech stack

- **Frontend:** React 18 + TypeScript, Vite, React Router
- **UI:** shadcn/ui (Radix primitives), Tailwind CSS, Framer Motion, Lucide icons
- **Backend:** Supabase (Auth + Postgres) for accounts, progress, and XP
- **Optional AI feature:** Supabase Edge Function + Google Gemini API
- **Testing/tooling:** Vitest, Testing Library, ESLint

This is a purely client-side single-page app — there is no custom backend
server; the browser talks to Supabase directly.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (bundled with Node) — or [Bun](https://bun.sh/), both are supported
- A free [Supabase](https://supabase.com/) project (for auth and data
  persistence)

## DEV NOTES: Getting started

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd ms.informed
npm install
```

Or, using Bun:

```bash
bun install
```

### 2. Configure environment variables

Copy the example file and fill in your Supabase project's credentials
(found in your Supabase project under **Settings → API**):

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Set up the database

Two tables must exist in your Supabase project before sign-up/progress
tracking will work: `user_progress` and `user_xp`. Run the following in the
Supabase SQL editor:

```sql
create table user_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  module_id    text not null,
  subtopic_id  text not null,
  completed    boolean default false,
  completed_at timestamptz,
  unique(user_id, module_id, subtopic_id)
);

create table user_xp (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null unique,
  total_xp         integer default 0,
  earned_badges    text[] default '{}',
  quiz_bonuses     text[] default '{}',
  activity_bonuses text[] default '{}'
);
```

Enable Row Level Security on both tables and add policies so a user can only
`select`/`insert`/`update` rows where `user_id = auth.uid()`.

### 4. Run the dev server

```bash
npm run dev
```

The app runs at [http://localhost:8080](http://localhost:8080).

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Preview a production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the test suite once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Optional: Vale AI chat

The in-app "Vale" chat widget calls a Supabase Edge Function
(`supabase/functions/vale-chat`) that proxies to the Gemini API. It is not
required to run the app. To enable it:

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and link
   it to your project: `supabase link`.
2. Set the function secret: `supabase secrets set GEMINI_API_KEY=your-key`.
3. Deploy the function: `supabase functions deploy vale-chat`.
4. Run the `supabase/migrations` SQL against your project (via
   `supabase db push` or the SQL editor) to create the `vale_chat_usage`
   rate-limiting table.

## Project structure

```
src/
  components/     Shared UI, activity types, onboarding & story screens
  pages/          Route-level pages (landing, modules, lesson, profile, ...)
  data/           Course content (modules.tsx) and story beats
  hooks/          XP, progress, auth-aware data hooks
  context/        AuthContext (Supabase session state)
  lib/            Supabase client, utilities
supabase/
  functions/      Edge function powering the Vale chat feature
  migrations/     SQL migrations
```
