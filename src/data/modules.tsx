import { ReactNode } from "react";

export interface LessonSection {
  type: "text" | "callout" | "quiz" | "activity" | "image" | "bullets" | "key-term" | "video";
  title?: string;
  content: string | ReactNode;
  items?: string[];
  term?: string;
  src?: string;
  alt?: string;
  options?: string[];
  correctIndex?: number;
}

export interface Subtopic {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  sections: LessonSection[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  color: string;
  //icon: string;
  subtopics: Subtopic[];
}

export const modules: Module[] = [
  {
    id: "introduction",
    number: 1,
    title: "Introduction to Misinformation & Media Literacy",
    description: "Learn the fundamentals of misinformation, disinformation, malinformation, and why it matters.",
    color: "hsl(var(--module-1))",
    //icon: "",
    subtopics: [
      {
        id: "what-is-disinfo",
        title: "What is Misinformation?",
        description: "Defining misinformation, disinformation, and malinformation.",
        estimatedMinutes: 8,
        sections: [
          { type: "callout", content: "Not all false information is the same. It helps to understand the distinctions." },
          { type: "text", title: "Information", content: "Information is content that accurately represents facts or events as they are understood to be true." },
          { type: "text", title: "Misinformation", content: "is incorrect (or false information) but shared unintentionally. The person spreading it may genuinely believe it is true." },
          { type: "text", title: "Disinformation", content: "is false information spread deliberately, with the intent to deceive. When disinformation is coordinated by foreign actors to interfere with democratic processes like elections, it is called foreign information manipulation and interference." },
          { type: "text", title: "How Does Misinformation Spread?", content: "Misinformation spreads easily because it often feels credible. It can come from sources we trust, align with things we already believe, or trigger strong emotional reactions that make us less likely to stop and question it. Understanding this is key to catching it." },
          { type: "key-term", term: "Debunking", content: "showing that a piece of information is untrue and showing what is true" },
          { type: "bullets", title: "Key Takeaways", content: "", items: [
            "Misinformation is false or innaccurate but shared without harmful intent",
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
          { type: "quiz", title: "Check Your Understanding", content: "Which term describes intentionally false information spread to deceive?", options: ["Misinformation", "Disinformation", "Malinformation", "Propaganda"], correctIndex: 1 },
        ],
      },
      {
        id: "critical-thinking",
        title: "Importance of Critical Thinking: What It Is and How to Develop It",
        description: "How disinformation has evolved through the ages.",
        estimatedMinutes: 10,
        sections: [
          { type: "callout", content: "The point of modern propaganda isn't only to misinform or push an agenda. It is to exhaust your critical thinking, to annihilate truth. — Garry Kasparov" },
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
            alt: "Description of the image", 
            title: "",
            content: "" 
          },
          { type: "bullets", title: "Key Eements of Critical Thinking:", content: "", items: [
            "Identify the premises and conclusions by breaking the argument into clear logical parts",
            "Clarify the argument by finding ambiguity or unclear statements",
            "Check the facts and evidence to see if the argument is accurate and complete",
            "Evaluate the logic and reasoning (inductive or deductive) to determine if the conclusion is supported",
            "Making a final judgment by weighing the argument against the evidence",
          ]},

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
        description: "How emotions are weaponized to bypass critical thinking.",
        estimatedMinutes: 8,
        sections: [
          {
            type: "callout",
            content: "If a headline makes you feel a strong emotion before you've even read the article, that's intentional. Emotional reactions are a feature, not a bug, of manipulative content."
          },
          {
            type: "text",
            title: "What Is Emotional Manipulation in Media?",
            content: "Emotional manipulation occurs when content is designed to trigger a strong feeling (fear, outrage, pride, or sympathy) in order to bypass your rational thinking. When we're flooded with emotion, we're less likely to stop and ask: Is this true? Where did this come from? What's missing from this story?"
          },
          {
            type: "key-term",
            term: "Emotional Override",
            content: "when an emotional response is so strong that it short-circuits critical evaluation of information, making us more likely to accept and share content without verifying it"
          },
          {
            type: "bullets",
            title: "Common Emotional Manipulation Tactics",
            content: "",
            items: [
              "Fear-mongering: Exaggerating threats to make an issue feel urgent and dangerous, pushing you toward panic rather than careful analysis",
              "Outrage bait: Framing stories to provoke anger, which increases engagement and sharing even when the underlying facts are incomplete or misleading",
              "Sentimentality: Using emotional stories or images (children, animals, tragedy) to generate sympathy that overrides skepticism",
              "Us vs. Them framing: Portraying issues as a battle between groups to trigger tribal loyalty and distrust of the 'other side'",
              "False urgency: Creating a sense that you must act or share immediately, before you have time to think critically"
            ]
          },
          {
            type: "text",
            title: "Why It Works",
            content: "Our brains are wired to prioritize emotional information, it helped our ancestors survive real threats. Manipulators exploit this by packaging false or misleading content in emotionally charged language, images, and headlines. Studies show that content triggering anger or anxiety spreads significantly faster on social media than neutral, factual reporting."
          },
          {
            type: "bullets",
            title: "Warning Signs to Watch For",
            content: "",
            items: [
              "The headline uses extreme language like 'shocking', 'destroyed', 'terrifying', or 'you won't believe'",
              "You feel a strong urge to share before finishing the article",
              "The story confirms something you already strongly believe or fear",
              "There are no named sources, expert quotes, or links to original data",
              "The content is designed to make one group look entirely evil or entirely heroic"
            ]
          },
          {
            type: "activity",
            title: "Pause & Reflect",
            content: "The next time a news story triggers a strong emotional reaction, pause before sharing. Ask yourself: What emotion am I feeling right now? Is this emotion making me want to skip fact-checking? Can I find this story reported by at least two other independent sources? Taking 60 seconds to ask these questions can prevent you from spreading manipulative content."
          },
          {
            type: "quiz",
            title: "Spot the Tactic",
            content: "A news headline reads: 'TERRIFYING: They Are Coming for Your Children. Share Before This Gets Deleted.' Which emotional manipulation tactic is primarily being used?",
            options: [
              "Fear-mongering and false urgency",
              "Sentimentality",
              "Bandwagon effect",
              "Anchoring bias"
            ],
            correctIndex: 0
          }
        ]
      },
      {
        id: "info-consumer",
        title: "The Information Consumers (Your) Role",
        description: "Importance of being responsible and informed information consumer",
        estimatedMinutes: 9,
        sections: [
          {
            type: "callout",
            content: "Every piece of information you consume passed through a chain of decisions: who created it, who published it, what platform surfaced it, and why. Understanding that chain makes you a harder target to manipulate."
          },
          {
            type: "text",
            title: "Introduction",
            content: "Information doesn't appear in your feed by accident. It travels through an entire ecosystem — from the person or organization that created it, through publishers and platforms, to you. At every step, decisions are made about what gets amplified, what gets buried, and what gets distorted. As the final stop in that chain, you play a more powerful role than you might think."
          },
          {
            type: "key-term",
            term: "Information Ecosystem",
            content: "the interconnected network of people, platforms, institutions, and technologies that produce, distribute, and consume information, including news outlets, social media, search engines, and individual users"
          },
          {
            type: "text",
            title: "From Creation to Consumption",
            content: "Information begins with a source: a journalist, researcher, government agency, or random social media user. It then passes through editors, publishers, or platforms before reaching an audience. At each stage, the information can be filtered, reframed, stripped of context, or amplified based on what generates the most engagement rather than what is most accurate."
          },
          {
            type: "text",
            title: "Gatekeepers and Algorithms",
            content: "Traditionally, editors and journalists acted as gatekeepers, deciding what was newsworthy and verifying facts before publication. Today, algorithms play that role for most people. Platforms like Facebook, YouTube, and TikTok use engagement signals (clicks, shares, watch time) to decide what you see. The problem is that emotionally charged, sensational, or outrage-inducing content tends to perform best, meaning the algorithm can reward misinformation just as readily as accurate reporting."
          },
          {
            type: "bullets",
            title: "What Responsible Information Consumers Do",
            content: "",
            items: [
              "Seek out original sources rather than relying on headlines or secondhand summaries",
              "Diversify their information diet by reading across multiple outlets and perspectives",
              "Pause before sharing, ask whether they've verified the claim and considered the source",
              "Recognize when an algorithm is serving content based on engagement rather than accuracy",
              "Actively search for information that challenges their existing beliefs, not just confirms them"
            ]
          },
          {
            type: "text",
            title: "Your Role in the Ecosystem",
            content: "When you share, like, or even just spend time reading a piece of content, you send a signal to the algorithm that this content is worth spreading. That means every individual decision you make as a consumer either amplifies good information or bad information. Being a responsible consumer isn't passive, it's an active, ongoing choice that has real consequences for the people around you."
          },
          {
            type: "callout",
            content: "A 2018 MIT study found that false news spreads six times faster than true news on social media, largely because it tends to be more novel and emotionally provocative. Algorithms don't fact-check; they follow engagement."
          },
          {
            type: "bullets",
            title: "Red Flags That Should Slow You Down",
            content: "",
            items: [
              "The story is only being reported by one outlet with no corroboration",
              "The content makes you feel an immediate, strong emotional reaction",
              "You were served the content by a recommendation algorithm rather than seeking it out",
              "The headline is designed to provoke rather than inform",
              "There are no named authors, dates, or links to primary sources"
            ]
          },
          {
            type: "quiz",
            title: "Check Your Understanding",
            content: "A friend shares an article that perfectly confirms something you already believe. What is the most responsible first step?",
            options: [
              "Share it immediately since it aligns with what you know to be true",
              "Like it to help spread accurate information",
              "Verify the claim with at least one additional independent source before sharing",
              "Ignore it since your friend already did the research"
            ],
            correctIndex: 2
          }
        ]
      },
    ],
  },
  {
    id: "source-eval",
    number: 2,
    title: "Source Evaluation",
    description: "Learn to identify credible sources and recognize fake or biased information.",
    color: "hsl(var(--module-2))",
    //icon: "",
    subtopics: [
      {
        id: "emotional-manipulation",
        title: "Emotional Manipulation",
        description: "How emotions are weaponized to bypass critical thinking.",
        estimatedMinutes: 8,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain how fear, outrage, and sentimentality are used to manipulate." },
          { type: "callout", content: "🧠 Template: Add insight about emotional vs. rational processing." },
          { type: "quiz", title: "Spot the Tactic", content: "Template: Present an example and ask users to identify the emotional manipulation.", options: ["Fear", "Outrage", "Sentimentality", "Humor"], correctIndex: 0 },
        ],
      },
      {
        id: "fabricated-content",
        title: "Fabricated Content",
        description: "Recognizing completely made-up stories and sources.",
        estimatedMinutes: 7,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain fabricated content and how to spot it." },
          { type: "activity", title: "Real or Fake?", content: "Template: Create an interactive exercise comparing real and fabricated headlines." },
        ],
      },
      {
        id: "misleading-context",
        title: "Misleading Context",
        description: "When real content is shared with false context.",
        estimatedMinutes: 8,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain how genuine images, quotes, or data are recontextualized." },
          { type: "callout", content: "📸 Template: Add example of an out-of-context image that went viral." },
          { type: "quiz", title: "Context Check", content: "Template: Quiz about identifying misleading context.", options: ["Option A", "Option B", "Option C", "Option D"], correctIndex: 2 },
        ],
      },
      {
        id: "impersonation",
        title: "Impersonation & Fake Accounts",
        description: "How bad actors create fake personas to spread narratives.",
        estimatedMinutes: 9,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain impersonation tactics including sock puppets and bot networks." },
          { type: "text", title: "Red Flags", content: "Template: List indicators of fake accounts." },
          { type: "activity", title: "Profile Analysis", content: "Template: Interactive exercise to analyze suspicious social media profiles." },
        ],
      },
      {
        id: "amplification",
        title: "Amplification Strategies",
        description: "How disinformation goes viral through coordinated efforts.",
        estimatedMinutes: 8,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain astroturfing, bot networks, and coordinated inauthentic behavior." },
          { type: "callout", content: "📊 Template: Add data about how quickly false information spreads vs. truth." },
        ],
      },
    ],
  },
  {
    id: "visual-deception",
    number: 3,
    title: "Visual Deception",
    description: "Detect manipulated visuals and misleading media content.",
    color: "hsl(var(--module-3))",
    //icon: "",
    subtopics: [
      {
        id: "source-evaluation",
        title: "Source Evaluation",
        description: "How to assess the credibility of a source.",
        estimatedMinutes: 10,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Introduce the SIFT method and lateral reading." },
          { type: "text", title: "The SIFT Method", content: "Template: Detail Stop, Investigate, Find, Trace methodology." },
          { type: "quiz", title: "Practice SIFT", content: "Template: Apply SIFT to a sample article.", options: ["Credible", "Questionable", "Unreliable", "Satire"], correctIndex: 1 },
        ],
      },
      {
        id: "fact-checking",
        title: "Fact-Checking Techniques",
        description: "Tools and methods for verifying claims.",
        estimatedMinutes: 8,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Overview of fact-checking tools and techniques." },
          { type: "activity", title: "Fact-Check Challenge", content: "Template: Give users claims to fact-check using provided tools." },
        ],
      },
      {
        id: "reverse-image",
        title: "Reverse Image Search",
        description: "Verifying images and visual content.",
        estimatedMinutes: 6,
        sections: [
          { type: "text", title: "Introduction", content: "Template: How to use reverse image search tools." },
          { type: "activity", title: "Image Verification", content: "Template: Practice exercise with sample images to verify." },
        ],
      },
      {
        id: "url-analysis",
        title: "URL & Domain Analysis",
        description: "Reading URLs to spot suspicious websites.",
        estimatedMinutes: 7,
        sections: [
          { type: "text", title: "Introduction", content: "Template: How to analyze URLs for red flags." },
          { type: "quiz", title: "Spot the Fake URL", content: "Template: Which URL is suspicious?", options: ["example.com", "examp1e.com", "example.org", "example.net"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: "national-security",
    number: 4,
    title: "National Security",
    description: "Understand how misinformation impacts society, politics, and security.",
    color: "hsl(var(--module-4))",
    //icon: "",
    subtopics: [
      {
        id: "confirmation-bias",
        title: "Confirmation Bias",
        description: "Why we seek information that confirms what we already believe.",
        estimatedMinutes: 8,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain confirmation bias and its role in disinformation susceptibility." },
          { type: "callout", content: "🪞 Template: Add self-reflection prompt about personal biases." },
          { type: "quiz", title: "Bias Check", content: "Template: Scenario-based quiz about confirmation bias.", options: ["Option A", "Option B", "Option C", "Option D"], correctIndex: 0 },
        ],
      },
      {
        id: "bandwagon-effect",
        title: "The Bandwagon Effect",
        description: "How social proof influences our beliefs.",
        estimatedMinutes: 7,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain how perceived popularity affects belief." },
          { type: "activity", title: "Social Proof Exercise", content: "Template: Interactive demonstration of the bandwagon effect." },
        ],
      },
      {
        id: "anchoring",
        title: "Anchoring & Framing",
        description: "How the first information we see shapes our judgment.",
        estimatedMinutes: 8,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain anchoring bias and framing effects." },
          { type: "text", title: "Framing in Media", content: "Template: Show how the same story can be framed differently." },
        ],
      },
      {
        id: "dunning-kruger",
        title: "The Dunning-Kruger Effect",
        description: "When overconfidence makes us more vulnerable.",
        estimatedMinutes: 7,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain the Dunning-Kruger effect in the context of media literacy." },
          { type: "callout", content: "⚡ Template: Add research finding about overconfidence and susceptibility." },
        ],
      },
    ],
  },
  {
    id: "social-media",
    number: 5,
    title: "Social Media",
    description: "Use social media wisely, spot manipulation, and protect your attention.",
    color: "hsl(var(--module-5))",
    //icon: "",
    subtopics: [
      {
        id: "what-are-deepfakes",
        title: "What Are Deepfakes?",
        description: "Understanding AI-generated synthetic media.",
        estimatedMinutes: 9,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Define deepfakes and explain the technology behind them." },
          { type: "callout", content: "🎬 Template: Add example of a notable deepfake incident." },
          { type: "quiz", title: "Deepfake Detection", content: "Template: Can you spot the deepfake?", options: ["Video A", "Video B", "Both", "Neither"], correctIndex: 0 },
        ],
      },
      {
        id: "ai-generated-text",
        title: "AI-Generated Text",
        description: "Recognizing machine-written content.",
        estimatedMinutes: 8,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain how AI generates convincing text and how to spot it." },
          { type: "activity", title: "Human or AI?", content: "Template: Exercise comparing human and AI-written articles." },
        ],
      },
      {
        id: "synthetic-media",
        title: "Synthetic Audio & Images",
        description: "The growing threat of AI-generated audio and images.",
        estimatedMinutes: 8,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Overview of AI-generated audio cloning and image synthesis." },
          { type: "text", title: "Detection Methods", content: "Template: Current tools and techniques for detecting synthetic media." },
        ],
      },
      {
        id: "future-threats",
        title: "Future Threat Landscape",
        description: "What's coming next in AI-powered disinformation.",
        estimatedMinutes: 7,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Emerging trends and future challenges in AI-driven disinformation." },
          { type: "callout", content: "🔮 Template: Add predictions from cybersecurity experts." },
        ],
      },
    ],
  },
  {
    id: "building-resilience",
    number: 6,
    title: "Building Resilience: Fact Check Strats/Resources",
    description: "Equip yourself with tools and strategies to verify and debunk information.",
    color: "hsl(var(--module-6))",
    //icon: "",
    subtopics: [
      {
        id: "personal-habits",
        title: "Personal Media Habits",
        description: "Building a healthier relationship with information.",
        estimatedMinutes: 8,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Practical daily habits for better information consumption." },
          { type: "activity", title: "Media Diet Audit", content: "Template: Interactive exercise to audit your current media consumption." },
        ],
      },
      {
        id: "conversation-skills",
        title: "Conversation Skills",
        description: "How to discuss misinformation without alienating others.",
        estimatedMinutes: 9,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Techniques for productive conversations about false information." },
          { type: "callout", content: "💬 Template: Add tips for approaching someone who shared misinformation." },
          { type: "quiz", title: "Best Response?", content: "Template: What's the best way to respond to a friend sharing misinformation?", options: ["Publicly correct them", "Send a private message", "Ignore it", "Share a counter-article"], correctIndex: 1 },
        ],
      },
      {
        id: "community-action",
        title: "Community Action",
        description: "Scaling media literacy beyond the individual.",
        estimatedMinutes: 7,
        sections: [
          { type: "text", title: "Introduction", content: "Template: How to promote media literacy in your community." },
          { type: "text", title: "Starting a Workshop", content: "Template: Guide to organizing a media literacy workshop." },
        ],
      },
      {
        id: "staying-current",
        title: "Staying Current",
        description: "Keeping up with evolving disinformation tactics.",
        estimatedMinutes: 6,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Resources and strategies for ongoing education." },
          { type: "callout", content: "📚 Template: Curated list of trusted media literacy resources." },
        ],
      },
      {
        id: "action-plan",
        title: "Your Action Plan",
        description: "Create a personalized plan to stay informed and resilient.",
        estimatedMinutes: 10,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Guide users through creating their personal media literacy action plan." },
          { type: "activity", title: "Build Your Plan", content: "Template: Interactive action plan builder." },
        ],
      },
    ],
  },
];
