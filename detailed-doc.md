# ms.informed — Detailed Technical Walkthrough

Written as interview prep: not just *what* the code does, but *why* it's built this way,
what alternatives existed, and what the tradeoffs are. Read top to bottom once, then use
the headers as a menu when someone asks "walk me through X."

---

## 1. The 30-Second Pitch

**ms.informed** is a gamified, story-driven media-literacy course. Users play an
intelligence analyst at a fictional agency ("INformed"), progressing through 6 modules
(24 lessons) that teach misinformation/disinformation literacy — source evaluation, deepfake
detection, propaganda recognition, algorithmic manipulation, fact-checking. Progress and XP
persist to a cloud database so users can pick up on any device. There's also an in-character
AI chatbot mentor ("Vale") backed by Gemini.

It's a **client-side single-page application** — no custom backend server, no ORM, no REST
API you'd write yourself. React talks directly to Supabase (hosted Postgres + Auth) from
the browser using a public, RLS-protected API key. The *content* — all 6 modules, all
lesson text, quizzes, story dialogue — is hardcoded as typed TypeScript data, not stored in
a database or CMS.

---

## 2. Tech Stack — What, and Why

| Layer | Technology | Why this, not the obvious alternative |
|---|---|---|
| UI framework | React 18 + TypeScript | Team default; TS catches the "section.type is a valid string" class of bugs that plagues JSON-driven content systems (see §8). |
| Build tool | Vite + `@vitejs/plugin-react-swc` | Vite's dev server does native ESM + on-demand compilation instead of bundling everything upfront (webpack/CRA), so cold start and HMR are near-instant even as content data grows. SWC (Rust) compiles TS/JSX faster than Babel. |
| Routing | React Router DOM v6 | Standard client-side router; nested `<Route>` layouts (`AppShell`) let one `<Header>`+transition wrapper apply to many pages without repeating it per-page. |
| Animation | Framer Motion | One library used everywhere — page transitions, XP bar fills, staggered text reveals, drag-free "shake" feedback. Declarative (`animate={{...}}`) instead of imperative DOM manipulation or CSS keyframe sprawl. |
| Component primitives | shadcn/ui on Radix UI | Not an installed dependency you `npm update` — the component *source* is copied into `src/components/ui/`. You own and can edit every primitive; Radix underneath guarantees keyboard/focus/ARIA correctness for free (dialogs, dropdowns, tooltips) which is easy to get subtly wrong hand-rolling it. |
| Styling | Tailwind CSS v3 | Utility classes colocated with markup; all actual *colors* are indirected through CSS custom properties (`hsl(var(--accent))`) so theming (light/dark, per-module colors) is a CSS variable swap, not a class-name swap. |
| Icons | Lucide React | Tree-shakeable, consistent 24px stroke icon set; avoids hand-drawn SVGs or an icon font. |
| Theme switching | `next-themes` | Handles the FOUC (flash-of-wrong-theme) problem via a class on `<html>` set before paint. Currently locked to `defaultTheme="dark"`, `enableSystem={false}` — see §15. |
| Forms | react-hook-form + zod | Installed for shadcn's `form.tsx` primitive; the app's actual sign-in form doesn't use them (hand-rolled `useState` + regex, see §7) — a minor inconsistency, not a defect. |
| Backend | Supabase (Postgres + Auth + Edge Functions) | "Backend-as-a-service" — gets you a real relational DB, row-level auth enforcement, and JWT session management without writing/hosting a server. The tradeoff: business logic either lives in the client (trusted less) or in Edge Functions (small serverless Deno functions) — see §12 for where that boundary actually matters (API key protection). |
| AI | Google Gemini (`gemini-flash-lite-latest`) via Edge Function | Cheap/fast model sufficient for short in-character chat replies; proxied server-side so the API key never reaches the browser. |
| Testing | Vitest + Testing Library | Vite-native test runner (shares config/transform with the app, no separate Jest pipeline). Coverage is minimal — one example test — a known gap, not a hidden feature. |

**Package-manager note:** both `bun.lockb` and (historically) `package-lock.json` artifacts
exist — the project was scaffolded on Lovable.dev (see `lovable-tagger` dev dependency,
which tags DOM nodes with their source location for Lovable's visual editor) and has since
been worked on with more than one package manager. Not a deliberate architectural choice,
just accumulated history — worth knowing so you don't over-explain it as intentional.

---

## 3. Repository Map

```
src/
  main.tsx                 # React root; wraps App in ThemeProvider (dark, locked)
  App.tsx                  # BrowserRouter + route tree + AppShell layout
  index.css                # Tailwind layers + all design-token CSS variables

  context/AuthContext.tsx  # Supabase session state, exposed via useAuth()
  components/
    ProtectedRoute.tsx     # Route guard: redirect to /signin if no session
    Header.tsx             # Sticky ticker bar + profile menu + back nav
    PageTransition.tsx     # Shared Framer Motion page-enter wrapper
    LessonSection.tsx      # Switch-on-type renderer for lesson content blocks
    LessonPhaseIndicator.tsx
    XPNotification.tsx
    activities/            # TrueFalse, Sorting, FillBlank, Scenario mini-games
    story/SceneRenderer.tsx# Plays branching dialogue beats one at a time
    onboarding/             # 9 one-off screens + shared.tsx (Typewriter, StaggerLines, DesktopFrame)
    vale/                  # ValeWidget (FAB) + ValeChatPopup (chat UI)
    ui/                    # shadcn/ui primitives (owned copies, not a dependency)

  pages/
    LandingPage.tsx         # Public marketing page ("/")
    SignIn.tsx               # Combined sign-in/sign-up form
    OnboardingPage.tsx        # 9-screen narrative intro, post-auth
    ModulesPage.tsx           # Course roadmap + Agent Card (XP/level/badges)
    ModulePage.tsx            # One module's mission list + opening/closing story
    LessonPage.tsx            # The core learning experience — phase engine
    ProfilePage.tsx

  hooks/
    useProgress.ts          # Lesson completion state <-> user_progress table
    useXP.ts                 # XP/levels/badges state <-> user_xp table
    useStoryState.ts          # Story "seen" flags <-> auth user_metadata
    useValeChat.ts            # Chat message state + Edge Function calls

  data/
    modules.tsx              # ALL course content: 6 modules, 24 lessons, typed
    storyBeats.ts              # Narrative dialogue scenes, keyed by module/lesson

  lib/
    supabase.ts               # Supabase client singleton
    valeChat.ts                 # Typed wrapper around the vale-chat Edge Function call
    utils.ts                    # cn() — clsx + tailwind-merge helper

supabase/
  functions/vale-chat/       # Deno Edge Function: Gemini proxy for the AI mentor
    index.ts, persona.ts, grounding.ts
  migrations/                 # SQL migration history (Supabase CLI-managed)

notes.md                     # Long-form architecture doc (referenced by CLAUDE.md)
CLAUDE.md                    # Working-agreement + subsystem notes for AI-assisted edits
```

---

## 4. Build & Tooling Layer

- **Path alias**: `@/*` → `src/*`, configured in both `vite.config.ts` (`resolve.alias`)
  and `tsconfig`. Every import in the codebase uses `@/components/...` instead of relative
  `../../components/...` — avoids the classic "how many `../` do I need" churn when files move.
- **Env vars**: `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` read via `import.meta.env` (Vite's
  build-time env injection — anything prefixed `VITE_` gets statically replaced into the
  bundle at build time, *not* read at runtime from `process.env` like Node). This means the
  anon key is public in the shipped JS bundle by design — it's meant to be; security comes
  from **Row Level Security** at the database, not from hiding the key (see §9).
- **`lovable-tagger`**: only active in `mode === "development"` (conditionally spread into
  the Vite `plugins` array with `&& componentTagger()`, filtered for falsy). It's a
  build-time-only dev aid, stripped from production bundles automatically since it's simply
  never included.
- **ESLint**: flat config (`eslint.config.js`, the ESLint 9 format) with `typescript-eslint`
  and `eslint-plugin-react-hooks` (catches missing `useEffect` dependencies) and
  `eslint-plugin-react-refresh` (catches patterns that break Fast Refresh, e.g. exporting
  non-component values from a component file).
- **components.json**: the shadcn/ui CLI config. `"rsc": false` (this isn't Next.js/RSC),
  `cssVariables: true` (colors indirect through CSS vars, not hardcoded Tailwind color
  classes) — this is *why* theming works app-wide by editing `index.css` alone.

---

## 5. Architecture at a Glance

```
┌─────────────────────────── Browser ───────────────────────────┐
│                                                                  │
│   React SPA (Vite-bundled, client-rendered only — no SSR)        │
│                                                                  │
│   AuthContext ───────► supabase.auth.*  (session, JWT)            │
│   useProgress  ───────► table: user_progress                       │
│   useXP        ───────► table: user_xp                             │
│   useStoryState ──────► auth.users.user_metadata (JWT claims)        │
│   useValeChat  ───────► Edge Function: vale-chat                      │
│                                                                  │
│   Static data: src/data/modules.tsx, src/data/storyBeats.ts        │
│   (bundled into the JS, not fetched — "content as code")            │
└──────────────────────────────┬───────────────────────────────┘
                                │  HTTPS (anon key + user JWT)
                                ▼
                  ┌─────────────────────────────┐
                  │         Supabase              │
                  │  ┌──────────┐  ┌────────────┐ │
                  │  │  Auth /   │  │ Postgres    │ │
                  │  │  GoTrue   │  │  + RLS      │ │
                  │  └──────────┘  └────────────┘ │
                  │  ┌────────────────────────┐   │
                  │  │ Edge Function: vale-chat │───┼──► Google Gemini API
                  │  │ (Deno, server-side only) │   │    (server-side key)
                  │  └────────────────────────┘   │
                  └─────────────────────────────┘
```

**Key architectural decision: no custom backend server.** Everything that would normally be
a REST/GraphQL API route is instead a direct `supabase.from("table").select/insert/upsert()`
call from React, with Postgres RLS policies doing the authorization that a server's
middleware would otherwise do. The **one** exception is the Vale chat feature, which
*requires* a server-side component — not for business logic, but because the Gemini API key
is a secret that must never reach the browser. That's the textbook reason to reach for a
serverless function even in an otherwise BaaS-only architecture: **secret custody**, not logic.

---

## 6. Routing & the App Shell

`App.tsx` composes the route tree:

```
/signin                                  → SignIn                    (no auth, no shell)
/  (AppShell)                            → LandingPage                (public, has Header)
ProtectedRoute
  /onboarding                            → OnboardingPage             (auth required, NO shell — full-screen)
  AppShell
    /modules                             → ModulesPage
    /module/:moduleId                    → ModulePage
    /module/:moduleId/lesson/:lessonId   → LessonPage
    /profile                             → ProfilePage
    *                                    → NotFound
```

Two nested layout patterns worth naming explicitly:

1. **`ProtectedRoute` as a layout route** — it renders `<Outlet/>` (React Router v6's
   "render whatever child route matched here") only if `session` exists, else redirects to
   `/signin` carrying the attempted location in route `state.from`, so sign-in can send the
   user back to where they meant to go. This is the **guard clause** pattern applied to
   routing: one component, reused for every protected route, instead of an `if (!user)
   redirect()` check duplicated in every page.
2. **`AppShell` as a layout route nested *inside* `ProtectedRoute`** — note `/onboarding` is
   inside `ProtectedRoute` but *outside* `AppShell`. That's deliberate: onboarding needs auth
   but must NOT show the site header/chrome (it's a full-screen cinematic sequence). Nesting
   layout routes this way means "requires auth" and "has the app chrome" are two independent,
   composable axes rather than one monolithic `<Layout requiresAuth showHeader>` component
   with boolean props.

`AppShell` also wraps `<Outlet/>` in `<AnimatePresence mode="wait">` keyed on
`location.pathname`. `mode="wait"` means the *old* page's exit animation fully finishes
before the *new* page's enter animation starts — a small but deliberate choice: without
`"wait"`, both pages would animate simultaneously (crossfade), which reads as "flashy" but
also as janky if the pages have different heights (layout jump mid-transition).

---

## 7. Authentication System

**`AuthContext`** (`src/context/AuthContext.tsx`) is the single source of truth for auth
state, exposed via the `useAuth()` hook. Internally:

```ts
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false) })
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  return () => subscription.unsubscribe()
}, [])
```

Two things happen on mount: (1) a one-time fetch of whatever session is already persisted
(Supabase's client stores the JWT in `localStorage` itself — the app never touches
`localStorage` directly for this), and (2) a subscription to *future* auth state changes
(sign-in, sign-out, token refresh) so every consumer of `useAuth()` re-renders reactively.
This is the **Observer pattern** — `AuthContext` is the subject, every component calling
`useAuth()` is an observer, and React's context re-render mechanism is the notification
channel.

**Why Context instead of prop-drilling or a global store (Redux/Zustand)?** Auth state is
read in a handful of places (`ProtectedRoute`, `Header`, every hook that needs `user.id`) —
small enough surface area that a dedicated state library would be overkill. Context is the
right-sized tool here; if the app's shared state surface grew significantly (many
independent slices, frequent cross-cutting updates), that calculus would flip.

**Sign-in/sign-up flow** (`SignIn.tsx`): one component, one form, mode toggled by local
`useState<'signin'|'signup'>` rather than two separate routes/components — the fields are
identical, so this avoids duplicating markup for a purely cosmetic distinction (submit button
label, "already have an account?" link). Client-side validation (email regex, 8-char password
minimum) happens *before* the network call purely as fast-feedback UX; Supabase re-validates
server-side regardless, so this is a UX optimization, not a security boundary.

On successful sign-in, the app does **not** navigate straight into the app — it navigates to
`/onboarding`, passing the originally-intended destination (`from`) in route state. Onboarding
itself later either completes into lesson 1 or (if `user_metadata.onboarding_seen` was already
true) offers a "Skip intro" that honors `from`. See §11.

**Row Level Security is the actual security boundary**, not client code. The anon key
shipped in the JS bundle grants *no* implicit permissions — every table's RLS policies check
`auth.uid() = user_id`, and `auth.uid()` resolves from the caller's JWT (or `null` if
unauthenticated). This means even a malicious client rewriting the JS to call
`supabase.from("user_progress").select("*")` with no `.eq("user_id", ...)` filter would still
only ever get back rows Postgres itself decides they're allowed to see. **This is the core
security model of the whole app**: trust nothing in the browser, enforce everything in the
database.

---

## 8. Data / Content Layer — `src/data/modules.tsx`

The entire curriculum — 6 modules, 24 lessons, every quiz/activity/paragraph — is a single
typed TypeScript constant, not JSON, not a CMS, not a database table.

```ts
interface LessonSection {
  type: "text" | "callout" | "quiz" | "activity" | "image" | "bullets"
      | "key-term" | "video" | "true-false" | "sorting" | "fill-blank" | "scenario";
  title?: string;
  content: string | ReactNode;
  // type-specific optional fields: items?, term?, src?, options?, correctIndex?,
  // trueFalseItems?, sortingCategories?, sortingItems?, fillBlankItems?, scenarioData?
}
interface Subtopic { id, title, description, estimatedMinutes, storyBriefing?, sections: LessonSection[] }
interface Module    { id, number, title, description, color, chapterTitle, storyIntro, subtopics: Subtopic[] }
```

**Why this design, and why it's the right call here:**

- `LessonSection.type` is a **discriminated union tag** (a "sum type" in type-theory terms).
  TypeScript can't fully narrow the *rest* of the object's shape based on `type` here because
  all the type-specific fields are optional on one flat interface rather than a true union of
  distinct interfaces (`{type:"quiz", options, correctIndex} | {type:"image", src, alt} | ...`)
  — a stricter design *would* use a real discriminated union so `section.type === "quiz"`
  narrows `section.options` from `string[] | undefined` to `string[]`. As-is, the renderer
  (`LessonSection.tsx`) does `section.type === "quiz" && (...)` and TypeScript still shows
  `options` as optional, requiring `section.options?.map(...)`. This is a known soft spot —
  worth naming as a "what would you improve" answer, not a hidden landmine.
- Content-as-TypeScript means **authoring a lesson is a compiled, type-checked operation** —
  forget a required field and the build fails, rather than discovering a broken lesson at
  runtime (the failure mode of hand-written JSON or a headless CMS with a loose schema). The
  cost: **any content edit requires a code change and redeploy** — there is no non-engineer
  content-editing workflow. That's a deliberate tradeoff given the team size and content
  volume (six authored modules, not a scaling content operation).
- `content: string | ReactNode` lets some sections embed real `<a>` tags with external links
  (e.g. citing a source) directly as JSX rather than inventing a markdown-subset parser for
  "just links." The tradeoff (documented in `notes.md`'s gotchas) is that the same field does
  double duty as an image/video caption elsewhere, so TypeScript can't stop you from putting
  JSX where only a caption string is expected — a `caption?: string` field would have been
  cleaner, but wasn't worth a refactor for the actual usage pattern that exists.

**Component that consumes this**: `LessonSection.tsx` is essentially a big `switch`
(implemented as chained `&&` JSX blocks) over `section.type` — one render branch per content
type, each producing a self-contained card. Adding a new content type means adding one case
here and one variant to the union — a closed, easy-to-audit extension point.

---

## 9. Persistence Layer — Supabase Schema, RLS, and the Custom Hooks

### Schema

```sql
create table user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  module_id text not null,
  subtopic_id text not null,
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, module_id, subtopic_id)   -- ← makes upsert idempotent
);

create table user_xp (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  total_xp integer default 0,
  earned_badges text[] default '{}',
  quiz_bonuses text[] default '{}',
  activity_bonuses text[] default '{}'
);

create table vale_chat_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  usage_date date not null default current_date,
  request_count integer not null default 0,
  unique(user_id, usage_date)                -- ← one row per user per day
);
```

Every table: `enable row level security`. `user_progress` and `user_xp` have three
near-identical policies (`select`/`insert`/`update` all gated on `auth.uid() = user_id`);
`vale_chat_usage` is `select`-only for clients — its single write path is the
`increment_vale_chat_usage()` SECURITY DEFINER function, so users can't reset their own
rate-limit counter. `on delete cascade` means
deleting an `auth.users` row automatically deletes all of that user's rows in every child
table — no orphaned data, no manual cleanup job needed.

**The `unique(...)` constraints are what make `upsert` safe and idempotent.** Postgres'
`upsert` (`INSERT ... ON CONFLICT (...) DO UPDATE`) needs to know which column(s) define "this
is the same logical row" — that's exactly what these constraints declare. Calling
`markComplete` twice for the same lesson is a no-op the second time at the DB level, not
something the client has to guard against with a pre-check.

### `useProgress` — nested hashmap over a flat table

The hook fetches `{module_id, subtopic_id}` rows once per login and reshapes them client-side
into a nested dictionary:

```ts
type Progress = { [moduleId: string]: { [subtopicId: string]: boolean } }
```

This is a deliberate **data-structure transformation for O(1) lookup**: the DB naturally
returns a flat list of rows (relational, row-oriented), but the UI asks "is lesson X in module
Y complete?" over and over (every mission card, every progress bar). Reshaping once into a
2-level hashmap turns every subsequent `isComplete(moduleId, subtopicId)` check into two
constant-time object property lookups instead of an O(n) `.find()` scan through a flat array
on every render. This is the same "index it once, query it many times" tradeoff behind a
database index — pay a one-time O(n) cost to convert to a queryable shape, then get O(1)
reads thereafter.

`markComplete` is **optimistic**: it updates local React state immediately (spread into the
nested map), *then* fires the `upsert`. If the write fails, it explicitly rolls the optimistic
update back (deletes the just-added key) rather than leaving local state claiming progress the
database doesn't actually have — a compensating action, the same idea behind a saga pattern in
distributed systems (do the local step, and if the remote step fails, undo the local step
rather than leaving the two out of sync).

### `useXP` — set-membership dedup via a hashmap, serialized as a Postgres array

```ts
interface XPState { totalXP: number; earnedBadges: string[]; quizBonuses: {[key:string]:boolean}; activityBonuses: {[key:string]:boolean} }
```

`quizBonuses`/`activityBonuses` are **used as hash sets** in memory (`{[key]: true}` — the
value is never read, only key presence checked: `if (prev.quizBonuses[quizKey]) return prev`,
an O(1) "have I already awarded this?" check). Postgres has no native "set" column type
convenient for this, so on write the hook flattens the object to its keys (`Object.keys(...)`)
into a `text[]` array; on read it does the inverse (`Object.fromEntries(arr.map(k => [k,
true]))`). **This is a classic representation mismatch between the storage layer and the
in-memory access pattern** — Postgres arrays are ordered and allow duplicates (wrong shape for
"is X a member?"), so the hook translates at the boundary rather than doing O(n) `.includes()`
scans against the raw array on every award check.

**Why content-based dedup keys, not positional ones** (documented as a deliberate fix in
`notes.md`): the key format is:

```
`${moduleId}-${subtopicId}-${section.title || section.type}-${index}`
```

An earlier version keyed on `currentPhaseIndex` (the *array position* of the phase at runtime).
The problem: if you reorder or insert a section in `modules.tsx`, every subsequent section's
index shifts, and a user who'd already earned XP for "the 3rd quiz" would find "the 3rd quiz"
is now a *different* quiz — silently re-awardable, or worse, silently un-awardable. Keying on
the section's own title/type instead makes the identity stable across content reordering —
the same principle as React's own guidance to key list items by a stable ID, not by array
index.

**XP awarding is fire-and-forget** (`void supabase.from(...).upsert(...)` — no `await`, no
error handling), unlike `useProgress.markComplete`, which *does* await and roll back on
failure. This is a real, acknowledged inconsistency: `LessonPage.handleNext` explicitly
`await`s `markComplete` specifically because the next page mounts a fresh `useProgress()` that
refetches from scratch, and a race there would incorrectly show a module as still locked. XP
has no equivalent "next render depends on this having landed" moment, so the extra latency of
awaiting it wasn't judged worth adding — a real tradeoff between correctness-by-construction
and perceived responsiveness, not an oversight left unexamined.

### `useStoryState` — session claims instead of a table

Onboarding-seen and per-scene "seen" flags live in **Supabase Auth's `user_metadata`**
(`supabase.auth.updateUser({ data: {...} })`), not a database table. Rationale: `user_metadata`
rides inside the session JWT itself, so it's readable *synchronously* the instant a session
exists — no extra fetch, no loading flash, no race between "is the session ready" and "is the
seen-flag ready." The tradeoff: it's client-writable (any authenticated user could forge their
own `story_seen` flags via the client SDK) — acceptable here because the worst case is a user
skipping/replaying cosmetic narrative content, not a security or integrity issue. Choosing the
right persistence mechanism per piece of state — table vs. JWT claim — based on its actual risk
and latency profile, rather than defaulting to "everything is a table," is the interesting
decision here.

### Failure mode worth knowing cold

If the two tables were never created (a manual one-time SQL step, not something Supabase
provisions automatically), every hook fetch fails, but the app **doesn't crash** — hooks keep
their default empty state, and `useXP.syncToSupabase` fails silently. From a user's
perspective: progress "resets" on every refresh, but nothing visibly errors. This is the sharp
edge of "hooks swallow fetch errors to keep the UI resilient" — great for graceful
degradation, bad for debuggability, since the failure is invisible until someone specifically
checks the Supabase dashboard.

---

## 10. Lesson Engine — the Phase State Machine

`LessonPage.tsx` is the most algorithmically interesting file in the app. A lesson
(`Subtopic`) is an unordered bag of `LessonSection`s of mixed types; the page needs to turn
that into an ordered, click-through sequence of "phases."

```ts
function classifySection(section): "story" | "learn" | "practice" {
  return ["quiz","true-false","sorting","fill-blank","scenario","activity"].includes(section.type)
    ? "practice" : "learn";
}

function buildPhases(sections, hasStoryBriefing) {
  const phases = [];
  if (hasStoryBriefing) phases.push({ type: "story", sections: [] });
  const learn = sections.filter(s => classifySection(s) === "learn");
  const practice = sections.filter(s => classifySection(s) === "practice");
  if (learn.length) phases.push({ type: "learn", sections: learn });
  for (const p of practice) phases.push({ type: "practice", sections: [p] }); // one phase EACH
  phases.push({ type: "complete", sections: [] });
  return phases;
}
```

This is a **partition-and-group algorithm**, O(n) over the section list: it buckets sections
into two groups, bundles all "learn" content into a *single* scrollable phase (reading
material doesn't need to be paginated one-block-at-a-time), but explicitly gives *each*
practice activity its **own** phase (so a quiz and a sorting exercise never compete for
attention on the same screen, and progress through practice can be tracked sub-step by
sub-step). The result is a flat array like `[story, learn, practice, practice, practice,
complete]` that fully describes lesson navigation as **a finite state machine with one integer
of state**: `currentPhaseIndex`. `handleNext`/`handlePrev` are just
`min(i+1, len-1)`/`max(i-1, 0)` clamped increments — the entire lesson-navigation complexity
boils down to array indexing, because the hard part (grouping/ordering) was solved once,
upfront, in `buildPhases`. This is memoized with `useMemo(() => buildPhases(...), [subtopic])`
so it isn't recomputed on every keystroke/render — only when the lesson itself changes.

**XP awarding is keyed per-section, not per-phase**, using the same content-based key format
as §9, computed inline at render time:

```ts
onQuizCorrect={() => handleQuizCorrect(`${module.id}-${subtopic.id}-${section.title || section.type}-${index}`)}
```

**Completion sequencing** deliberately `await`s the Supabase write before navigating away
(explained in §9) — a concrete example of "optimistic updates are the default, but you opt
back into synchronous waiting exactly where a downstream read depends on this write having
landed," rather than applying one blanket policy everywhere.

### Activity components — four small, independent state machines

`src/components/activities/*` each implement the same shape: local `useState` for
user-in-progress answers, a `submitted` boolean gate, a scoring function, and an
`onComplete(score)` callback bubbled up. Two worth calling out for their internal logic:

- **`SortingActivity`**: "tap an item, then tap a category" is modeled as
  `activeItem: number | null` (which item is "armed" for placement) plus
  `placements: (number|null)[]` (a parallel array mapping item-index → category-index or
  `null` if unplaced). This avoids a two-array cross-reference — one array, indexed by item,
  is sufficient to represent "where did each item go," and `unplacedItems` is derived by
  filtering that array for `null`, not tracked as separate state (a **single source of
  truth** principle — there's exactly one place placement data lives, so it can't drift out of
  sync with itself).
- **`FillBlankActivity`**: answer checking normalizes both sides
  (`.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "")`) before comparing, and checks against
  both a primary `correctAnswer` and an optional `acceptableAnswers[]` list — free-text input
  needs fuzzy-enough matching that "Disinformation." and "disinformation" aren't marked wrong
  over punctuation/case, without going as far as real NLP/fuzzy-matching (edit distance, etc.)
  which would be overkill for single-word/short-phrase answers.

---

## 11. Gamification System — XP, Levels, Badges

`useXP.ts` also exports pure functions/constants used across pages:

```ts
const LEVELS = [
  { level: 1, title: "Recruit",         xpRequired: 0   },
  { level: 2, title: "Field Agent",     xpRequired: 100 },
  { level: 3, title: "Analyst",         xpRequired: 265 },
  { level: 4, title: "Senior Operative",xpRequired: 530 },
  // level 5/6 commented out — see below
];

function getLevel(xp) {
  let current = LEVELS[0];
  for (const level of LEVELS) { if (xp >= level.xpRequired) current = level; else break; }
  const nextLevel = LEVELS.find(l => l.xpRequired > xp);
  ...
}
```

`getLevel` is a **linear scan with an early-break**, over an array sorted ascending by
`xpRequired` — functionally this is "find the last element ≤ xp," which is a textbook
**binary search** candidate (O(log n) instead of O(n)). It's implemented as a linear scan
instead, and that's the *correct* engineering call here, not an oversight: `LEVELS.length` is
4 (soon 6). The crossover point where binary search's asymptotic advantage would matter is
nowhere near 4-6 elements — at that scale, the simpler, more obviously-correct linear scan
wins on readability with zero real performance cost. **This is worth being able to articulate
explicitly in an interview**: knowing the "better" algorithm and *choosing not to use it*
because the input size makes the complexity difference immaterial is itself the skill being
assessed, not just knowing binary search exists.

**Badge unlocking** is recomputed as a *pure derivation* every time XP changes, not stored as
its own independent flag being toggled:

```ts
const newBadges = BADGES.filter(b => level.level >= b.requiredLevel && !prev.earnedBadges.includes(b.id));
```

This means `earnedBadges` is always *recomputable from `totalXP` alone* — badges can never
drift out of sync with level (there's no code path that sets XP without also re-checking
badges), because the check runs inline inside every XP-awarding function
(`addXP`/`awardQuizXP`/`awardActivityXP`) rather than being a separately-triggered side
effect. **Single source of truth again**: `totalXP` is the only real state; `level` and
newly-unlocked badges are both *functions of* that one number, computed on demand, never
stored redundantly in a way that could go stale. (`earnedBadges` itself *is* persisted, but
only as a cache of "which badges has this XP total already crossed the threshold for" —
recomputing it from scratch would yield the same answer.)

**Levels 5–6 exist as commented-out array entries, not a feature flag.** This is a real,
findable code smell worth being able to name accurately: it's "soft-disabled content," not a
toggleable feature — turning it back on means uncommenting code and redeploying, not flipping
a runtime flag. A cleaner version would gate it behind an explicit boolean/environment flag if
the intent were to re-enable it dynamically later; as a permanent design point (the course
currently only has enough content to reach level 4), commented-out is a pragmatic "delete later
if truly abandoned, trivial to resurrect if not" choice — reasonable for content still being
authored, less so as a long-term pattern.

---

## 12. Narrative / Story Engine

Two systems play scripted narrative content: the 9-screen onboarding sequence (fixed, linear,
one-time) and the per-module `SceneRenderer` system (branching, replayable). The interesting
one is `SceneRenderer`.

### Data model (`src/data/storyBeats.ts`)

A story is a flat array of **beats**: `{ speaker?, text, choice?, notifications? }`. No
speaker = narration; `"system"` = terminal-style card; `"vale"`/`"player"` = dialogue.
Optionally a beat *blocks* advancement on either a multiple-choice `choice` or a "spot the
flagged notification among decoys" `notifications` mini-game.

### Playback algorithm

```ts
const [queue, setQueue] = useState<SceneBeat[]>(beats);
const [index, setIndex] = useState(0);

const pick = (choiceId, option) => {
  const responses = option.response ?? [];
  const nextQueue = [...queue.slice(0, index + 1), ...responses, ...queue.slice(index + 1)];
  setQueue(nextQueue);
  setIndex(index + 1);
};
```

This is the single cleverest piece of logic in the codebase: **branching dialogue implemented
as array splicing rather than a tree/graph data structure.** Instead of modeling the
conversation as a proper directed graph (nodes = beats, edges = "next beat" or "next beat
given choice X") and writing a graph-traversal walker, the beats for whichever option the
player picked are **spliced directly into the flat queue array at the current position** —
functionally: "insert this branch's beats right after where we are, then keep advancing
linearly like normal." Every choice's `response` beats converge back onto whatever beat was
already `queue[index+1]` before the splice, because that beat is still there, just now pushed
further down the array — so **every branch reconverges automatically**, with no explicit
"next beat ID" bookkeeping required. This is the same idea as **macro expansion / inline
substitution** in a compiler: you don't build a call graph, you textually splice the expansion
in at the call site and let normal sequential execution continue through it.

The tradeoff: this only works because choices in this app are explicitly designed to be
**flavor, never gating** (documented in the file's own header comment: "every option's
`response` beats splice in and converge on the same next beat"). If choices needed to lead to
*genuinely divergent* future beats (not just converge), a flat splicable queue would break down
and you'd need the real graph. Recognizing *which* data structure a problem actually needs —
and that a flat array is sufficient specifically because of a domain constraint (choices never
branch permanently) — is the transferable lesson here, not "arrays are secretly graphs."

### Seen-once-then-skippable-replay state machine

Every scene position (`opening`, `closing`, `beforeLesson[id]`) has this rule: **first viewing
is forced** (no skip button), **every viewing after that is auto-played but skippable**. This
is tracked with two layers of state:

1. **Persistent** (`hasSeen(key)` from `useStoryState`, backed by `user_metadata.story_seen`)
   — survives across sessions/devices, answers "has this user *ever* seen this scene."
2. **In-visit** (`openingShown`/`closingShown` local `useState`, reset on every remount) —
   answers "has this scene played *during this page visit already*."

Layer 2 exists to solve a specific reactivity bug class: `markSeen(key)` flips `hasSeen(key)`
to `true` **immediately** (it's derived from React state, not from a stale prop), which — if
the "replay" render branch's condition were *just* `hasSeen(key)` — would make the replay
condition true again the instant the first-time viewing finishes, re-triggering the same scene
in an infinite loop. Gating on `hasSeen(key) && !shownThisVisit` breaks that loop: the moment a
scene finishes playing (first time *or* replay), the in-visit flag flips and blocks that scene
from re-triggering again until the component remounts (i.e., the user navigates away and
back). **This is the general pattern of "a derived/reactive flag flipping mid-render loop"** —
worth recognizing on sight, because it's a common class of bug in any state-driven (not
purely-imperative) UI code.

`ModulePage`'s `replayStep` default (`"closing"` if closing has already been seen, else
`"opening"`) is a documented bug-fix: it used to always default to `"opening"`, which meant
the single "Skip replay" button (which exits the *entire* replay, not just the current scene)
could be clicked before the closing scene ever got a chance to play — so a returning visitor
to a *finished* module would never actually see the case-file closing content, just the intro
again. The fix encodes a UX principle directly into a default-value expression: **a returning
user should land on the current state of things, not be forced back through the intro.**

---

## 13. Onboarding Sequence

A fixed 9-screen linear sequence (`OnboardingPage.tsx` + `src/components/onboarding/*`), one
component per screen for independent restyling. Forward-only: click/Enter/Space/ArrowRight
advances (`advance()`); there's no back button by design — this is a cinematic intro, not a
form users need to correct. `seenBefore` is captured **once**, in a lazy `useState` initializer
(`useState(() => !!user?.user_metadata?.onboarding_seen)`), specifically so the skip button's
visibility can't flicker mid-sequence if `user_metadata` were to update reactively during the
same visit — it's a decision frozen at mount time, not a live-reactive value.

Completing the last screen (or skipping) both call `markSeen()` — a small, `seenBefore`-gated
function that only calls `supabase.auth.updateUser` if this is genuinely the first time,
avoiding a redundant write on every subsequent skip.

---

## 14. Vale — the AI Mentor (Edge Function Architecture)

This is the one place the app steps outside "pure BaaS, no custom server," and it's a good
example of *when that's actually necessary*.

**Client side** (`src/lib/valeChat.ts` + `src/hooks/useValeChat.ts`): a typed wrapper around
`supabase.functions.invoke("vale-chat", { body: {...} })`. All error branches are unwrapped
into a single `ValeChatRequestError` with an **in-character** message (e.g. "Vale's offline.
Not your fault — try again later.") — errors are treated as part of the persona's voice, not
generic toast text, which is a small but deliberate UX-consistency decision.

**Server side** (`supabase/functions/vale-chat/index.ts`, a Deno Edge Function):

1. **Auth check** — extracts the caller's JWT from the `Authorization` header, creates a
   *scoped* Supabase client with that header attached, and calls `.auth.getUser()`. This means
   the Edge Function inherits the caller's RLS identity rather than using a service-role
   bypass key — it can only read/write the `vale_chat_usage` rows the *calling user* is allowed
   to touch, same trust model as the client.
2. **Rate limiting — fixed-window counter algorithm.** One row per `(user_id, usage_date)`
   in `vale_chat_usage`, atomically incremented on every request via the
   `increment_vale_chat_usage()` RPC; if the returned count exceeds `DAILY_LIMIT` (40), reject
   with 429. Clients can only read that table, never write it — otherwise the counter they're
   limited by would be theirs to reset. This is the simplest rate-limiting algorithm that exists (compare: sliding
   window log, sliding window counter, token bucket, leaky bucket) — it resets hard at
   midnight rather than smoothing usage over a rolling window, which means a user could send 40
   requests at 11:59pm and another 40 at 12:01am. That's an accepted tradeoff for a
   cost-control guard rail (protecting a paid Gemini API budget from abuse), not a
   security-critical throttle — the simplicity/correctness tradeoff clearly favors simplicity
   here.
3. **Grounding assembly** — the system prompt sent to Gemini is
   `VALE_PERSONA + moduleGrounding`, where `moduleGrounding` is looked up from a **hand-maintained**
   `Record<moduleId, {title, summary}>` (`grounding.ts`), *not* derived at request time from
   `modules.tsx`. The file's own comment explains why: this function runs on Supabase's Deno
   Edge Runtime, a completely separate build/deploy pipeline from the Vite app — the two
   aren't wired together, so there's no automatic way to "import" the Vite app's content data
   into a Deno function without a shared build step that doesn't currently exist. This is a
   **known, explicitly-flagged content-duplication tradeoff**: module summaries can drift out
   of sync with the real lesson content if one is updated and not the other, and (also flagged
   in-file) 3 of 6 modules don't have summaries filled in yet — Vale falls back to a
   general/all-modules summary for those, meaning module-scoped grounding is a
   **partially-implemented feature**, not a shipped one.
4. **Model call with retry** — a `for` loop, `MAX_ATTEMPTS = 2`, retrying once on a `5xx`/fetch
   failure with a fixed 500ms delay before the retry. This is retry logic, but *not*
   exponential backoff (which would be `delay *= 2` per attempt) — with only 2 total attempts,
   backoff strategy is moot; it only matters once you're retrying 3+ times and need to avoid
   hammering an already-struggling upstream.
5. **Model selection is itself a documented tradeoff**: the code comment explains
   `gemini-flash-lite-latest` was chosen over the heavier `gemini-flash-latest` specifically
   because the heavier model returned frequent `503` "high demand" errors under real load,
   while the lite model was reliably fast (~0.5s) for Vale's short-reply use case — a concrete
   example of choosing the *smaller* model not for cost but for **empirically-measured
   reliability** for the specific task shape (short chat replies, not long-form reasoning).

**Persona/grounding separation** (`persona.ts` vs `grounding.ts`) is its own small piece of
design: the *voice* (how Vale talks — tone, boundaries, sample exchanges used as few-shot
examples) is completely decoupled from the *knowledge* (what Vale currently knows about, scoped
per-module). This means the voice can be tuned without touching content, and content can be
added/edited per-module without any risk of accidentally changing how Vale sounds — a
persona/knowledge split that's a common, worthwhile pattern for any LLM-backed character.

---

## 15. Styling System

All actual colors live as **HSL triplets in CSS custom properties** (`--accent: 213 94% 50%`),
referenced everywhere via `hsl(var(--accent))`. Tailwind's config maps semantic names
(`accent`, `card`, `success`, `module-1`...`module-6`) to these variables rather than to fixed
hex values. This indirection is *the entire mechanism* that makes dark mode, per-module
accent colors, and the sign-up-vs-sign-in visual distinction (`--accent-signup`,
`.auth-signup` utility class that locally overrides `--accent`/`--ring`/`--card`) all work
by swapping variable values rather than swapping class names on every element.

**Dark mode is currently hardcoded**: `main.tsx` passes `defaultTheme="dark"` and
`enableSystem={false}` to `next-themes`' `ThemeProvider`. Light-mode CSS variables exist,
fully defined, in `index.css` under `:root` — but there's no UI control wired up to actually
switch to them. This is a **complete-but-disconnected feature**: the theming *system* fully
supports light mode; only the toggle affordance is missing. Worth being precise about this
distinction if asked — it's not "light mode isn't implemented," it's "light mode is
implemented and dormant."

**shadcn/ui's actual mechanism** (`components/ui/*`): components are generated *once* from a
template and the source lands directly in the repo — not imported from `node_modules`. Under
the hood most use `class-variance-authority` (`cva`) to define named style **variants**
(`variant: "default"|"outline"|"ghost"`, `size: "sm"|"default"|"lg"`) that resolve to Tailwind
class strings, combined with the app's `cn()` helper (`clsx` + `tailwind-merge`) so a caller
can override/extend classes without Tailwind's utility-class specificity fighting itself
(`tailwind-merge` specifically resolves conflicting utilities, e.g. `px-2` vs a caller-supplied
`px-4`, by keeping only the last one rather than shipping both to the DOM). This is effectively
a lightweight **variant/builder pattern** for style composition — you own the primitive fully
(it's your code, in your repo) while still getting Radix's accessibility guarantees
underneath.

---

## 16. Component & State Design Patterns Catalog

A quick-reference of named patterns actually present in this codebase — useful vocabulary for
narrating any part of it fluently:

| Pattern | Where | What it buys |
|---|---|---|
| **Context + hook façade** (`useAuth()`, wraps `AuthContext`) | `AuthContext.tsx` | Consumers never touch the raw context object or worry about the `undefined` default — the hook throws a clear error if used outside the provider, turning a silent bug into a loud one at dev time. |
| **Custom hooks as a business-logic layer** (`useProgress`, `useXP`, `useStoryState`, `useValeChat`) | `src/hooks/*` | All Supabase reads/writes and derived state live *outside* components. Pages are nearly pure presentation — they call a hook and render its return value, making the hooks independently reasoned-about/testable in principle (though no tests currently exist for them — a real gap). |
| **Guard clause / early return** | `ProtectedRoute`, `LessonPage` (`if (!module) return <Navigate.../>`) | Replaces nested `if/else` pyramids with a flat sequence of "bail out if this precondition fails" checks — each one readable independently. |
| **Optimistic update + compensating rollback** | `useProgress.markComplete` | UI feels instant; correctness is preserved by explicitly undoing the local change if the remote write fails, rather than trusting it blindly. |
| **Derived state over duplicated state** | `useXP`'s `level`/badge computation, `SortingActivity`'s `unplacedItems` | Anything computable from one source of truth is computed on read, never stored redundantly — eliminates a whole class of "two pieces of state disagree" bugs. |
| **Discriminated-union-shaped renderer ("switch on type")** | `LessonSection.tsx`, `SceneRenderer.tsx` (`beat.speaker`) | One component owns the complete rendering logic for a closed set of variants — adding a variant is a local, auditable diff. |
| **Array-as-queue for sequential/branching playback** | `SceneRenderer`'s `queue`/`index`, `OnboardingPage`'s `step` | Turns "what do I show next" into simple index arithmetic instead of a bespoke state machine per screen type. |
| **In-visit vs. persistent state layering** | Story replay guards (`openingShown` vs `hasSeen()`) | Solves reactive-flag re-trigger loops by separating "has this ever happened" (persisted) from "has this happened *in the current mount*" (ephemeral, resets naturally). |
| **Backend-for-frontend / secret-custody boundary** | `vale-chat` Edge Function | The *only* place server-side code exists in the whole app, and specifically because a secret (Gemini key) must never reach the client — not because business logic needed to move server-side. |
| **Fixed-window rate limiting** | `vale-chat`'s daily usage counter | Simplest correct rate limiter for a cost-guard use case; explicitly not over-engineered into a sliding-window/token-bucket scheme the use case doesn't need. |
| **Content/voice separation for an LLM persona** | `persona.ts` vs `grounding.ts` | Decouples "how the character talks" from "what the character currently knows," so each can change independently. |

---

## 17. Data Structures & Algorithms — Direct Interview Answers

If asked "what DSA shows up in a project like this" (a fair question for a content-heavy CRUD
app that isn't algorithmically exotic), these are the concrete, honest answers — not
inflated ones:

- **Hash maps for O(1) membership/lookup**, used in three distinct places with three different
  motivations:
  - `useProgress`'s nested `{moduleId: {subtopicId: bool}}` — turns "is this lesson done"
    from an O(n) array scan into O(1) property access (§9).
  - `useXP`'s `quizBonuses`/`activityBonuses` — used purely as **hash sets** (value is always
    `true`, only key presence matters) for O(1) "already awarded?" dedup checks (§9).
  - `AVATAR_UPGRADES`/`BADGES` lookups by level — small enough that this doesn't matter in
    practice, but the *pattern* (map by ID instead of re-scanning an array) is the same
    instinct.
- **Array partitioning** — `buildPhases`' learn/practice split (§10) is a single O(n) pass that
  buckets items by a classifier function, the same shape as any "group by" or "partition"
  operation (conceptually identical to `Array.prototype.reduce` building up multiple output
  buckets from one input pass, or Python's `itertools.groupby`).
- **Finite state machine modeled as an integer index into a precomputed array** — both
  `LessonPage.currentPhaseIndex` and `OnboardingPage.step` reduce "what screen/phase am I on,
  what's next, what's previous" to bounded integer increment/decrement, because the *hard*
  part (determining the valid sequence) was solved once upfront rather than re-derived on every
  navigation.
- **Sequential array processing standing in for graph traversal, exploiting a domain
  invariant** — `SceneRenderer`'s choice-splicing (§12) is the most interesting one to talk
  through: recognizing that "branches always reconverge" means a flat array with in-place
  insertion is *sufficient*, and correctly choosing not to build a real graph/tree structure
  and traversal algorithm for a problem that doesn't need one.
- **Linear scan chosen over binary search, deliberately, on a tiny fixed-size array** —
  `getLevel`'s level-threshold lookup (§11). The interesting answer here isn't "how would you
  binary search this" (trivial), it's **articulating why you wouldn't bother**, given `n ≈ 4-6`.
- **Fixed-window counter algorithm** for rate limiting (§14) — one of several standard
  rate-limiting algorithms (vs. sliding window, token bucket), chosen for simplicity given the
  use case (a soft daily cost guard, not a precision throughput limiter).
- **Set-like array deduplication via `unique(...)` DB constraints + client-side upsert** (§9)
  — the *database* enforces "no duplicate (user, module, subtopic) rows" so the client doesn't
  need its own pre-insert existence check; this is offloading a would-be application-level
  invariant to the data layer, which is both simpler and race-condition-proof (two concurrent
  requests can't both "check then insert" past each other, because Postgres's constraint is
  checked atomically at insert time).
- **Memoization** — `useMemo(() => buildPhases(...), [subtopic])` avoids recomputing the phase
  array on every render of `LessonPage`, only when the lesson itself actually changes; this is
  the textbook "cache a pure function's output, keyed by its inputs" idea, just at
  React-render granularity rather than, say, a `Map`-backed memo cache.
- **What's conspicuously *not* here, and why that's fine to say plainly**: no custom sorting
  algorithms, no recursive tree/graph algorithms, no dynamic programming, no custom
  data-structure implementations (no hand-rolled linked lists, trees, heaps). This is a
  **content-and-state-management-heavy application**, not an algorithms-heavy one — its
  engineering challenges are about correct state modeling, sync-vs-optimistic tradeoffs, and
  data-shape transformations at storage boundaries, not asymptotic complexity. Being able to
  say that clearly, instead of overselling algorithmic depth that isn't there, reads as more
  senior than padding the answer.

---

## 18. Software Engineering Concepts — Direct Interview Answers

- **Optimistic UI with compensating rollback** (§9) — the general pattern: update local state
  immediately for perceived responsiveness, fire the durable write in the background, and
  explicitly define what happens on failure (here: revert) rather than leaving it undefined.
  Directly analogous to the "saga pattern" in distributed transactions (local step + explicit
  compensating action on remote failure), at a much smaller scale.
- **Idempotency via unique constraints + upsert** (§9) — `on conflict (...) do update` makes
  "mark this lesson complete" safe to call twice (double-click, retry-after-timeout,
  offline-then-reconnect) without special-casing "already done" in application code.
- **Row Level Security as the actual trust boundary, not client code** (§7) — the browser is
  never trusted; every authorization decision that matters is re-checked at the database.
  This is "defense enforced at the data layer" rather than "defense hoped-for in the UI,"
  which is the correct posture for any client that ships its access credentials publicly
  (which every SPA with a public API key does, by construction).
- **Content-addressed / stable keys over positional keys** (§9, §10) — the XP-dedup key fix is
  a specific instance of a general principle (also why React itself warns against `key={index}`
  in lists): identity should be derived from something stable about *what* the thing is, not
  from *where it currently happens to sit* in a collection, because position is exactly the
  thing most likely to change under future edits.
- **Separation of content, narrative, and behavior into independent data files**
  (`modules.tsx` vs `storyBeats.ts` vs the components that render them) — lets educational
  content and narrative content be authored/edited independently without merge conflicts or
  coupling, even though they're presented together at runtime.
- **Secret custody as the deciding factor for where code must run** (§14) — the one
  server-side piece of an otherwise fully client-driven app exists *specifically* because an
  API key can't be shipped to the browser, not because logic needed a server. Knowing *that
  specific reason* (as opposed to a vague "some things need a backend") is the useful,
  precise version of this idea.
- **Voice/knowledge separation for an LLM feature** (§14) — treating "how it talks" and "what
  it knows" as independently-editable concerns is a transferable pattern for any prompt-backed
  feature, not specific to this app.
- **Known, named tradeoffs over silent gaps** — this codebase is unusually good about
  documenting its own shortcuts in comments (`notes.md`'s "Gotchas" section, the grounding
  file's own TODO, the replay-bug fix comment, the model-selection rationale). Being able to
  cite these specifically (not just "the code has comments") demonstrates you've actually read
  and understood the reasoning, not just skimmed the code.
- **Where this app *doesn't* fully practice what it preaches** — worth having ready as an
  honest "what would you improve" answer:
  - `useXP.syncToSupabase` is fire-and-forget with no error handling, inconsistent with
    `useProgress.markComplete`'s explicit rollback-on-failure (§9) — the same
    reliability standard isn't applied uniformly across the two persistence hooks.
  - Silent fetch-failure handling (§9) trades debuggability for resilience — reasonable
    for a v1, but would want at minimum a logged warning in production.
  - `LessonSection.type`'s optional-fields-on-one-interface shape (§8) is looser than a true
    discriminated union — a real one would let TypeScript fully narrow field availability by
    tag.
  - Levels 5–6 are soft-disabled via commented-out code, not a real feature flag (§11).
  - Test coverage is minimal — one example test exists; the hooks with the most interesting
    logic (`useProgress`, `useXP`, the phase-building algorithm, the scene-splicing logic) have
    none. If asked "how would you test this," the honest answer is: `buildPhases`/`getLevel`
    are pure functions and trivially unit-testable today; the Supabase-backed hooks would need
    the client mocked (e.g. via `vi.mock`) to test the optimistic-update/rollback paths in
    isolation.

---

## 19. How to Walk Through This in an Interview — Suggested Narrative Arc

If asked to "walk me through a project you built," a tight path through this doc:

1. **One-sentence pitch** (§1) — what it is, who it's for.
2. **Why no custom backend** (§5) — BaaS + RLS instead of writing your own API, and the one
   deliberate exception (§14) and *why* that exception exists (secret custody, not logic).
3. **Pick ONE data-flow and go deep, end-to-end** — the strongest choice is **lesson
   completion**: user clicks "Complete Mission" → optimistic local state update → `await`ed
   upsert to `user_progress` → why it's awaited here specifically (§9, §10) → RLS is what
   actually stops another user from writing to this row, not client code (§7). This one flow
   touches auth, persistence, optimistic UI, and the DB security model in under two minutes.
4. **Then go deep on the one genuinely clever piece of logic**: the branching-dialogue array
   splice in `SceneRenderer` (§12) — state the naive approach (build a graph), state why it's
   unnecessary here (choices always reconverge), and state the actual implementation. This is
   the single best "shows real engineering judgment, not just feature-building" moment in the
   codebase.
5. **Close with self-aware tradeoffs** (§18's last bullet) — naming 2-3 specific things you'd
   improve, *with reasons*, reads as far stronger than presenting the project as flawless.

Have §17/§18 open as a mental checklist for the DSA/SWE-fundamentals follow-up questions that
almost always come after the walkthrough.
