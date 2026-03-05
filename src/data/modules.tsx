import { ReactNode } from "react";
import type { TrueFalseItem } from "@/components/activities/TrueFalseActivity";
import type { SortingCategory, SortingItem } from "@/components/activities/SortingActivity";
import type { FillBlankItem } from "@/components/activities/FillBlankActivity";
import type { ScenarioData } from "@/components/activities/ScenarioActivity";

export interface LessonSection {
  type: "text" | "callout" | "quiz" | "activity" | "image" | "bullets" | "key-term" | "video" | "true-false" | "sorting" | "fill-blank" | "scenario";
  title?: string;
  content: string | ReactNode;
  items?: string[];
  term?: string;
  src?: string;
  alt?: string;
  options?: string[];
  correctIndex?: number;
  // New activity data
  trueFalseItems?: TrueFalseItem[];
  sortingCategories?: SortingCategory[];
  sortingItems?: SortingItem[];
  fillBlankItems?: FillBlankItem[];
  scenarioData?: ScenarioData;
}

export interface Subtopic {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  storyBriefing?: string; // narrative intro for the mission
  sections: LessonSection[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  color: string;
  chapterTitle: string; // story chapter name
  storyIntro: string; // narrative hook
  subtopics: Subtopic[];
}

export const modules: Module[] = [
  {
    id: "introduction",
    number: 1,
    title: "Introduction to Misinformation & Media Literacy",
    description: "Your first day at the Cyber Defense Corps. Learn to identify the threats lurking in the information landscape.",
    color: "hsl(var(--module-1))",
    chapterTitle: "Chapter 1: The Awakening",
    storyIntro: "Welcome, recruit. The digital city of Veritás is under siege — waves of misinformation are flooding its networks. You've been selected to join the Cyber Defense Corps. Your training begins now.",
    subtopics: [
      {
        id: "what-is-disinfo",
        title: "What is Misinformation?",
        description: "Defining misinformation, disinformation, and malinformation.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: Veritás HQ has intercepted suspicious data packets. Before you can fight the threat, you need to understand what you're dealing with. Learn to classify the types of false information.",
        sections: [
          { type: "callout", content: "Agent, not all false information is the same. Understanding the distinctions is your first line of defense." },
          { type: "text", title: "Information", content: "Information is content that accurately represents facts or events as they are understood to be true." },
          { type: "text", title: "Misinformation", content: "is incorrect (or false information) but shared unintentionally. The person spreading it may genuinely believe it is true." },
          { type: "text", title: "Disinformation", content: "is false information spread deliberately, with the intent to deceive. When disinformation is coordinated by foreign actors to interfere with democratic processes like elections, it is called foreign information manipulation and interference." },
          { type: "text", title: "How Does Misinformation Spread?", content: "Misinformation spreads easily because it often feels credible. It can come from sources we trust, align with things we already believe, or trigger strong emotional reactions that make us less likely to stop and question it. Understanding this is key to catching it." },
          { type: "key-term", term: "Debunking", content: "showing that a piece of information is untrue and showing what is true" },
          { type: "bullets", title: "Key Takeaways", content: "", items: [
            "Misinformation is false or inaccurate but shared without harmful intent",
            "Disinformation is deliberately crafted to deceive",
            "Malinformation is true but weaponized or taken out of context to cause harm",
          ]},
          { 
            type: "text",
            title: "Resources",
            content: (
              <>
                Learn more at{" "}
                <a href="https://joint-research-centre.ec.europa.eu/jrc-news-and-updates/misinformation-and-disinformation-both-prebunking-and-debunking-work-fighting-it-2024-10-25_en" target="_blank" rel="noopener noreferrer">
                Misinformation and disinformation: both prebunking and debunking work for fighting it
                </a>.
              </>
            ),
          },
          { 
            type: "video", 
            title: "How False News Can Spread", 
            src: "https://www.youtube.com/embed/hz6GULbowAk", 
            content: "A TED-Ed that explains on how false news spreads and why it's so hard to stop." 
          },
          {
            type: "true-false",
            title: "Threat Classification Drill",
            content: "",
            trueFalseItems: [
              { statement: "Sharing a rumor you believe is true counts as disinformation.", isTrue: false, explanation: "If you genuinely believe it's true, it's misinformation — the intent to deceive is what makes something disinformation." },
              { statement: "Malinformation uses real facts but presents them in a misleading way.", isTrue: true, explanation: "Correct — malinformation is true information weaponized or taken out of context to cause harm." },
              { statement: "Disinformation is always created by foreign governments.", isTrue: false, explanation: "Disinformation can be created by anyone — individuals, groups, companies, or governments — as long as the intent is to deceive." },
              { statement: "A satirical news article shared as real news becomes misinformation.", isTrue: true, explanation: "When satire is shared without context and people believe it's real, it functions as misinformation." },
            ],
          },
          { type: "quiz", title: "Check Your Understanding", content: "Which term describes intentionally false information spread to deceive?", options: ["Misinformation", "Disinformation", "Malinformation", "Propaganda"], correctIndex: 1 },
        ],
      },
      {
        id: "critical-thinking",
        title: "Importance of Critical Thinking",
        description: "How to develop the mental firewall every agent needs.",
        estimatedMinutes: 10,
        storyBriefing: "🎯 Mission Briefing: Our analysts have detected a new wave of sophisticated attacks. Your standard training isn't enough — you need to develop critical thinking, the mental firewall that protects against manipulation.",
        sections: [
          { type: "callout", content: "\"The point of modern propaganda isn't only to misinform or push an agenda. It is to exhaust your critical thinking, to annihilate truth.\" — Garry Kasparov" },
          { type: "text", title: "Critical thinking...What is it?", content: "Critical thinking is the ability to think clearly and independently." },
          { type: "text", title: "Why It Matters", content: "The danger of these types is heightened by the extinction of local news; as of 2023, daily local newspapers were disappearing at a rate of two per week, leaving over 200 counties with no local news outlets at all. This lack of access, particularly in high-poverty areas, allows nearly 1,300 biased websites to fill the gap by masquerading as local news while pushing specific political agendas." },
          { type: "bullets", title: "It isn't just thinking hard; it is a structured process of:", content: "", items: [
            "Considering multiple perspectives",
            "Being mindful and actively checking your own biases",
            "Understanding the detailed context of a problem",
          ]},
          { 
            type: "image", 
            src: "/assets/critical-thinking-diagram.jpg", 
            alt: "Critical thinking process diagram", 
            title: "",
            content: "" 
          },
          { type: "bullets", title: "Key Elements of Critical Thinking:", content: "", items: [
            "Identify the premises and conclusions by breaking the argument into clear logical parts",
            "Clarify the argument by finding ambiguity or unclear statements",
            "Check the facts and evidence to see if the argument is accurate and complete",
            "Evaluate the logic and reasoning (inductive or deductive) to determine if the conclusion is supported",
            "Making a final judgment by weighing the argument against the evidence",
          ]},
          {
            type: "scenario",
            title: "Field Decision",
            content: "",
            scenarioData: {
              situation: "You see a viral post claiming that a new city law will ban all personal vehicles by next month. The post has 50,000 shares and an emotional headline. What's your move, agent?",
              choices: [
                { text: "Share it immediately to warn your friends and family", outcome: "By sharing unverified content, you've potentially amplified misinformation to your entire network. The claim turned out to be a distortion of a minor parking regulation change.", isOptimal: false },
                { text: "Check the original source and cross-reference with local news", outcome: "Smart move. You traced the claim to a satirical blog. The real news was a minor update to downtown parking rules — nothing close to banning vehicles.", isOptimal: true },
                { text: "Ignore it completely — it's probably fake", outcome: "While your instinct was right, simply ignoring misinformation without investigating means you can't help correct it when others share it.", isOptimal: false },
              ],
            },
          },
          { type: "text", title: "Resources", content: (
              <>
                Learn more at{" "}
                <a href="https://www.snhu.edu/about-us/newsroom/education/importance-of-critical-thinking-skills" target="_blank" rel="noopener noreferrer">
                The Importance of Critical Thinking Skills, For Students and Ourselves
                </a>.
              </>
            ), },
          { type: "quiz", title: "Quick Check", content: "Which critical thinking habit helps a person evaluate information more accurately before forming a conclusion?", options: ["Accepting the first explanation that sounds convincing", "Sharing information immediately without verification", "Relying only on personal opinions and experiences", "Questioning assumptions and examining evidence carefully"], correctIndex: 3 },
        ],
      },
      {
        id: "emotional-manipulation",
        title: "Emotional Manipulation",
        description: "How emotions are weaponized to bypass your defenses.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: Alert! Enemy operatives are deploying emotional payloads — content designed to bypass your rational defenses. Learn to recognize and neutralize emotional manipulation tactics.",
        sections: [
          { type: "callout", content: "If a headline makes you feel a strong emotion before you've even read the article, that's intentional. Emotional reactions are a feature, not a bug, of manipulative content." },
          { type: "text", title: "What Is Emotional Manipulation in Media?", content: "Emotional manipulation occurs when content is designed to trigger a strong feeling (fear, outrage, pride, or sympathy) in order to bypass your rational thinking. When we're flooded with emotion, we're less likely to stop and ask: Is this true? Where did this come from? What's missing from this story?" },
          { type: "key-term", term: "Emotional Override", content: "when an emotional response is so strong that it short-circuits critical evaluation of information, making us more likely to accept and share content without verifying it" },
          { type: "bullets", title: "Common Emotional Manipulation Tactics", content: "", items: [
            "Fear-mongering: Exaggerating threats to make an issue feel urgent and dangerous",
            "Outrage bait: Framing stories to provoke anger and increase sharing",
            "Sentimentality: Using emotional stories to generate sympathy that overrides skepticism",
            "Us vs. Them framing: Portraying issues as a battle between groups",
            "False urgency: Creating pressure to act before you can think critically",
          ]},
          { type: "text", title: "Why It Works", content: "Our brains are wired to prioritize emotional information — it helped our ancestors survive real threats. Manipulators exploit this by packaging false or misleading content in emotionally charged language, images, and headlines." },
          {
            type: "sorting",
            title: "Classify the Threat",
            content: "",
            sortingCategories: [
              { name: "🔴 Fear-mongering" },
              { name: "😡 Outrage Bait" },
              { name: "😢 Sentimentality" },
              { name: "⏰ False Urgency" },
            ],
            sortingItems: [
              { text: "\"TERRIFYING new virus could wipe out millions\"", correctCategory: 0 },
              { text: "\"Politicians CAUGHT destroying YOUR rights\"", correctCategory: 1 },
              { text: "\"This dying child just wants one share\"", correctCategory: 2 },
              { text: "\"Share NOW before this gets deleted!\"", correctCategory: 3 },
              { text: "\"Government hiding DEADLY truth from you\"", correctCategory: 0 },
              { text: "\"You won't BELIEVE what they said about us\"", correctCategory: 1 },
            ],
          },
          { type: "bullets", title: "Warning Signs to Watch For", content: "", items: [
            "The headline uses extreme language like 'shocking', 'destroyed', 'terrifying'",
            "You feel a strong urge to share before finishing the article",
            "The story confirms something you already strongly believe or fear",
            "There are no named sources, expert quotes, or links to original data",
            "The content is designed to make one group look entirely evil or heroic",
          ]},
          { type: "text", title: "Resources", content: (
              <>
                Learn more at{" "}
                <a href="https://www.snhu.edu/about-us/newsroom/education/importance-of-critical-thinking-skills" target="_blank" rel="noopener noreferrer">
                The Importance of Critical Thinking Skills, For Students and Ourselves
                </a>.
              </>
            ), },
          { type: "activity", title: "Pause & Reflect", content: "The next time a news story triggers a strong emotional reaction, pause before sharing. Ask yourself: What emotion am I feeling? Is this emotion making me skip fact-checking? Can I find this story in two other independent sources?" },
          { type: "quiz", title: "Spot the Tactic", content: "A news headline reads: 'TERRIFYING: They Are Coming for Your Children. Share Before This Gets Deleted.' Which emotional manipulation tactic is primarily being used?", options: ["Fear-mongering and false urgency", "Sentimentality", "Bandwagon effect", "Anchoring bias"], correctIndex: 0 },
        ],
      },
    ],
  },
  {
    id: "source-eval",
    number: 2,
    title: "Source Evaluation",
    description: "The enemy is sending decoys. Learn to separate signal from noise and verify your intel.",
    color: "hsl(var(--module-2))",
    chapterTitle: "Chapter 2: Signal & Noise",
    storyIntro: "The attack on Veritás is escalating. False sources are flooding the network, disguised as legitimate intel. Your mission: learn to evaluate sources, spot fabrications, and trace information back to its origin.",
    subtopics: [
      {
        id: "emotional-manipulation",
        title: "Advanced Threat Analysis",
        description: "Deep dive into how fabricated content mimics real sources.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: Our intel team has captured samples of enemy propaganda. Analyze the patterns and learn to identify fabricated content at a glance.",
        sections: [
          { type: "text", title: "Recognizing Fabricated Content", content: "Fabricated content is entirely made up — there's no factual basis. It's designed to look legitimate by mimicking the format of real news: professional layouts, fake author names, and convincing headlines." },
          { type: "bullets", title: "Red Flags of Fabricated Content", content: "", items: [
            "No author byline or a fake-sounding author name",
            "The website domain is a slight misspelling of a known outlet",
            "No other news outlets are reporting the same story",
            "The 'About Us' page is missing or vague",
            "Sensational claims with no linked sources or evidence",
          ]},
          {
            type: "true-false",
            title: "Intel Verification Drill",
            content: "",
            trueFalseItems: [
              { statement: "A professional-looking website design guarantees the content is credible.", isTrue: false, explanation: "Anyone can create a professional-looking website. Design quality does not equal content credibility." },
              { statement: "If a story appears on multiple social media accounts, it must be true.", isTrue: false, explanation: "Coordinated sharing campaigns can make fabricated stories appear widespread. Always check for independent original reporting." },
              { statement: "Checking the 'About Us' page can help identify suspicious websites.", isTrue: true, explanation: "Legitimate outlets have transparent information about their editorial team and mission." },
              { statement: "A .org domain means the website is always trustworthy.", isTrue: false, explanation: "Anyone can register a .org domain. The domain extension alone doesn't guarantee reliability." },
            ],
          },
          { type: "quiz", title: "Source Assessment", content: "You find an alarming health article on a site called 'HealthNewsDaily.net'. It has no author, no sources cited, and no other outlet reports the story. What should you conclude?", options: ["It's breaking news that other outlets haven't caught yet", "It's likely fabricated content designed to look like news", "It must be true because it has a professional domain", "You should share it to warn others just in case"], correctIndex: 1 },
        ],
      },
      {
        id: "fabricated-content",
        title: "Fabricated Content Detection",
        description: "Hands-on practice identifying completely made-up stories.",
        estimatedMinutes: 7,
        storyBriefing: "🎯 Mission Briefing: HQ is receiving a flood of reports. Some are real intelligence, others are planted fakes. Sort through the noise and identify what's fabricated.",
        sections: [
          { type: "text", title: "The Anatomy of Fake Stories", content: "Fabricated stories follow predictable patterns. They use emotional language, lack specific details, cite unnamed experts, and often include a call to urgency. Learning these patterns is like learning to read enemy code." },
          {
            type: "sorting",
            title: "Signal vs. Noise",
            content: "",
            sortingCategories: [
              { name: "🟢 Credible Indicators" },
              { name: "🔴 Fabrication Indicators" },
            ],
            sortingItems: [
              { text: "Named author with verifiable credentials", correctCategory: 0 },
              { text: "\"Experts say\" with no specific expert named", correctCategory: 1 },
              { text: "Links to original research or data", correctCategory: 0 },
              { text: "Story only found on one obscure website", correctCategory: 1 },
              { text: "Publication date and last-updated timestamp", correctCategory: 0 },
              { text: "ALL CAPS headline with exclamation marks", correctCategory: 1 },
            ],
          },
          {
            type: "scenario",
            title: "Field Operation",
            content: "",
            scenarioData: {
              situation: "You receive a message from a colleague sharing a link to a story about a major corporation secretly poisoning water supplies. The article looks professional but you've never heard of the website. Your colleague is urging you to share it before 'they take it down.'",
              choices: [
                { text: "Share it immediately — your colleague is trustworthy", outcome: "Even trustworthy people can be fooled. You've now amplified a story from an unknown source to your entire network without verification.", isOptimal: false },
                { text: "Search for the story on established news outlets and fact-checking sites", outcome: "Excellent protocol. You found that no major outlet is reporting this, and a fact-checking site has already debunked the claim as originating from a known disinformation network.", isOptimal: true },
                { text: "Reply telling your colleague it's obviously fake", outcome: "Without investigating first, you can't be certain. Dismissing without evidence can also damage trust and prevent productive conversations about media literacy.", isOptimal: false },
              ],
            },
          },
        ],
      },
      {
        id: "misleading-context",
        title: "Misleading Context",
        description: "When real content is deployed with false context.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: The enemy has shifted tactics — they're using real images, quotes, and data but stripping them of their original context. This makes the deception harder to detect.",
        sections: [
          { type: "text", title: "What is Misleading Context?", content: "Misleading context is when genuine content — a real photo, a real quote, real data — is shared with false or incomplete context that changes its meaning entirely. This is one of the most effective disinformation techniques because the underlying content IS real." },
          { type: "bullets", title: "Common Context Manipulation Techniques", content: "", items: [
            "Sharing an old photo as if it's from a current event",
            "Quoting someone accurately but removing the surrounding context",
            "Using real statistics but comparing them incorrectly",
            "Showing a real video clip but claiming it's from a different location",
          ]},
          {
            type: "fill-blank",
            title: "Decode the Intel",
            content: "",
            fillBlankItems: [
              { textBefore: "When real content is shared with false framing, it's called", textAfter: ".", correctAnswer: "misleading context", acceptableAnswers: ["misleading context"], hint: "type of manipulation" },
              { textBefore: "Sharing a photo from 2015 and claiming it shows a", textAfter: "event is a common tactic.", correctAnswer: "current", acceptableAnswers: ["current", "recent", "2024", "present"], hint: "timeframe" },
              { textBefore: "The most effective defense against misleading context is to trace content back to its", textAfter: ".", correctAnswer: "original source", acceptableAnswers: ["original source", "source", "origin"], hint: "where it came from" },
            ],
          },
          { type: "quiz", title: "Context Check", content: "A photo of a long line of cars at a gas station is shared with the caption 'Fuel crisis hits [your city] TODAY!' After investigation, you find the photo is from a hurricane evacuation 3 years ago. What type of manipulation is this?", options: ["Fabricated content", "Misleading context", "Satire", "Impersonation"], correctIndex: 1 },
        ],
      },
      {
        id: "impersonation",
        title: "Impersonation & Fake Accounts",
        description: "How bad actors create digital disguises to infiltrate networks.",
        estimatedMinutes: 9,
        storyBriefing: "🎯 Mission Briefing: Enemy agents are creating fake personas to infiltrate Veritás networks. Learn to identify impersonation tactics and unmask the imposters.",
        sections: [
          { type: "text", title: "The Art of Digital Disguise", content: "Impersonation online ranges from crude fake accounts to sophisticated operations with stolen photos, fabricated histories, and carefully built follower networks. Bad actors create fake personas to build trust before spreading their narratives." },
          { type: "bullets", title: "Red Flags for Fake Accounts", content: "", items: [
            "Account created very recently with sudden high activity",
            "Profile photo looks too perfect (possibly AI-generated) or is stolen from someone else",
            "Posts exclusively about one political or social topic",
            "Unusual posting patterns (posting 24/7 or in bursts)",
            "Username is a random string of letters and numbers",
            "Follower-to-following ratio is extremely skewed",
          ]},
          {
            type: "true-false",
            title: "Imposter Detection Drill",
            content: "",
            trueFalseItems: [
              { statement: "A verified blue checkmark always means an account is trustworthy.", isTrue: false, explanation: "Verification means the platform confirmed identity, not that the person's content is truthful. On some platforms, verification can even be purchased." },
              { statement: "AI can now generate realistic profile photos of people who don't exist.", isTrue: true, explanation: "Tools like StyleGAN create photorealistic faces. You can check suspicious photos at thispersondoesnotexist.com to understand how convincing they are." },
              { statement: "Bot accounts always have zero followers.", isTrue: false, explanation: "Sophisticated bot networks follow each other to create the illusion of legitimate follower counts." },
            ],
          },
          { type: "activity", title: "Profile Analysis", content: "Next time you encounter a strong opinion from an unfamiliar account on social media, take 60 seconds to check: When was the account created? What else do they post about? Does their photo reverse-image-search to someone else? Is their engagement pattern human-like?" },
        ],
      },
      {
        id: "amplification",
        title: "Amplification Strategies",
        description: "How disinformation goes viral through coordinated operations.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: We've detected coordinated amplification campaigns targeting Veritás. Learn how small pieces of disinformation become viral epidemics.",
        sections: [
          { type: "text", title: "The Amplification Machine", content: "A single piece of disinformation can reach millions through coordinated amplification. This involves bot networks, troll farms, and strategic seeding across multiple platforms to create the illusion of organic viral spread." },
          { type: "key-term", term: "Astroturfing", content: "creating the impression of widespread grassroots support for a position when the support is actually manufactured by a small coordinated group" },
          { type: "bullets", title: "How Amplification Works", content: "", items: [
            "Step 1: Content is created and seeded on fringe platforms",
            "Step 2: Bot networks share it thousands of times to create artificial momentum",
            "Step 3: Influencers or unsuspecting users pick it up, giving it credibility",
            "Step 4: Mainstream platforms' algorithms detect 'trending' content and amplify it further",
            "Step 5: Legacy media covers the 'viral story,' completing the cycle",
          ]},
          {
            type: "fill-blank",
            title: "Complete the Intelligence Report",
            content: "",
            fillBlankItems: [
              { textBefore: "Creating fake grassroots support is called", textAfter: ".", correctAnswer: "astroturfing", hint: "fake grassroots" },
              { textBefore: "Bot networks create artificial", textAfter: "to make content appear popular.", correctAnswer: "momentum", acceptableAnswers: ["momentum", "engagement", "popularity"], hint: "energy or movement" },
              { textBefore: "The final step of amplification often involves", textAfter: "media covering the viral story.", correctAnswer: "mainstream", acceptableAnswers: ["mainstream", "legacy", "traditional"], hint: "type of media" },
            ],
          },
          { type: "callout", content: "A 2018 MIT study found that false news spreads six times faster than true news on social media, largely because it tends to be more novel and emotionally provocative." },
        ],
      },
    ],
  },
  {
    id: "visual-deception",
    number: 3,
    title: "Visual Deception",
    description: "The enemy is deploying visual weapons — doctored images, deepfakes, and manipulated media. Time to train your eyes.",
    color: "hsl(var(--module-3))",
    chapterTitle: "Chapter 3: The Visual Front",
    storyIntro: "Agent, the battlefield has shifted. The enemy is now weaponizing visual media — doctored photos, out-of-context videos, and AI-generated imagery. Your eyes are your best defense, but only if trained properly.",
    subtopics: [
      {
        id: "source-evaluation",
        title: "The SIFT Method",
        description: "Your field manual for rapid source evaluation.",
        estimatedMinutes: 10,
        storyBriefing: "🎯 Mission Briefing: HQ has developed a rapid evaluation protocol — codename SIFT. Master this technique to assess any source in under 60 seconds.",
        sections: [
          { type: "text", title: "What is SIFT?", content: "SIFT is a four-step method developed by digital literacy expert Mike Caulfield. It's designed to help you quickly evaluate online claims without falling down rabbit holes." },
          { type: "bullets", title: "The SIFT Protocol", content: "", items: [
            "S — Stop: Pause before engaging with or sharing content",
            "I — Investigate the source: Who created this? What's their reputation?",
            "F — Find better coverage: What do other reliable sources say about this claim?",
            "T — Trace claims: Find the original source of the claim, not just who shared it",
          ]},
          {
            type: "scenario",
            title: "Apply SIFT in the Field",
            content: "",
            scenarioData: {
              situation: "You see a tweet with a dramatic photo claiming 'Massive explosion rocks downtown — government covering it up!' The tweet has 15,000 retweets. How do you apply SIFT?",
              choices: [
                { text: "Stop and retweet it to warn people", outcome: "You skipped the most important step — stopping to evaluate. Retweeting amplified an unverified claim to your entire network.", isOptimal: false },
                { text: "Stop, check who posted it, search for the story on news sites, and reverse-image-search the photo", outcome: "Perfect SIFT execution. The reverse image search reveals the photo is from a factory fire in another country two years ago. No explosion occurred downtown.", isOptimal: true },
                { text: "Comment asking if it's real", outcome: "While questioning is good, you're relying on others to do your verification. The SIFT method empowers you to investigate independently.", isOptimal: false },
              ],
            },
          },
          {
            type: "fill-blank",
            title: "SIFT Protocol Check",
            content: "",
            fillBlankItems: [
              { textBefore: "The S in SIFT stands for", textAfter: "— the first thing you should do before engaging with content.", correctAnswer: "Stop", hint: "pause" },
              { textBefore: "The I stands for", textAfter: "the source to learn about who created the content.", correctAnswer: "Investigate", hint: "look into" },
              { textBefore: "The T stands for", textAfter: "claims back to their original source.", correctAnswer: "Trace", acceptableAnswers: ["Trace", "Tracing"], hint: "follow back" },
            ],
          },
          { type: "quiz", title: "Practice SIFT", content: "When applying SIFT, what should you do FIRST when you encounter a suspicious claim?", options: ["Share it with a warning label", "Stop and resist the urge to engage immediately", "Find the original source right away", "Comment that it might be fake"], correctIndex: 1 },
        ],
      },
      {
        id: "fact-checking",
        title: "Fact-Checking Arsenal",
        description: "Tools and techniques for verifying any claim.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: Every agent needs their toolkit. Here are the weapons-grade fact-checking tools that will help you verify any claim in the field.",
        sections: [
          { type: "text", title: "Your Verification Toolkit", content: "Professional fact-checkers use a combination of tools and techniques. As a Cyber Defense agent, you need to know these tools and when to deploy them." },
          { type: "bullets", title: "Essential Fact-Checking Tools", content: "", items: [
            "Snopes.com — One of the oldest and most comprehensive fact-checking sites",
            "FactCheck.org — Nonpartisan, nonprofit focused on U.S. political claims",
            "Google Reverse Image Search — Verify where images actually originate",
            "Wayback Machine (web.archive.org) — See previous versions of web pages",
            "AllSides.com — Compare how different outlets cover the same story",
          ]},
          {
            type: "sorting",
            title: "Match the Tool to the Task",
            content: "",
            sortingCategories: [
              { name: "🖼️ Image Verification" },
              { name: "📰 Claim Checking" },
              { name: "🕐 Historical Research" },
            ],
            sortingItems: [
              { text: "Google Reverse Image Search", correctCategory: 0 },
              { text: "Snopes.com", correctCategory: 1 },
              { text: "Wayback Machine", correctCategory: 2 },
              { text: "TinEye", correctCategory: 0 },
              { text: "FactCheck.org", correctCategory: 1 },
              { text: "Web Archive", correctCategory: 2 },
            ],
          },
          { type: "activity", title: "Fact-Check Challenge", content: "Pick a viral claim you've seen recently on social media. Using at least two of the tools above, try to verify or debunk the claim. What did you find? How long did it take?" },
        ],
      },
      {
        id: "reverse-image",
        title: "Visual Forensics",
        description: "Techniques for verifying images and detecting manipulation.",
        estimatedMinutes: 6,
        storyBriefing: "🎯 Mission Briefing: The visual front is the most deceptive. Images can be doctored, AI-generated, or taken completely out of context. Train your forensic eye.",
        sections: [
          { type: "text", title: "The Power of Reverse Image Search", content: "Reverse image search allows you to find where an image first appeared online, whether it's been edited, and whether it's being used in the wrong context. It's one of the most powerful verification tools available." },
          { type: "bullets", title: "Signs of Image Manipulation", content: "", items: [
            "Unnatural lighting or shadows that don't match the scene",
            "Blurred edges around people or objects (signs of editing)",
            "Text in the image doesn't match the claimed location or language",
            "The image resolution varies in different areas (pasted elements)",
            "Metadata (EXIF data) doesn't match the claimed date or location",
          ]},
          {
            type: "true-false",
            title: "Visual Forensics Drill",
            content: "",
            trueFalseItems: [
              { statement: "Reverse image search can always detect AI-generated images.", isTrue: false, explanation: "AI-generated images are brand new and won't appear in search results. You need other techniques to detect AI imagery." },
              { statement: "EXIF data in a photo can reveal when and where it was taken.", isTrue: true, explanation: "EXIF metadata often contains date, time, camera info, and sometimes GPS coordinates — but it can be stripped or modified." },
              { statement: "A high-resolution image is more likely to be authentic.", isTrue: false, explanation: "AI can generate high-resolution images, and manipulated photos can also be high quality. Resolution alone doesn't indicate authenticity." },
            ],
          },
          { type: "quiz", title: "Image Verification", content: "You see a dramatic photo claimed to be from a protest in your city yesterday. What's the best first step to verify it?", options: ["Check if it looks realistic", "Run a reverse image search to find its original source", "Ask the poster where they got it", "Check if the weather matches yesterday's forecast"], correctIndex: 1 },
        ],
      },
      {
        id: "url-analysis",
        title: "URL & Domain Intelligence",
        description: "Reading URLs to unmask suspicious websites.",
        estimatedMinutes: 7,
        storyBriefing: "🎯 Mission Briefing: The enemy creates convincing website clones with subtle URL differences. Learn to read URLs like an agent reads a coded message.",
        sections: [
          { type: "text", title: "Decoding URLs", content: "A URL is like a digital address. Learning to read it properly can instantly reveal whether a website is legitimate or a clever impersonation." },
          { type: "bullets", title: "URL Red Flags", content: "", items: [
            "Misspelled domain names (gogle.com, faceb00k.com)",
            "Extra subdomains (login.bank.suspicious-site.com)",
            "Unusual domain extensions (.info, .xyz for news sites)",
            "Very long URLs with random characters",
            "HTTP instead of HTTPS on sites that should be secure",
          ]},
          {
            type: "sorting",
            title: "URL Classification",
            content: "",
            sortingCategories: [
              { name: "✅ Legitimate" },
              { name: "🚨 Suspicious" },
            ],
            sortingItems: [
              { text: "www.reuters.com/article/...", correctCategory: 0 },
              { text: "www.reut3rs-news.com/breaking/...", correctCategory: 1 },
              { text: "www.bbc.co.uk/news/...", correctCategory: 0 },
              { text: "www.bbc-breaking-news.info/...", correctCategory: 1 },
              { text: "www.apnews.com/article/...", correctCategory: 0 },
              { text: "www.ap-news-daily.xyz/urgent/...", correctCategory: 1 },
            ],
          },
          { type: "quiz", title: "Spot the Fake URL", content: "Which URL is most likely a legitimate news source?", options: ["breaking-news-today.info/urgent-alert", "www.reuters.com/world/article-12345", "cnn-exclusive-report.com/shocking", "news-wire-global.xyz/latest"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: "national-security",
    number: 4,
    title: "The Mind Games",
    description: "The most dangerous weapon is already inside your head. Understand the cognitive biases that make you vulnerable.",
    color: "hsl(var(--module-4))",
    chapterTitle: "Chapter 4: Mind Games",
    storyIntro: "Agent, the hardest truth in cyber defense: your own brain can be your greatest vulnerability. Cognitive biases are blind spots that attackers exploit. This chapter is about knowing yourself so the enemy can't use you against yourself.",
    subtopics: [
      {
        id: "confirmation-bias",
        title: "Confirmation Bias",
        description: "The most exploited vulnerability in your mental armor.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: Our psychological profiling reveals that confirmation bias is the #1 exploited weakness. It makes you seek information that confirms what you already believe — and reject what doesn't.",
        sections: [
          { type: "text", title: "Your Blind Spot", content: "Confirmation bias is the tendency to search for, interpret, and remember information in a way that confirms your pre-existing beliefs. It's not a character flaw — it's how human brains are wired. But attackers know this, and they exploit it." },
          { type: "key-term", term: "Confirmation Bias", content: "the tendency to favor information that confirms existing beliefs while ignoring or dismissing contradicting evidence, regardless of its quality" },
          {
            type: "scenario",
            title: "Bias in Action",
            content: "",
            scenarioData: {
              situation: "You strongly believe that a certain health supplement is effective. You find an article that says it's been proven dangerous. The article cites peer-reviewed research. What do you do?",
              choices: [
                { text: "Dismiss it — you've had good experiences, so the research must be flawed", outcome: "This is confirmation bias in action. Personal experience, while valid, doesn't override systematic research. Dismissing evidence that contradicts your beliefs makes you vulnerable to manipulation.", isOptimal: false },
                { text: "Read the study, check the methodology, and update your beliefs based on evidence", outcome: "This is exactly what a well-trained agent does. Evaluating evidence on its merits — regardless of whether it confirms your prior beliefs — is the core of critical thinking.", isOptimal: true },
                { text: "Search online until you find an article that supports your original belief", outcome: "This is a classic confirmation bias behavior — cherry-picking sources. You can always find someone who agrees with you online; that doesn't make them right.", isOptimal: false },
              ],
            },
          },
          {
            type: "true-false",
            title: "Bias Awareness Drill",
            content: "",
            trueFalseItems: [
              { statement: "Smart, well-educated people are immune to confirmation bias.", isTrue: false, explanation: "Research shows that higher intelligence can actually make people better at rationalizing biased positions, not better at avoiding bias." },
              { statement: "Actively seeking out viewpoints you disagree with helps counter confirmation bias.", isTrue: true, explanation: "Deliberately exposing yourself to opposing perspectives is one of the most effective strategies against confirmation bias." },
              { statement: "Confirmation bias only affects political beliefs.", isTrue: false, explanation: "It affects every domain — health decisions, financial choices, personal relationships, and scientific understanding." },
            ],
          },
          { type: "quiz", title: "Bias Check", content: "Someone who only follows news sources that align with their political views is exhibiting which bias?", options: ["Confirmation bias", "Anchoring bias", "Dunning-Kruger effect", "Bandwagon effect"], correctIndex: 0 },
        ],
      },
      {
        id: "bandwagon-effect",
        title: "The Bandwagon Effect",
        description: "When everyone's doing it, it must be right... right?",
        estimatedMinutes: 7,
        storyBriefing: "🎯 Mission Briefing: The enemy knows that humans are social creatures. They create the illusion of consensus to make their lies seem like popular truth. Learn to recognize manufactured agreement.",
        sections: [
          { type: "text", title: "The Power of the Crowd", content: "The bandwagon effect is a cognitive bias where people adopt beliefs or behaviors because they perceive that 'everyone else' is doing it. Social media has supercharged this bias — like counts, share numbers, and trending topics create powerful social proof." },
          { type: "key-term", term: "Social Proof", content: "the psychological phenomenon where people look to the actions and opinions of others to determine what is correct, especially in situations of uncertainty" },
          {
            type: "fill-blank",
            title: "Decode the Psychology",
            content: "",
            fillBlankItems: [
              { textBefore: "The tendency to adopt beliefs because others hold them is called the", textAfter: "effect.", correctAnswer: "bandwagon", hint: "jumping on the..." },
              { textBefore: "High share counts and trending topics create", textAfter: ", making claims seem more credible.", correctAnswer: "social proof", acceptableAnswers: ["social proof"], hint: "type of proof" },
              { textBefore: "Bot networks exploit this by creating artificial", textAfter: "around false content.", correctAnswer: "consensus", acceptableAnswers: ["consensus", "agreement", "popularity", "engagement"], hint: "fake agreement" },
            ],
          },
          {
            type: "scenario",
            title: "Crowd Control",
            content: "",
            scenarioData: {
              situation: "A petition is going viral with '2 million signatures' demanding a policy change based on a claim you haven't verified. Your friends are signing it and pressuring you to do the same. What do you do?",
              choices: [
                { text: "Sign it — 2 million people can't all be wrong", outcome: "The number of supporters doesn't validate the underlying claim. Many viral petitions are based on misleading or false information, and signature counts can be inflated.", isOptimal: false },
                { text: "Verify the claim behind the petition before deciding whether to sign", outcome: "Well done. A responsible agent verifies the facts before taking action, regardless of how many others have already acted on potentially false information.", isOptimal: true },
                { text: "Refuse to sign just to be contrarian", outcome: "Being automatically contrarian isn't critical thinking — it's just the inverse of bandwagon thinking. The goal is to make informed decisions based on evidence.", isOptimal: false },
              ],
            },
          },
          { type: "quiz", title: "Social Proof Test", content: "Why does the bandwagon effect make disinformation more dangerous on social media?", options: ["Social media is unregulated", "High engagement numbers create the illusion of credibility", "People don't use social media for news", "Algorithms block false content"], correctIndex: 1 },
        ],
      },
      {
        id: "anchoring",
        title: "Anchoring & Framing",
        description: "The first thing you hear shapes everything after.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: The enemy plants 'anchor' information early in a news cycle, knowing that first impressions shape all subsequent judgments. Learn to recognize when you're being anchored.",
        sections: [
          { type: "text", title: "The Anchor Effect", content: "Anchoring bias occurs when the first piece of information you encounter about a topic disproportionately influences your thinking. Even if that first piece is wrong, it creates a mental anchor that's hard to move away from." },
          { type: "text", title: "Framing in Media", content: "Framing is how information is presented — the words chosen, what's emphasized, and what's omitted. The same facts can be framed to tell very different stories. For example: '90% survival rate' vs '10% death rate' — same statistic, very different emotional impact." },
          {
            type: "sorting",
            title: "Spot the Frame",
            content: "",
            sortingCategories: [
              { name: "😊 Positive Frame" },
              { name: "😨 Negative Frame" },
            ],
            sortingItems: [
              { text: "\"9 out of 10 patients recover\"", correctCategory: 0 },
              { text: "\"1 in 10 patients don't survive\"", correctCategory: 1 },
              { text: "\"Unemployment drops to 4%\"", correctCategory: 0 },
              { text: "\"1 in 25 workers still can't find jobs\"", correctCategory: 1 },
              { text: "\"Community raises $50,000 for project\"", correctCategory: 0 },
              { text: "\"Project still $200,000 short of goal\"", correctCategory: 1 },
            ],
          },
          { type: "callout", content: "Next time you read a statistic, try to reframe it. If they say \"70% support this policy,\" also consider: \"30% oppose it.\" Both are true. Which one was chosen to present, and why?" },
          { type: "quiz", title: "Framing Check", content: "A headline reads: 'New policy could cost taxpayers $2 billion.' An alternative headline for the same policy reads: 'New policy projected to generate $8 billion in economic growth.' What's happening here?", options: ["One headline is lying", "Both headlines are using framing to emphasize different aspects", "The first headline is always more accurate", "Headlines don't affect how people interpret news"], correctIndex: 1 },
        ],
      },
      {
        id: "dunning-kruger",
        title: "The Dunning-Kruger Effect",
        description: "When you don't know what you don't know.",
        estimatedMinutes: 7,
        storyBriefing: "🎯 Mission Briefing: Our most dangerous vulnerability: overconfidence. When agents think they're experts, they stop checking. The Dunning-Kruger effect explains why the least competent are often the most confident.",
        sections: [
          { type: "text", title: "The Confidence Trap", content: "The Dunning-Kruger effect is a cognitive bias where people with limited knowledge in an area overestimate their competence. Conversely, actual experts tend to underestimate theirs. This is extremely relevant to media literacy — people who know a little about a topic often feel most confident they can spot misinformation, when they're actually most vulnerable." },
          { type: "key-term", term: "Dunning-Kruger Effect", content: "a cognitive bias where individuals with limited knowledge overestimate their ability, while experts tend to underestimate theirs — making the least informed the most confident" },
          {
            type: "true-false",
            title: "Confidence Check",
            content: "",
            trueFalseItems: [
              { statement: "People who score lowest on media literacy tests tend to rate their own abilities highest.", isTrue: true, explanation: "Research consistently shows that those with the least knowledge are the most overconfident — a hallmark of the Dunning-Kruger effect." },
              { statement: "Once you complete a media literacy course, you're immune to misinformation.", isTrue: false, explanation: "Education helps, but no one is immune. The threat landscape constantly evolves, and overconfidence itself becomes a vulnerability." },
              { statement: "Experts express more uncertainty because they understand the complexity of a topic.", isTrue: true, explanation: "Genuine expertise brings awareness of nuance, edge cases, and unknowns — leading to more cautious, qualified statements." },
            ],
          },
          { type: "callout", content: "The best defense against the Dunning-Kruger effect: intellectual humility. The more you learn, the more you realize how much you don't know — and that awareness is a strength, not a weakness." },
          { type: "quiz", title: "Self-Assessment", content: "Which statement best describes the Dunning-Kruger effect?", options: ["Experts are always right", "The less you know, the more confident you tend to be", "Intelligent people don't fall for misinformation", "Confidence always indicates competence"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: "social-media",
    number: 5,
    title: "The Digital Battlefield",
    description: "Social media and AI are reshaping the war on truth. Navigate the most complex terrain yet.",
    color: "hsl(var(--module-5))",
    chapterTitle: "Chapter 5: Digital Battlefield",
    storyIntro: "Welcome to the front lines, agent. Social media platforms and AI technologies have transformed the information landscape into a complex battlefield. Deepfakes, AI-generated text, and synthetic media are the new weapons. Prepare for the most advanced threats.",
    subtopics: [
      {
        id: "what-are-deepfakes",
        title: "Deepfakes & Synthetic Media",
        description: "Understanding AI-generated deception.",
        estimatedMinutes: 9,
        storyBriefing: "🎯 Mission Briefing: CRITICAL ALERT — enemy forces have deployed deepfake technology. They can make anyone appear to say anything. Your mission: learn to detect the undetectable.",
        sections: [
          { type: "text", title: "What Are Deepfakes?", content: "Deepfakes are synthetic media where a person's likeness is replaced with someone else's using AI. The technology has advanced so rapidly that deepfakes can now fool even trained observers. They can be used to create fake speeches, fraudulent evidence, and manufactured scandals." },
          { type: "bullets", title: "Deepfake Detection Clues", content: "", items: [
            "Unnatural blinking patterns or eye movements",
            "Mismatched lip movements with audio",
            "Inconsistent lighting on the face vs. background",
            "Slight blurring around the hairline or jawline",
            "Unnatural skin texture or 'waxy' appearance",
            "Audio quality that doesn't match the visual setting",
          ]},
          {
            type: "true-false",
            title: "Deepfake Intel Drill",
            content: "",
            trueFalseItems: [
              { statement: "Deepfakes require expensive equipment and expert knowledge to create.", isTrue: false, explanation: "Free and low-cost deepfake tools are widely available online. Anyone with a computer can create basic deepfakes." },
              { statement: "Deepfake audio can clone someone's voice from just a few seconds of sample audio.", isTrue: true, explanation: "Modern AI voice cloning can create convincing replicas from very short audio samples — making phone scams and fake audio clips increasingly dangerous." },
              { statement: "There are reliable tools that can detect all deepfakes with 100% accuracy.", isTrue: false, explanation: "Detection tools exist, but they're in an arms race with creation tools. No detection method is 100% reliable, and deepfakes continue to improve." },
            ],
          },
          { type: "callout", content: "In 2024, a deepfake video call was used to trick a company into transferring $25 million. The attackers impersonated the company's CFO in a live video conference." },
          { type: "quiz", title: "Deepfake Detection", content: "Which is the most reliable approach to verifying a suspicious video of a public figure making a controversial statement?", options: ["Check if the video looks realistic", "Look for the statement in official press releases or verified accounts", "Count the person's blinks", "Check the video's resolution"], correctIndex: 1 },
        ],
      },
      {
        id: "ai-generated-text",
        title: "AI-Generated Text",
        description: "When machines write the propaganda.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: AI language models can now generate convincing articles, social media posts, and even academic-sounding papers at scale. Learn to spot machine-written content and understand the threat.",
        sections: [
          { type: "text", title: "The Rise of AI Writers", content: "Large language models can generate human-like text on any topic in seconds. This means disinformation can now be produced at industrial scale — thousands of unique articles, comments, and social media posts created automatically to flood the information space." },
          { type: "bullets", title: "Signs of AI-Generated Text", content: "", items: [
            "Overly smooth, generic writing without personal voice or quirks",
            "Perfectly structured but lacking original insight or lived experience",
            "Confident factual claims that sound plausible but are subtly wrong",
            "Repetitive sentence structures or phrases",
            "Lack of specific, verifiable details (names, dates, locations)",
          ]},
          {
            type: "scenario",
            title: "AI or Human?",
            content: "",
            scenarioData: {
              situation: "You read a highly detailed article about a health crisis in a small town. The writing is polished and professional, but you notice: no specific town is named, no doctors are quoted by name, and no dates are given. The article appeared simultaneously on 12 different websites.",
              choices: [
                { text: "It's definitely AI-generated because it's well-written", outcome: "Good writing alone doesn't indicate AI authorship. However, you identified several valid red flags — the answer requires looking at the full picture, not one factor.", isOptimal: false },
                { text: "The lack of specific details + appearing on many sites simultaneously suggests AI-generated content", outcome: "Strong analysis. The combination of vague details, no verifiable specifics, and simultaneous multi-platform publication is a hallmark of AI-generated disinformation campaigns.", isOptimal: true },
                { text: "It must be real because it's about health — that's important", outcome: "The importance of a topic doesn't guarantee the authenticity of content about it. In fact, important topics are often targeted precisely because people are more likely to engage with and share them.", isOptimal: false },
              ],
            },
          },
          {
            type: "fill-blank",
            title: "AI Threat Assessment",
            content: "",
            fillBlankItems: [
              { textBefore: "AI can generate thousands of unique articles at", textAfter: ", making human fact-checking nearly impossible to keep up.", correctAnswer: "scale", acceptableAnswers: ["scale", "industrial scale"], hint: "volume" },
              { textBefore: "A key sign of AI text is confident claims that lack", textAfter: "details.", correctAnswer: "specific", acceptableAnswers: ["specific", "verifiable", "concrete"], hint: "exact or concrete" },
            ],
          },
          { type: "quiz", title: "AI Detection", content: "What is the BIGGEST danger of AI-generated disinformation compared to human-created disinformation?", options: ["AI writing is always more convincing", "AI can produce unique content at massive scale", "AI content is harder to take down", "AI content spreads faster on social media"], correctIndex: 1 },
        ],
      },
      {
        id: "synthetic-media",
        title: "Platform Manipulation",
        description: "How social media algorithms become weapons.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: The platforms themselves have become part of the battlefield. Algorithms designed for engagement are being exploited to amplify disinformation. Understand the system to defend against it.",
        sections: [
          { type: "text", title: "The Algorithm Problem", content: "Social media algorithms are designed to maximize engagement — time spent on the platform. Unfortunately, false, outrageous, and emotionally triggering content generates more engagement than accurate, nuanced reporting. This means algorithms often become inadvertent amplifiers of disinformation." },
          { type: "bullets", title: "How Algorithms Are Exploited", content: "", items: [
            "Emotionally triggering content gets prioritized because it generates reactions",
            "Filter bubbles trap users in echo chambers of reinforcing content",
            "Recommendation systems can lead users from mild content to extremism",
            "Engagement metrics (likes, shares) can be artificially inflated by bots",
            "Content moderation can't keep pace with the volume of posts",
          ]},
          {
            type: "sorting",
            title: "Defense Strategies",
            content: "",
            sortingCategories: [
              { name: "✅ Effective Defense" },
              { name: "❌ False Sense of Security" },
            ],
            sortingItems: [
              { text: "Diversifying your news sources across the political spectrum", correctCategory: 0 },
              { text: "Only following accounts that agree with your views", correctCategory: 1 },
              { text: "Regularly checking fact-checking websites", correctCategory: 0 },
              { text: "Assuming your platform filters out all false content", correctCategory: 1 },
              { text: "Using browser extensions that flag unreliable sources", correctCategory: 0 },
              { text: "Trusting content because it has many likes", correctCategory: 1 },
            ],
          },
          { type: "callout", content: "Studies show that a user can go from a mainstream political video to extremist content in as few as 5-7 clicks through recommendation algorithms." },
          { type: "quiz", title: "Algorithm Awareness", content: "Why do social media algorithms tend to amplify false information?", options: ["They're programmed to spread lies", "False content often generates more engagement, which algorithms reward", "Algorithms can't tell the difference between true and false", "Platform owners profit from disinformation"], correctIndex: 1 },
        ],
      },
      {
        id: "future-threats",
        title: "The Evolving Threat",
        description: "What's next on the horizon of information warfare.",
        estimatedMinutes: 7,
        storyBriefing: "🎯 Mission Briefing: Intelligence suggests the enemy is developing new capabilities. Real-time deepfakes, AI agents that argue in forums, and hyper-personalized manipulation. Prepare for what's coming.",
        sections: [
          { type: "text", title: "The Next Generation of Threats", content: "The information warfare landscape is evolving rapidly. New technologies are emerging that will make current threats look primitive. Understanding these trends helps you prepare." },
          { type: "bullets", title: "Emerging Threats", content: "", items: [
            "Real-time deepfakes in video calls that can impersonate anyone",
            "AI agents that autonomously create and spread tailored disinformation",
            "Hyper-personalized manipulation using your digital footprint",
            "Synthetic social networks with entirely AI-generated 'users'",
            "Audio deepfakes for phone-based social engineering",
          ]},
          {
            type: "scenario",
            title: "Future Scenario",
            content: "",
            scenarioData: {
              situation: "It's 2026. You receive a video call from someone who looks and sounds exactly like your bank manager, asking you to confirm a transaction. They know your account details and recent purchases. But something feels slightly off. What do you do?",
              choices: [
                { text: "Proceed with the transaction — they clearly know my details", outcome: "Real-time deepfakes combined with data breaches can create incredibly convincing impersonations. Having your personal details doesn't verify identity.", isOptimal: false },
                { text: "Hang up and call your bank directly using the number on your card", outcome: "Perfect protocol. Never verify identity through the same channel that initiated contact. Always use an independent, verified communication channel.", isOptimal: true },
                { text: "Ask them a security question to verify their identity", outcome: "If they've accessed your data, they may know your security answers too. The only reliable approach is to independently contact the institution through verified channels.", isOptimal: false },
              ],
            },
          },
          { type: "callout", content: "The World Economic Forum has ranked misinformation and disinformation as the #1 global risk for the next two years. This isn't just a media problem — it's a civilizational challenge." },
        ],
      },
    ],
  },
  {
    id: "building-resilience",
    number: 6,
    title: "Guardian Protocol",
    description: "Your final mission: become a guardian of truth. Build lasting habits and empower your community.",
    color: "hsl(var(--module-6))",
    chapterTitle: "Chapter 6: Guardian Protocol",
    storyIntro: "Congratulations, agent. You've made it to the final chapter. Everything you've learned has prepared you for this: becoming a Guardian of Veritás. Your mission now extends beyond self-defense — it's time to protect your community and build lasting resilience against the tide of misinformation.",
    subtopics: [
      {
        id: "personal-habits",
        title: "Building Your Shield",
        description: "Daily habits that keep your defenses strong.",
        estimatedMinutes: 8,
        storyBriefing: "🎯 Mission Briefing: Every agent needs a daily routine to maintain peak readiness. These habits will keep your information defenses strong long after training ends.",
        sections: [
          { type: "text", title: "Your Daily Defense Protocol", content: "Media literacy isn't a one-time skill — it's an ongoing practice. Like physical fitness, it requires regular exercise to stay sharp. Here are the habits that will keep your defenses strong." },
          { type: "bullets", title: "The Guardian's Daily Habits", content: "", items: [
            "Check at least two different news sources before forming an opinion on any story",
            "Spend 5 minutes on a fact-checking site to learn about current false claims",
            "Before sharing anything on social media, ask: Have I verified this? What's the source?",
            "Notice when content triggers a strong emotional reaction — that's your cue to slow down",
            "Periodically review your social media follows — are you in a filter bubble?",
          ]},
          {
            type: "scenario",
            title: "Morning Briefing",
            content: "",
            scenarioData: {
              situation: "You wake up to 15 notifications about a 'breaking story' that feels alarming. Your group chats are buzzing. What's your morning protocol?",
              choices: [
                { text: "Read everything quickly and share the most important-looking article", outcome: "Morning urgency + social pressure is a classic recipe for spreading unverified content. Speed is the enemy of accuracy.", isOptimal: false },
                { text: "Check one trusted news source first, then cross-reference before engaging with any of the messages", outcome: "Excellent protocol. Starting with a trusted source gives you a baseline of verified facts before engaging with potentially misleading content in your notifications.", isOptimal: true },
                { text: "Ignore all notifications — if it's real, you'll hear about it eventually", outcome: "While not engaging with unverified content is better than amplifying it, complete disengagement means you can't help correct misinformation in your circles.", isOptimal: false },
              ],
            },
          },
          {
            type: "fill-blank",
            title: "Protocol Check",
            content: "",
            fillBlankItems: [
              { textBefore: "Before sharing content on social media, you should always verify the", textAfter: "first.", correctAnswer: "source", acceptableAnswers: ["source", "facts", "claim"], hint: "where it came from" },
              { textBefore: "A strong emotional reaction to a headline is your cue to", textAfter: "down.", correctAnswer: "slow", hint: "opposite of speed up" },
              { textBefore: "Checking at least", textAfter: "different sources helps prevent filter bubble effects.", correctAnswer: "two", acceptableAnswers: ["two", "2", "three", "3", "multiple"], hint: "a number" },
            ],
          },
          { type: "activity", title: "Media Diet Audit", content: "Take 5 minutes right now: List the top 5 sources where you get your news. Are they diverse in perspective? Do any of them regularly get flagged by fact-checkers? Are you in a filter bubble? Write down one source you could add to diversify your information diet." },
        ],
      },
      {
        id: "conversation-skills",
        title: "Ally Recruitment",
        description: "How to discuss misinformation without alienating others.",
        estimatedMinutes: 9,
        storyBriefing: "🎯 Mission Briefing: The most important mission isn't defending yourself — it's recruiting allies. Learn how to talk about misinformation in ways that bring people in, not push them away.",
        sections: [
          { type: "text", title: "The Art of the Conversation", content: "Telling someone they've been fooled is one of the hardest conversations to have. Done wrong, it triggers defensiveness and entrenches the belief further. Done right, it plants seeds of critical thinking that grow over time." },
          { type: "bullets", title: "Effective Approaches", content: "", items: [
            "Lead with curiosity, not correction: 'That's interesting — where did you first see that?'",
            "Share your own experiences of being fooled — it normalizes the process",
            "Focus on the tactics, not the person: 'This looks like it might be using emotional manipulation'",
            "Offer to look into it together rather than lecturing",
            "If they're resistant, plant a seed and move on — don't force it",
          ]},
          {
            type: "scenario",
            title: "Field Diplomacy",
            content: "",
            scenarioData: {
              situation: "Your uncle shares a clearly false health claim at a family dinner. Other family members are nodding along. How do you handle this, agent?",
              choices: [
                { text: "Publicly fact-check him at the table and show everyone the debunking article", outcome: "Public correction at a social gathering often triggers defensiveness and can make the person double down on the false belief. It also creates social tension that associates media literacy with conflict.", isOptimal: false },
                { text: "Later, privately share a relevant article and say 'I found something interesting about that topic — thought you might want to see it'", outcome: "Perfect technique. Private, non-confrontational sharing preserves the relationship while planting seeds of accurate information. It respects their dignity while still addressing the misinformation.", isOptimal: true },
                { text: "Stay silent to keep the peace", outcome: "While avoiding conflict, complete silence means misinformation goes unchallenged. There are gentle ways to address it without creating a confrontation.", isOptimal: false },
              ],
            },
          },
          { type: "callout", content: "Research shows that empathetic, private corrections are 3x more effective at changing minds than public, aggressive fact-checking." },
          { type: "quiz", title: "Best Response?", content: "What's the most effective way to respond to a friend sharing misinformation on social media?", options: ["Comment 'FAKE NEWS' on their post", "Send a private message with a fact-check link and a friendly tone", "Report their post to get it removed", "Share a counter-article publicly to embarrass them"], correctIndex: 1 },
        ],
      },
      {
        id: "community-action",
        title: "Community Defense",
        description: "Scaling media literacy beyond yourself.",
        estimatedMinutes: 7,
        storyBriefing: "🎯 Mission Briefing: A single agent can't defend an entire city. Your final mission: build a network of informed citizens who can collectively resist the tide of misinformation.",
        sections: [
          { type: "text", title: "From Agent to Leader", content: "Everything you've learned in this training can be shared with others. The most resilient communities are ones where multiple people have media literacy skills — creating a collective immune system against misinformation." },
          { type: "bullets", title: "Community Defense Strategies", content: "", items: [
            "Organize informal media literacy discussions with friends or colleagues",
            "Share fact-checking resources in your group chats and social circles",
            "Support local journalism — it's the foundation of an informed community",
            "Mentor younger people in critical evaluation skills",
            "Advocate for media literacy education in schools",
          ]},
          {
            type: "true-false",
            title: "Community Defense Check",
            content: "",
            trueFalseItems: [
              { statement: "Media literacy should only be taught in schools.", isTrue: false, explanation: "While school education is important, media literacy is needed at all ages. Adults are often the most active sharers of misinformation online." },
              { statement: "Supporting local journalism helps fight misinformation.", isTrue: true, explanation: "Local journalists fact-check local claims, cover stories national outlets miss, and provide accountability that prevents misinformation from filling the void." },
              { statement: "One person can't make a difference in fighting misinformation.", isTrue: false, explanation: "Every person who pauses before sharing, fact-checks a claim, or gently corrects a friend creates a ripple effect that strengthens the entire information ecosystem." },
            ],
          },
          { type: "activity", title: "Your Community Plan", content: "Identify three people in your life who could benefit from learning these skills. How would you introduce the topic? What's one resource from this course you could share with them? Write down your plan and commit to one conversation this week." },
        ],
      },
      {
        id: "staying-current",
        title: "Staying Sharp",
        description: "The threat evolves. So must you.",
        estimatedMinutes: 6,
        storyBriefing: "🎯 Mission Briefing: Training is ongoing, agent. The threat landscape changes daily. Here are the resources that will keep your skills current.",
        sections: [
          { type: "text", title: "Ongoing Intelligence", content: "The disinformation landscape is constantly evolving. New tactics, new technologies, and new platforms emerge regularly. Staying current is not optional — it's part of your duty as a Cyber Defense Guardian." },
          { type: "bullets", title: "Resources for Ongoing Training", content: "", items: [
            "First Draft News (firstdraftnews.org) — Research and training on misinformation",
            "Media Literacy Now (medialiteracynow.org) — Policy and education advocacy",
            "The News Literacy Project (newslit.org) — Educational resources and tools",
            "Bellingcat (bellingcat.com) — Open-source investigation techniques",
            "EUvsDisinfo (euvsdisinfo.eu) — Tracking pro-Kremlin disinformation",
          ]},
          { type: "callout", content: "Bookmark these resources and check them monthly. The 30 minutes you invest staying current could prevent you from falling for next month's new tactic." },
        ],
      },
      {
        id: "action-plan",
        title: "Guardian Oath",
        description: "Your final commitment as a defender of truth.",
        estimatedMinutes: 10,
        storyBriefing: "🎯 Final Mission Briefing: This is it, agent. Your training is complete. Take the Guardian Oath and commit to defending the truth — not just for yourself, but for everyone in your network.",
        sections: [
          { type: "text", title: "The Guardian Oath", content: "You've completed your training with the Cyber Defense Corps. You've learned to identify threats, evaluate sources, recognize manipulation, understand your own biases, and navigate the digital battlefield. Now it's time to make it official." },
          { type: "key-term", term: "Guardian of Veritás", content: "a trained defender of truth who commits to verifying before sharing, thinking before reacting, and helping others develop critical media literacy skills" },
          {
            type: "fill-blank",
            title: "Take the Oath",
            content: "",
            fillBlankItems: [
              { textBefore: "I will", textAfter: "before I share.", correctAnswer: "verify", acceptableAnswers: ["verify", "check", "fact-check"], hint: "confirm it's true" },
              { textBefore: "I will", textAfter: "before I react.", correctAnswer: "think", acceptableAnswers: ["think", "pause", "stop"], hint: "use my mind" },
              { textBefore: "I will seek", textAfter: "perspectives, not just confirming ones.", correctAnswer: "diverse", acceptableAnswers: ["diverse", "different", "multiple", "opposing", "various"], hint: "varied" },
              { textBefore: "I will help others become", textAfter: "of truth.", correctAnswer: "guardians", acceptableAnswers: ["guardians", "defenders", "protectors"], hint: "defenders" },
            ],
          },
          { type: "callout", content: "🛡️ Congratulations, Guardian. The city of Veritás is safer because of you. But remember — the mission never truly ends. Stay sharp. Stay informed. Stay vigilant." },
          { type: "activity", title: "Your Action Plan", content: "Write down three specific commitments you're making today: 1) One daily habit you'll adopt 2) One person you'll have a media literacy conversation with this week 3) One fact-checking tool you'll bookmark and use regularly." },
        ],
      },
    ],
  },
];
