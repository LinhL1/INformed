// Per-module concept grounding, keyed by the same module `id` used in
// src/data/modules.tsx. This is a hand-maintained lookup (PRD's "v1, simplest"
// option) — it does not read from modules.tsx at runtime because this function
// runs in Deno on Supabase's Edge Runtime, a separate build/deploy from the
// Vite app, so the two aren't wired together automatically. If module content
// changes, update the matching summary here by hand.
//
// FILLED for this pass: introduction, source-eval, visual-deception.
// TODO (flagged for follow-up, not done in this pass): add summaries for
// national-security, social-media, digital-forensics so module-scoped
// grounding covers all six modules, not just the first three.
export const MODULE_SUMMARIES: Record<string, { title: string; summary: string }> = {
  introduction: {
    title: "Introduction to Misinformation & Media Literacy",
    summary: `Core distinctions: information (accurate, as understood true), misinformation (false but shared unintentionally, the sharer believes it), disinformation (false and shared deliberately to deceive; when coordinated by foreign actors against democratic processes it's called foreign information manipulation and interference), and malinformation (true information weaponized or taken out of context to cause harm). Misinformation spreads because it feels credible: it comes from trusted sources, confirms existing beliefs, or triggers strong emotion that short-circuits questioning. Critical thinking is framed as a structured process, not just "thinking hard": consider multiple perspectives, check your own biases, understand context, identify premises/conclusions, check facts and evidence, evaluate the logic, then judge. Emotional manipulation is covered as a deliberate tactic: fear-mongering, outrage bait, sentimentality, us-vs-them framing, false urgency — all designed to trigger a feeling strong enough to bypass rational evaluation before you even finish reading.`,
  },
  "source-eval": {
    title: "Source Evaluation",
    summary: `Focuses on judging where information comes from rather than taking it at face value. "Fake news" covers a range: satire mistaken for real reporting, manipulated content, and fully fabricated stories, motivated by political influence, ad revenue, propaganda, or entertainment. A professional-looking site does not equal credible content, a widely-shared story is not automatically true, and a .org domain guarantees nothing — anyone can register one. Practical credibility checks: author credentials, publication reputation, purpose/bias, evidence and citations, cross-checking, domain/URL review, and verifying specific details. The module's signature technique is lateral reading: instead of evaluating a source only on its own page, open new tabs to check who runs the site, what their affiliations/funding are, and whether independent, credible outlets confirm the claim — this is the fact-checker's method for spotting bias or fabrication quickly.`,
  },
  "visual-deception": {
    title: "Visual Deception",
    summary: `Covers how images and video can mislead even when nothing about the pixels is technically "false." Deepfakes are AI-generated or altered video/audio/images (e.g. face-swapped or synthesized speech) that are increasingly hard to distinguish from real media by eye or ear alone — a realistic-looking video of someone is not itself evidence the event happened. Out-of-context content is a distinct failure mode: real media (a clipped video, a cropped photo, a truncated quote, old footage reused) presented with misleading framing — deepfakes change reality, out-of-context content changes how you interpret real reality. Misleading data visualizations (skewed axes, cherry-picked ranges) are covered as the same family of trick applied to charts and stats. Reverse image search (Google's built-in tool, TinEye) is the practical countermeasure: trace an image to its earliest or original appearance, check whether the same face/photo shows up under multiple different identities, and treat "zero results" or a match to a known original source as a signal of likely authenticity versus manipulation.`,
  },
};

export const GENERAL_SUMMARY = `INformed is a six-module course teaching misinformation literacy end to end:
1. Introduction — the core vocabulary (misinformation vs. disinformation vs. malinformation), why false content spreads, critical thinking as a structured process, and emotional-manipulation tactics (fear-mongering, outrage bait, false urgency) designed to short-circuit that thinking.
2. Source Evaluation — judging credibility (author, publication, evidence, bias) instead of trusting design/domain/virality, and lateral reading: verifying a claim by checking independent sources instead of trusting the original page.
3. Visual Deception — deepfakes and AI-manipulated media, out-of-context content (real media, misleading framing), misleading charts/data, and reverse image search as a verification tool.
4. National Security — propaganda and narrative framing (the same facts can be framed to support different conclusions), influence operations and coordinated inauthentic behavior (synchronized posting, fake-account networks, artificial amplification), and how election/institutional-trust misinformation erodes democratic confidence.
5. Social Media — how platform design (infinite scroll, autoplay, notifications) and algorithms compete for attention often independent of accuracy, echo chambers and confirmation bias narrowing what you see, and synthetic/manipulated media spreading through those same engagement mechanics.
6. Digital Forensics & Fact-Checking — building a repeatable verification workflow (matching the method to the claim type: images, stats, quotes, news events), knowing when to stop investigating, and deciding how/when to respond to misinformation without amplifying it further.

Use this as general orientation across all six modules. If the user is on a specific module page, you'll be told which one — stay focused on that module's material and gently redirect if they ask about a different module's content.`;
