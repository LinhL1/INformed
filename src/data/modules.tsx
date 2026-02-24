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
          { type: "key-term", term: "Malinformation", content: "True information shared with the intent to cause harm, such as leaking private data to damage someone's reputation." },
          { type: "bullets", title: "Key Takeaways", content: "", items: [
            "Misinformation is false but shared without harmful intent",
            "Disinformation is deliberately crafted to deceive",
            "Malinformation is true but weaponized to cause harm",
            "Context and intent are what distinguish these categories",
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
          { type: "quiz", title: "Check Your Understanding", content: "Which term describes intentionally false information spread to deceive?", options: ["Misinformation", "Disinformation", "Malinformation", "Propaganda"], correctIndex: 1 },
        ],
      },
      {
        id: "history-of-disinfo",
        title: "Importance of critical thinking: what is it and how to develop it",
        description: "How disinformation has evolved through the ages.",
        estimatedMinutes: 10,
        sections: [
          { type: "text", title: "Introduction", content: "Disinformation is not new. From ancient war propaganda to modern social media campaigns, the tools change but the tactics remain remarkably similar." },
          { type: "text", title: "From Print to Digital", content: "Template: Add historical examples of disinformation campaigns across different eras and media." },
          { type: "callout", content: "The term 'dezinformatsiya' was coined by the Soviet Union in the 1920s." },
          { type: "quiz", title: "Quick Check", content: "Template: Add a quiz question about historical disinformation.", options: ["Option A", "Option B", "Option C", "Option D"], correctIndex: 0 },
        ],
      },
      {
        id: "why-it-matters",
        title: "Why It Matters",
        description: "The real-world impact of disinformation on society.",
        estimatedMinutes: 7,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Explain the societal, political, and personal impacts of disinformation." },
          { type: "callout", content: "⚠️ Template: Add a striking statistic about disinformation's impact." },
          { type: "text", title: "National Security Implications", content: "Template: Discuss how disinformation threatens democratic institutions and national security." },
        ],
      },
      {
        id: "info-ecosystem",
        title: "Bias and Perspective",
        description: "How information flows and where it breaks down.",
        estimatedMinutes: 9,
        sections: [
          { type: "text", title: "Introduction", content: "Template: Map out the modern information ecosystem — from creation to consumption." },
          { type: "text", title: "Gatekeepers and Algorithms", content: "Template: Explain the role of algorithms and platform design in information spread." },
          { type: "activity", title: "Reflection Activity", content: "Template: Describe an interactive activity where users map their own information sources." },
        ],
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
