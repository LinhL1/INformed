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
- `beforeLesson[subtopicId]` — plays on entry to that lesson in `LessonPage`, before
  the lesson content.
- `closing` — plays on `ModulePage` when all lessons complete and unseen; an
  `ENTRY LOGGED` system beat is always appended (see case-file entries below).

Beats are `{ speaker?, text, choice? }` — no speaker = narration, `"system"` =
terminal card, `"vale"`/`"player"` = dialogue (registry: `CHARACTERS`). **Choices
never gate progress**: every option's `response` beats splice in and converge on the
same next beat; the picked option id is recorded for flavor callbacks only.

**Seen-once vs. replay:** every scene position (`opening`, `closing`,
`beforeLesson[subtopicId]`) is forced and unskippable exactly once per user (tracked
by `story_seen`, see Persistence below). Every visit after that first time, the scene
plays again automatically but with a "Skip replay" button in the corner — same
grammar as the onboarding sequence's "Skip intro." This applies independently per
scene key: e.g. revisiting a module you've only seen the opening of (not yet
finished) replays just the opening; once you've also seen the closing, revisiting
replays just the closing — `ModulePage`'s `replayStep` defaults to `"closing"`
whenever `hasSeen(closingKey)` is already true, specifically so a returning visitor
to a finished module lands on the current state of the case, not the intro (fixed
2026-08-07: it previously always defaulted to `"opening"`, so the single "Skip
replay" button — which exits the whole replay, not just the current scene — could
abort before the closing ever played; effectively the closing never showed for a
finished module). `LessonPage` mirrors this same forced-then-skippable-replay shape
for `beforeLesson` (`preLessonShown`/`skipStoryReplay`) but only ever has one scene
per key, so it isn't exposed to this ordering bug. Both pages track an in-visit
"shown" boolean alongside `hasSeen()` — needed because `markSeen` flips `hasSeen()`
reactively mid-visit, which would otherwise immediately satisfy the replay condition
again and re-show the scene the player just finished; it resets naturally on remount
(every fresh navigation into the page).

**Component:** `src/components/story/SceneRenderer.tsx` — plays beats click-by-click
(same interaction grammar as onboarding; reuses `PulsingCue`). Used in exactly two
places: `ModulePage` (opening/closing) and `LessonPage` (beforeLesson), both as
early-return full screens ahead of normal page content.

**Layout & styling:** everything renders inside `DesktopFrame` (`shared.tsx`) — the
title-bar-and-surface "monitor" chrome shared with onboarding. `SceneRenderer` itself
only decides *which* beat variant to render inside that frame; each variant is a
self-contained block gated by `beat.speaker` / `beat.choice` / `beat.notifications`,
so a styling change to one variant (e.g. dialogue text size) can't leak into the
others:

- No `speaker` → centered italic narration.
- `speaker: "system"` → bordered/tinted card, "Signal Desk" label + body.
- `speaker: "vale" | "player"` → left-aligned label (name via `CHARACTERS`, color
  distinguishes Vale from the player) + larger body text.
- `beat.choice` (while unanswered) → pill buttons, `flex flex-wrap`. Row alignment
  is `justify-start` (left-aligned); switch to `justify-center`/`justify-end` here
  to change it globally, since every choice beat renders through this one block.
- `beat.notifications` (while unanswered) → prompt line, then the notification
  stack. Stack alignment is controlled by the wrapping `<div className="flex
  flex-col items-start gap-2 pt-2">` around line 181 — `items-start` is the
  left-align; `pt-2` is the breathing room below the prompt line. The individual
  popup look (icon dot, app label, headline, detail, shake animation, flagged vs.
  neutral tone color) lives in `NotificationPopup` (`shared.tsx`), not here — restyle
  the card itself there, restyle its position/alignment/spacing on the page here.

Each beat gets a fresh top-level `motion.div` keyed by `index` inside
`AnimatePresence mode="wait"`, so the fade/slide transition between beats is a
single shared setting (`initial`/`animate`/`exit`/`transition` on that wrapper,
~line 97) rather than something each variant reimplements. `PulsingCue` (also
`shared.tsx`) is the only element outside `DesktopFrame`, shown whenever the beat
isn't blocking on a choice/notification pick.

**To adjust spacing/alignment/typography across all scenes:** edit the relevant
variant block in `SceneRenderer.tsx` (it's the single render path for every module's
beats — no per-module or per-scene style overrides exist). **To adjust the shared
chrome** (frame border/shadow, notification card shape, pulsing cue, stagger/typewriter
text effects): edit `shared.tsx`, which is also consumed by the onboarding screens, so
check both call sites before changing shared component internals.

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
| digital-forensics (6) | Approved draft — ending resolves with attribution (updated 2026-08-07, see below) |

**Throughline (Modules 2–6):** the 3,400-share post from onboarding/Module 1 is a
dramatic photo of a power substation lit up by a bright electrical explosion against
the night sky, captioned "THEY'RE CALLING IT 'MAINTENANCE.' IT WAS A HACK." — claiming
a cyberattack disabled the grid and the utility is covering it up (swapped from an
earlier brown-tap-water-conspiracy
version on 2026-08-07 — author wanted the throughline more national-security-flavored;
Module 1's separate reservoir-drone case, see below, was intentionally left
unchanged). Each module advances the case using that module's actual lesson
mechanics: M2 traces it to a five-week-old ad-mill "news" site (`PowerGridWatch.net`)
via lateral reading; M3 reverse-image-searches the photo to a 2019 equipment fault
(wildlife contact) in another state; M4 reveals coordinated amplification (41
accounts, six-minute window) and the narrative migrating to institutional distrust;
M5 shows the debunk losing to echo chambers and engagement mechanics; M6 runs the
full verification workflow — the original account's trail is a genuine dead end
(deleted, past log retention), but a stylometric match on a still-active account from
M4's coordinated cluster leads to the registrant behind `PowerGridWatch.net`: "Lakeshore
Digital Media," a small paid engagement-farming operation running a standing campaign
(twelve manufactured "crises" logged this year), not a hacker or state actor (updated
2026-08-07 — a fully unresolved ending read as unsatisfying; keeps the tone bible's
"boring reveal" instinct by making the attribution mundane/commercial rather than
dramatic). The response stays proportionate: correction issued publicly, attribution
filed privately with the platform, no public naming — Vale's reasoning is that naming
them publicly would just hand them a bigger post than the one that started the case.
**The case file doesn't close** (revised same day — a flat "case closed" undercut the
campaign reveal): status ends on `WATCHLIST — ACTIVE`, registrant flagged so a future
post from the same operation surfaces immediately. Explicitly contrasted against
Module 1's drone case in Vale's closing line, which *is* actually finished — this one
is "a different kind of done."

**Cast:** Vale, the player, and narration/system only. **Priya is permanently out of
the plot** (author decision, twice confirmed) — do not reintroduce her or invent
replacement coworkers. Module 1 keeps its no-Priya adaptation.

Module 1 adaptation deviations (both intentional): (a) Priya removed — her beats
reassigned to player/Vale or trimmed; (b) the doc's "Submodule 3: Bias and
Perspective" has no matching subtopic in the app, so its scenes are dormant (kept
only in the doc) and the closing recap omits the framing-gap reference. Module 1 has
no `opening` because onboarding hands off directly into lesson 1, bypassing
ModulePage — its intro beats live in `beforeLesson["what-is-disinfo"]`.
