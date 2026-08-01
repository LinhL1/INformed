# CLAUDE.md

Guidance for working in this repo. Full architecture, database schema, and data-flow
documentation lives in [notes.md](notes.md) — read that first for anything about auth,
Supabase persistence, XP/progress hooks, or lesson structure.

## Workflow conventions

- Audit first, propose a plan, wait for explicit go-ahead before implementing.
- Surgical, minimal diffs — no refactoring of unrelated auth/routing/query code; flag
  improvements separately instead.
- No silent rewrites of working code — call out required changes to existing Supabase
  queries, auth handlers, or routing config before making them.
- Confirm new dependencies before adding them (Framer Motion is the animation library;
  it has covered every animation need so far).

## Onboarding sequence (post-sign-in "Signal Desk" intro)

A 9-screen narrative intro at `/onboarding`, played after every sign-in redirect.

**Flow:** `SignIn` redirects to `/onboarding` (passing the original `from` destination in
route state) instead of navigating straight to the app. Forward-only navigation: click
anywhere (or Enter/Space/ArrowRight) advances; there is no back button. Completing
Screen 9 navigates into Module 1 / Submodule 1 (`/module/introduction/lesson/what-is-disinfo`).
Users with a persisted session who never hit `/signin` do not see the sequence.

**Component structure:**

- `src/pages/OnboardingPage.tsx` — route component; owns the step index (0–8), the
  screen cross-fade (`AnimatePresence mode="wait"`), the skip button, and persistence.
  Route is registered in `App.tsx` inside `ProtectedRoute` but *outside* `AppShell`
  (full-screen, no Header — same visual context as `/signin`).
- `src/components/onboarding/` — one small component per screen so each is easy to
  restyle independently: `PrologueScreen`, `AssignmentScreen`, `MondayScreen`,
  `ColdOpenScreen`, `RevealScreen`, `MissionScreen`, `OrgScreen`, `DeskScreen`,
  `HandoffScreen`. Plus:
  - `shared.tsx` — `StaggerLines` (line-by-line fade-in), `TypewriterText`
    (character-by-character reveal with a blinking cursor, used by `MondayScreen`),
    `PulsingCue` (advance indicator), `AlertCard` (flagged-post card used by
    Screens 4–5), and `MENTOR_NAME`
    (**TODO: placeholder "Vale" — replace with the final mentor name**).
  - `CaseFileTabs.tsx` — see below.

**Onboarding-seen persistence:** Supabase auth `user_metadata.onboarding_seen`
(set via `supabase.auth.updateUser`), *not* a table column. Chosen because it rides in
the session JWT — readable synchronously at redirect time (no fetch, no flash, no race),
cross-device, and requires no manual SQL setup. It is client-writable, which is fine for
a cosmetic flag. The flag controls **skip visibility only**, not whether the sequence
renders: first-timers can't skip; anyone who has seen it before gets a "Skip intro"
button from Screen 2 onward (skip → original `from` destination, default `/modules`).

**Screen 8 case file vs. future module navigation:** `CaseFileTabs` is a lightweight
presentational grid of the six modules (driven by `src/data/modules.tsx`, Module 1
unlocked). It is intended as the *seed* of the eventual persistent module-navigation
component — when that component is built, extend/promote `CaseFileTabs` rather than
duplicating it, then update this section.

**Known content note:** Screen 9's "flagged-posts sorting task" framing matches the
`storyBriefing` narrative of `what-is-disinfo`, but that lesson's actual activities are
a true/false drill and a quiz — the first real `sorting` activity is in the
`emotional-manipulation` subtopic. Adding a real flagged-posts sorting section to
`what-is-disinfo` is a separate content ticket.

## Module story transitions (SceneRenderer system)

Narrative scenes played around module and lesson boundaries. The tone bible is
`module-1-storyline-v2.md` (author-held, not in repo): specific over vague, dry humor,
coworker dialogue, no moralizing narration, no mentor aphorisms, scenes may end
mid-conversation. **When in doubt, under-write.**

**Data:** `src/data/storyBeats.ts` — `Record<moduleId, ModuleStory>`, deliberately
separate from `modules.tsx` (which was not modified). A `ModuleStory` has three
optional scene positions:

- `opening` — plays on `ModulePage` when 0 lessons complete and unseen.
- `beforeLesson[subtopicId]` — plays on first entry to that lesson in `LessonPage`,
  before the lesson content.
- `closing` — plays on `ModulePage` when all lessons complete and unseen; an
  `ENTRY LOGGED` system beat is always appended (see case-file entries below).

Beats are `{ speaker?, text, choice? }` — no speaker = narration, `"system"` =
terminal card, `"vale"`/`"player"` = dialogue (registry: `CHARACTERS`). **Choices
never gate progress**: every option's `response` beats splice in and converge on the
same next beat; the picked option id is recorded for flavor callbacks only.

**Component:** `src/components/story/SceneRenderer.tsx` — plays beats click-by-click
(same interaction grammar as onboarding; reuses `PulsingCue`). Used in exactly two
places: `ModulePage` (opening/closing) and `LessonPage` (beforeLesson), both as
early-return full screens ahead of normal page content.

**Persistence:** `src/hooks/useStoryState.ts` — seen-flags (`story_seen`) and choice
records (`story_choices`) in auth `user_metadata`, same pattern and rationale as
`onboarding_seen`. Scene triggers on ModulePage wait for `useProgress.isLoading` to
avoid mis-firing on stale zero progress.

**Case-file entries:** authored-with-fallback, not auto-generated from dialogue
(entries are a distinct dry-record voice; runtime-summarized dialogue reads badly).
`getCaseFileEntry(moduleId)` returns the authored `caseFileEntry` or a generated
`CASE 0N — CLOSED. <title>.` fallback. Entries currently surface only as the final
beat of closing scenes; surfacing them in a persistent case-file UI is deferred until
`CaseFileTabs` is promoted to the real module navigation.

**Content status (all six modules have real scenes as of 2026-07-16):**

| Module | Status |
|---|---|
| introduction (1) | FINAL — adapted from module-1-storyline-v2.md |
| source-eval (2) | Approved draft — content-aligned to source-eval lessons |
| visual-deception (3) | Approved draft — **revisit after the rev-img lesson's content fix** (its body copy is currently URL-literacy text pasted under a reverse-image-search heading) |
| national-security (4) | Approved draft — election beat (`misinfo-demo`) is deliberately joke-free; keep it that way |
| social-media (5) | Approved draft |
| digital-forensics (6) | Approved draft — ending is deliberately unresolved (origin logged UNVERIFIABLE, per the module's own "know when to stop" lesson) |

**Throughline (Modules 2–6):** the 3,400-share post from onboarding/Module 1 is a
photo of brown tap water captioned "THEY KNOW. They're just not telling you." Each
module advances the case using that module's actual lesson mechanics: M2 traces it to
a five-week-old ad-mill "news" site via lateral reading; M3 reverse-image-searches
the photo to a 2019 hydrant flush in another state; M4 reveals coordinated
amplification (41 accounts, six-minute window) and the narrative migrating to
institutional distrust; M5 shows the debunk losing to echo chambers and engagement
mechanics; M6 runs the full verification workflow, hits a dead end (deleted account
past log retention), and closes with a response memo instead of an attribution.
Known resonance: M6's real lesson scenario is also a water-supply panic — intentional.

**Cast:** Vale, the player, and narration/system only. **Priya is permanently out of
the plot** (author decision, twice confirmed) — do not reintroduce her or invent
replacement coworkers. Module 1 keeps its no-Priya adaptation.

Module 1 adaptation deviations (both intentional): (a) Priya removed — her beats
reassigned to player/Vale or trimmed; (b) the doc's "Submodule 3: Bias and
Perspective" has no matching subtopic in the app, so its scenes are dormant (kept
only in the doc) and the closing recap omits the framing-gap reference. Module 1 has
no `opening` because onboarding hands off directly into lesson 1, bypassing
ModulePage — its intro beats live in `beforeLesson["what-is-disinfo"]`.
