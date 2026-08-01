import { modules } from "@/data/modules";

/**
 * Module-transition story beats — narrative scenes played around module and
 * lesson boundaries. Kept separate from modules.tsx so educational content
 * and narrative content can be authored independently.
 *
 * Positions:
 *  - `opening`       → plays on ModulePage when the module has no completed
 *                      lessons and the scene hasn't been seen.
 *  - `beforeLesson`  → plays on first entry to a specific lesson, before its
 *                      content. Keyed by subtopic id.
 *  - `closing`       → plays on ModulePage once every lesson is complete.
 *                      A "ENTRY LOGGED" case-file beat is appended
 *                      automatically (authored `caseFileEntry`, or a generated
 *                      fallback).
 *
 * Choices are flavor + light state tracking only — every branch converges on
 * the same next beat and never gates progress.
 */

export type SpeakerId = "vale" | "player" | "system";

export const CHARACTERS: Record<"vale" | "player", { name: string; role: string }> = {
  vale: { name: "Vale", role: "Desk Chief" },
  player: { name: "You", role: "Analyst" },
};

export interface SceneChoiceOption {
  id: string;
  label: string;
  /** Beats spliced in immediately after this option is picked. */
  response?: SceneBeat[];
}

/** One popup in a "spot it" desktop notification moment. */
export interface DesktopNotification {
  id: string;
  /** Sender/app label, e.g. "Signal Monitor", "Calendar", "Messages". */
  app: string;
  headline: string;
  detail?: string;
  /** "flagged" = urgent/red styling. "neutral" = mundane desktop-life noise. */
  tone?: "flagged" | "neutral";
  /** Exactly one item per moment should be the target. */
  isTarget?: boolean;
  /** Short flavor line for clicking this decoy instead of the target. */
  missNote?: string;
}

export interface SceneBeat {
  /** Omit for narration. "system" renders as a Signal Desk terminal card. */
  speaker?: SpeakerId;
  text: string;
  choice?: { id: string; options: SceneChoiceOption[] };
  /**
   * A "spot it" practice rep: a batch of desktop notifications appears (real
   * signal mixed into ordinary desktop noise) and the player must click the
   * one that's actually the case, not a button. Decoys shake and dismiss on
   * a miss so the field narrows — this never permanently blocks (worst case
   * the player clears every decoy first), but a first-try hit is more of a
   * catch than a rebound.
   */
  notifications?: {
    id: string;
    /** Instruction line shown above the popups, e.g. "One of these is the case." */
    prompt: string;
    items: DesktopNotification[];
    /** Beats spliced in once the target notification is clicked. */
    response: SceneBeat[];
  };
}

export interface ModuleStory {
  /** True = minimal single-beat scaffolding awaiting real authored scenes. */
  placeholder: boolean;
  opening?: SceneBeat[];
  beforeLesson?: Record<string, SceneBeat[]>;
  closing?: SceneBeat[];
  /** Authored case-file entry; omit to use the generated fallback. */
  caseFileEntry?: string;
}

/* ─────────────────────────────────────────────────────────────────────────
 * MODULE 1 — REAL CONTENT
 * Adapted from module-1-storyline-v2.md with deviations flagged in CLAUDE.md:
 *  1. The doc's "Submodule 3: Bias and Perspective" has no matching subtopic
 *     in the app, so its scenes (the two-writeups exercise and the
 *     wrong-photo joke) are DORMANT — not implemented. Re-add them
 *     from the doc if a bias subtopic ever ships. The closing recap below is
 *     adjusted so Vale doesn't reference the missing lesson.
 *  2. The doc's wifi-router example is replaced by the library bedbug post
 *     (author request 2026-07-16).
 *
 * Note: Module 1 deliberately has no `opening` — onboarding hands off
 * straight into lesson 1, bypassing ModulePage, so its intro beats live in
 * beforeLesson["what-is-disinfo"] instead.
 * ──────────────────────────────────────────────────────────────────────── */

const module1: ModuleStory = {
  placeholder: false,
  beforeLesson: {
    // Module 1's secondary case — the reservoir drone post. Replaces the tone
    // doc's wifi-router example (author request 2026-07-16): national-security
    // FLAVORED claim, but the reveal stays mundane/petty per the doc's
    // proportionality rule — the real coordinated-ops material is Module 4's.
    "what-is-disinfo": [
      {
        text: "Open item on your desk: a post claiming unmarked drones have been circling the reservoir at night. One dark, grainy photo of three lights in the sky. The comments have already decided whose drones they are.",
      },
      {
        text: "Three analysts filed it three different ways. As of this morning, it’s yours.",
      },
    ],

    // Doc: "Closing beat — into Submod 2" + the Submod 2 correction scene
    // (correction reassigned from Priya to the player's own draft).
    "critical-thinking": [
      {
        speaker: "vale",
        text: "You put the drone one in “misinformation.” Most people do. Want to know what it actually is?",
        choice: {
          id: "drone-reveal",
          options: [
            { id: "sure", label: "Sure" },
            { id: "guess", label: "Let me guess" },
          ],
        },
      },
      {
        speaker: "vale",
        text: "It’s disinformation. The drones are real — the community college flies them over the reservoir for a water-quality study. The guy who captioned them “foreign surveillance” knew exactly that.",
      },
      {
        speaker: "vale",
        text: "He wanted the city to restrict drones, because his neighbor keeps flying one over his backyard. It worked, by the way. There’s an ordinance being drafted. The neighbor is grounded.",
      },
      {
        speaker: "vale",
        text: "Point is — you can’t always tell by looking at the claim. Sometimes you have to know the person behind it. Which you don’t. Yet.",
      },
      {
        text: "On the second monitor, the share counter on the original post — the 3,400 one — ticks up. Vale doesn’t look at it. Just taps the desk next to it on the way out.",
      },
      {
        speaker: "vale",
        text: "That one’s still yours too. Don’t forget about it just because I found a funnier one.",
      },
      {
        text: "The original post is now spreading in three forums at once. You have a correction drafted. It’s decent. Your cursor is on “post.”",
        choice: {
          id: "correction",
          options: [
            {
              id: "post",
              label: "Post the correction",
              response: [
                {
                  text: "Forty replies in ten minutes. Thirty-one are from people who hadn’t seen the original post. Now they have.",
                },
                { speaker: "player", text: "Oh no. I just fed it, didn’t I." },
              ],
            },
            {
              id: "hold",
              label: "Hold off",
              response: [
                { text: "You close the draft. It physically hurts a little." },
                {
                  speaker: "vale",
                  text: "If it hits five figures before we do anything, that’s on you specifically.",
                },
              ],
            },
          ],
        },
      },
    ],

    // Doc: "Transition to Submod 3" + the Submod 4 professor-post scene
    // (Priya's confession becomes a player choice; Vale's line kept verbatim).
    "emotional-manipulation": [
      { speaker: "player", text: "Why’d it hit three forums at the same time, though?" },
      { speaker: "vale", text: "Good question. Wrong module. Ask me again in twenty minutes." },
      {
        text: "New flagged item — not the drone post. A post claiming a well-liked professor is being quietly let go. Dropped the same week as course registration. Phrased to maximize outrage on the professor’s behalf.",
      },
      {
        text: "You notice your own reaction before you finish reading. Not anger, exactly. Something closer to protectiveness.",
        choice: {
          id: "prof-post",
          options: [
            { id: "shared", label: "“I’d have shared this immediately.”" },
            { id: "engineered", label: "“Something about it feels engineered.”" },
          ],
        },
      },
      {
        speaker: "vale",
        text: "Whoever wrote this knew exactly which professor to pick. That’s not luck. That’s homework.",
      },
    ],
  },

  // Doc: "End of Module 1" — recap adjusted to omit the missing bias lesson.
  closing: [
    {
      text: "Vale pulls up what you’ve established about the original post on the shared screen — a recap, not a ceremony: what kind of claim it is, what a rushed correction costs, and exactly which nerve it was built to hit.",
    },
    {
      speaker: "vale",
      text: "So. You know what kind of claim it is. You know it’s emotionally engineered. You still don’t know one thing.",
    },
    { speaker: "player", text: "Who posted it first." },
    {
      speaker: "vale",
      text: "There it is. That’s not a Module 1 problem anymore. That’s Monday.",
    },
    {
      speaker: "vale",
      text: "Go home. Seriously. The post’ll still be unverified tomorrow.",
    },
  ],
  caseFileEntry:
    "CASE 01 — Reservoir drone post: disinformation, domestic, motive confirmed (grounding a neighbor’s drone). Drones: real, municipal, boring. Original 3,400-share post: classified, emotionally engineered, origin still unverified. Carried forward.",
};

/* ─────────────────────────────────────────────────────────────────────────
 * MODULES 2–6 — REAL CONTENT (content-aligned drafts approved 2026-07-16)
 * Throughline: the 3,400-share post is a photo of brown tap water captioned
 * "THEY KNOW. They're just not telling you." Each module's beats are built
 * on that module's actual lesson content (see CLAUDE.md). No Priya — the
 * cast is Vale, the player, and narration only, per author instruction.
 * Tone bible: module-1-storyline-v2.md. Module 4's election beat is
 * deliberately joke-free; everywhere else the humor stays.
 * ──────────────────────────────────────────────────────────────────────── */

// Module 2 — Examining Sources. Pays off M1's "That's Monday."
const module2: ModuleStory = {
  placeholder: false,
  opening: [
    { speaker: "system", text: "MONDAY — 08:14" },
    {
      text: "Your desktop wakes up before you do.",
      // "Spot it" rep: the actual signal (the case, escalating overnight)
      // has to be found among ordinary desktop noise — the same lateral-
      // reading instinct this module teaches, just embodied instead of
      // explained.
      notifications: {
        id: "m2-monday-desk",
        prompt: "Three things came in overnight. One of them is the case.",
        items: [
          {
            id: "coffee",
            app: "Facilities",
            headline: "Break room coffee machine is down. Again.",
            tone: "neutral",
            missNote: "Not the case. Deeply relatable, though.",
          },
          {
            id: "standup",
            app: "Calendar",
            headline: "9:00 AM — Standup",
            detail: "In 46 minutes",
            tone: "neutral",
            missNote: "Also not it. You still have time. Barely.",
          },
          {
            id: "signal",
            app: "Signal Monitor",
            headline: "Reservoir post now at 11,000 shares.",
            detail: "Origin: still unverified. Status: still spreading.",
            tone: "flagged",
            isTarget: true,
          },
        ],
        response: [
          {
            text: "The photo again — brown water in a glass, captioned “THEY KNOW. They’re just not telling you.” Yesterday it had four digits. Today it has five.",
          },
          { speaker: "vale", text: "Morning. Your post got ambitious over the weekend." },
          {
            speaker: "vale",
            text: "Everyone sharing it says it came from a news site. Find the news site.",
          },
        ],
      },
    },
  ],
  beforeLesson: {
    "idenitfy-sources": [
      {
        text: "The “news site” surfaces: CityWaterWatch.net. Clean template, stock photo of a newsroom, articles going back years.",
      },
      {
        speaker: "vale",
        text: "Looks real, doesn’t it.",
        choice: {
          id: "about-page",
          options: [
            { id: "convinced", label: "“It has an About page and everything.”" },
            { id: "suspicious", label: "“The About page is three sentences.”" },
          ],
        },
      },
      {
        speaker: "vale",
        text: "The About page says “a team of dedicated journalists.” No names. A team of nobody.",
      },
      { text: "Every byline on the site reads “Staff.”" },
      {
        speaker: "vale",
        text: "Anyone can buy a newsroom template for forty dollars. I know because I bought one for a training exercise. Took eleven minutes.",
      },
    ],
    "lateral-reading": [
      {
        text: "An hour inside CityWaterWatch.net. Every article checks out — against other CityWaterWatch.net articles.",
      },
      { speaker: "player", text: "The site keeps confirming itself." },
      { speaker: "vale", text: "It’ll do that all day. Get out of it. Open a tab." },
      {
        text: "First result that isn’t the site itself: a domain lookup. Registered five weeks ago.",
      },
      {
        speaker: "vale",
        text: "Five weeks. Covering water infrastructure “since 2011,” per the footer.",
      },
      { speaker: "player", text: "The footer’s lying?" },
      { speaker: "vale", text: "The footer’s marketing." },
    ],
  },
  closing: [
    {
      text: "The file on CityWaterWatch.net: five weeks old, no named staff, articles scraped from elsewhere, ads between every paragraph.",
    },
    {
      speaker: "vale",
      text: "It’s not a news site. It’s a vending machine. Post goes viral, they repost it, the ads pay out. They’d run a correction if the correction got clicks.",
    },
    { speaker: "player", text: "So they didn’t start it. They just picked it up." },
    {
      speaker: "vale",
      text: "Which means the origin’s still out there. Also — the photo’s bugging me. Water isn’t usually that committed to being brown.",
    },
    {
      speaker: "vale",
      text: "Tomorrow. And stop reading that site, it’s forty ad trackers in a trenchcoat.",
    },
  ],
  caseFileEntry:
    "CASE 02 — “CityWaterWatch.net”: content mill. Registered five weeks ago, no named authors, monetized via ads. Amplifier, not origin. Post photo flagged for visual review. Origin: still unverified.",
};

// Module 3 — The Visual Front. The photo gets its day in court.
const module3: ModuleStory = {
  placeholder: false,
  opening: [
    {
      text: "The photo, enlarged on Vale’s monitor: a glass of brown water on a kitchen counter.",
    },
    {
      speaker: "vale",
      text: "Before you ask — no, I can’t tell if it’s fake by squinting at it. Neither can you. That’s the whole problem.",
    },
  ],
  beforeLesson: {
    "out-of-context": [
      {
        speaker: "player",
        text: "It’s not AI-generated. No artifacts, the lighting’s consistent.",
      },
      {
        speaker: "vale",
        text: "Agreed. So it’s a real photo of real brown water.",
        choice: {
          id: "real-photo",
          options: [
            { id: "true-then", label: "“Then the post is true?”" },
            { id: "real-not-story", label: "“A real photo doesn’t mean a real story.”" },
          ],
        },
      },
      {
        speaker: "vale",
        text: "It’s a real photo of brown water somewhere, sometime. The post says it’s here, now. That’s two different claims wearing one caption.",
      },
      {
        text: "Meanwhile, a supporting post is circulating: a chart titled “Contamination reports up 400%.” The y-axis starts at 96.",
      },
      { speaker: "vale", text: "The y-axis starts at 96. I want that on a mug." },
    ],
    "rev-img": [
      { speaker: "player", text: "So how do I find where the photo’s actually from?" },
      {
        speaker: "vale",
        text: "You ask the internet if it’s seen it before. That’s the entire trick. It’s embarrassingly effective.",
      },
    ],
  },
  closing: [
    {
      text: "TinEye: fourteen matches. Oldest — a 2019 local news story from a town 800 miles away. Scheduled fire-hydrant flush, two days of brown water, city apologized, water was fine.",
    },
    {
      speaker: "vale",
      text: "Real photo. Real brown water. Wrong year, wrong state, wrong everything.",
    },
    { speaker: "player", text: "So whoever posted it knew." },
    {
      speaker: "vale",
      text: "Or got it from someone who did. Either way, the picture was never the evidence. It was the costume.",
    },
    {
      speaker: "vale",
      text: "Log it. And find out who ran that hydrant flush — I want to send them a fruit basket for keeping the original online.",
    },
  ],
  caseFileEntry:
    "CASE 03 — Post photo: authentic. 2019 hydrant flush, different state, recycled as current-local. Supporting “400%” chart: truncated axis. Reclassified: constructed, not mistaken. Origin: still unverified.",
};

// Module 4 — The Big Picture. Quieter register; the election beat is
// deliberately joke-free per the tone guardrail.
const module4: ModuleStory = {
  placeholder: false,
  opening: [
    {
      text: "The post’s spread, mapped on the wall monitor. Three forums, same hour — the question Vale deferred in week one.",
    },
    {
      speaker: "vale",
      text: "You asked why it hit three places at once. Twenty minutes turned into a few weeks — sorry. Here’s the answer, and I want you to be a little underwhelmed by it: nothing spreads like that on its own.",
    },
  ],
  beforeLesson: {
    "influence-ops": [
      {
        speaker: "player",
        text: "The caption never actually lies about the water. It just says “THEY KNOW” and lets you fill in the rest.",
      },
      {
        speaker: "vale",
        text: "Write that down. Cleanest description of the genre I’ve heard all year.",
      },
      {
        text: "The spread map, annotated: forty-one accounts posted the photo within a six-minute window. Nine used identical wording. Six had been dormant for a year — then woke up that morning.",
      },
      {
        speaker: "vale",
        text: "Six accounts wake up from a year-long nap with the same thing to say. That’s not a coincidence. That’s a shift schedule.",
      },
    ],
    "misinfo-demo": [
      {
        text: "One of the three forums is a local election board’s community page. The water post is pinned there under a new caption: “If they lie about the water, what else are they lying about?”",
      },
      { speaker: "player", text: "It’s not even about the water anymore." },
      {
        speaker: "vale",
        text: "No. It’s about whether anything official can be trusted. Water today. Ballots in November.",
      },
      { text: "She’s quiet a second longer than usual." },
      { speaker: "vale", text: "This part I don’t have jokes for. Let’s just do it well." },
    ],
  },
  closing: [
    {
      text: "End of week, on the case wall: the first big push wasn’t organic. A coordinated cluster — some automated, some not — seeded three communities and let real people carry it from there. Operator: unknown. Motive: unknown. Effect: measurable.",
    },
    { speaker: "player", text: "Do we ever find out who?" },
    {
      speaker: "vale",
      text: "Sometimes. Usually not. Attribution is its own career, and it’s mostly disappointment.",
    },
    {
      speaker: "vale",
      text: "Next module we look at why it worked so well once real people got hold of it. Spoiler: it’s the phones.",
    },
  ],
  caseFileEntry:
    "CASE 04 — Initial spread: coordinated. 41 accounts / six-minute window / shared templates / dormancy anomalies. Attribution: not established. Narrative has migrated from water quality to institutional distrust. Origin: still unverified.",
};

// Module 5 — The Digital World. Humor returns.
const module5: ModuleStory = {
  placeholder: false,
  opening: [
    {
      text: "You open the app to check one notification about the case. Forty minutes later you’re eleven posts deep in a thread about water filters.",
    },
    { speaker: "vale", text: "Yeah. That’s the module." },
  ],
  beforeLesson: {
    "synthetic-media": [
      {
        speaker: "player",
        text: "We debunked the photo two weeks ago. The debunk has two hundred shares. The post has sixty thousand.",
      },
      { speaker: "vale", text: "Where’d the sixty thousand happen?" },
      { speaker: "player", text: "Mostly three community groups." },
      { speaker: "vale", text: "How many of those groups ever saw the debunk?" },
      { text: "You check. One. A moderator removed it — for “arguing.”" },
      { speaker: "vale", text: "For arguing." },
    ],
    "social-algo": [
      {
        text: "Platform analytics on the water post: average view time, 1.4 seconds. Shares made without opening the article: 71%.",
      },
      { speaker: "player", text: "Seventy-one percent shared it without reading it." },
      {
        speaker: "vale",
        text: "The platform doesn’t mind. The share’s the product. The reading’s optional.",
      },
      { speaker: "vale", text: "1.4 seconds. It takes longer to sneeze." },
    ],
  },
  closing: [
    {
      text: "The post has stopped growing — not because anyone won. The feeds moved on. Something about a celebrity’s parking ticket.",
    },
    {
      speaker: "vale",
      text: "That’s the part nobody tells you. Half the time the thing that beats misinformation is just… newer content.",
    },
    { speaker: "player", text: "That’s bleak." },
    { speaker: "vale", text: "It’s Tuesday." },
    {
      speaker: "vale",
      text: "Don’t relax, though. Dormant isn’t dead, and we still owe the file an origin — or an honest “we can’t know.” Last module. It’s the one where you stop asking me and I start watching you.",
    },
  ],
  caseFileEntry:
    "CASE 05 — Reach: engagement-driven; 71% shared unread; corrections filtered out of origin communities. Spread decaying — displaced, not defeated. Origin: still unverified.",
};

// Module 6 — From Instinct to Method. Capstone; the origin stays honestly
// unverifiable, per the module's own "know when to stop" lesson.
const module6: ModuleStory = {
  placeholder: false,
  opening: [
    {
      text: "Everything the case has produced, on one screen: the classification, the content mill, the 2019 photo, the six-minute window, the 1.4 seconds. At the top, the field that’s been blank since day one — ORIGIN: UNVERIFIED.",
    },
    {
      speaker: "vale",
      text: "Last stretch. This time you drive. I’ll be here, drinking coffee at a judgmental volume.",
    },
  ],
  beforeLesson: {
    "misinfo-response": [
      {
        text: "You run the workflow. Photo: sourced, 2019. Claim: no dataset, no named official, no primary anything. First appearance: a since-deleted account, on a platform that keeps deletion logs for ninety days. It’s been two hundred and six.",
      },
      { speaker: "player", text: "The trail ends at a deleted account." },
      {
        speaker: "vale",
        text: "So you’ve got credible primary sources on everything except the one thing, and the one thing is out of reach. What does the workflow say?",
        choice: {
          id: "when-to-stop",
          options: [
            {
              id: "dig",
              label: "“Keep digging.”",
              response: [
                {
                  speaker: "vale",
                  text: "You can. People do. There’s a name for the folder where those investigations live, and it’s “open forever.”",
                },
                { text: "You log it." },
              ],
            },
            {
              id: "stop",
              label: "“Stop. Log it as unverifiable.”",
              response: [
                {
                  speaker: "vale",
                  text: "Correct. Only took you six modules to say that without flinching.",
                },
              ],
            },
          ],
        },
      },
      {
        speaker: "vale",
        text: "Now the real question. It’s still pinned in two groups. What do we do about that?",
      },
    ],
  },
  closing: [
    {
      text: "The response memo, drafted and sent: a correction for the two groups where the post is still active — calm, short, leads with what’s true (the water’s fine; the city publishes test results monthly), doesn’t restate the scary claim. No reply to the dormant threads. Nothing that gives it new oxygen.",
    },
    {
      speaker: "vale",
      text: "You know what I like about this memo? It’s boring. Eight weeks ago you’d have written a thriller.",
    },
    { speaker: "player", text: "The file’s still open, though. We never got the origin." },
    {
      speaker: "vale",
      text: "The drone post, we got the origin in a week — a guy who wanted his neighbor’s drone grounded. This one, maybe never. Both of those are how it actually goes.",
    },
    {
      text: "She signs off on the case file. Under ORIGIN, the status finally changes — not to a name. To UNVERIFIABLE — CLOSED, MONITORING.",
    },
    {
      speaker: "vale",
      text: "Right. There’s a new pile on your desk. It’s been there since Thursday, and it is not getting funnier.",
    },
  ],
  caseFileEntry:
    "CASE 06 — CLOSED (MONITORING). Origin: unverifiable — trail ends at a deleted account past log retention. Response issued: targeted correction, no amplification. The water was always fine.",
};

export const storyBeats: Record<string, ModuleStory> = {
  introduction: module1,
  "source-eval": module2,
  "visual-deception": module3,
  "national-security": module4,
  "social-media": module5,
  "digital-forensics": module6,
};

/** Authored case-file entry, or a dry generated fallback. */
export function getCaseFileEntry(moduleId: string): string {
  const authored = storyBeats[moduleId]?.caseFileEntry;
  if (authored) return authored;
  const module = modules.find((m) => m.id === moduleId);
  return module ? `CASE 0${module.number} — CLOSED. ${module.title}.` : "CASE CLOSED.";
}
