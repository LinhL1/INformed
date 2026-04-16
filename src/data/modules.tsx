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
    description: "Your first task is deceptively simple, sort a pile of flagged posts into categories. Except nothing is labeled. And some of the false ones look more credible than the true ones. Not everything false is a lie. And not every lie is the same kind of lie.",
    color: "hsl(var(--module-1))",
    chapterTitle: "Chapter 1: Eye of the Analyst",
    storyIntro: "On your first day at INformed, you dive into the digital wilds, spotting patterns in what people share and realizing that mastering how information spreads is the only way to stay one step ahead of deception.",
    subtopics: [
      {
        id: "what-is-disinfo",
        title: "What is Misinformation?",
        description: "Defining misinformation, disinformation, and malinformation.",
        estimatedMinutes: 8,
        storyBriefing: "Your first task is deceptively simple, sort a pile of flagged posts into categories. Except nothing is labeled. And some of the false ones look more credible than the true ones. You begin to wonder if there is a disinction between the different types of false information? What defines misinformation? What is malinformation? Why should we care?",
        sections: [
          { type: "callout", content: "It's important to note that not all false information is the same. Understanding the distinctions is your first line of defense." },
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
        storyBriefing: "Our analysts have detected a new wave of sophisticated attacks. Your standard training isn't enough, you need to develop critical thinking, the mental firewall that protects against manipulation.",
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
        storyBriefing: "Alert! A post crosses your feed. It's about something that affects your community directly. You’re hit with a huge emotional wave of anger. Then you stop. And you ask: why did that hit so fast? Why did I stop thinking and start feeling?",
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
    description: "As you settle into your role at INformed, you begin to realize that information itself can’t always be trusted at face value.",
    color: "hsl(var(--module-2))",
    chapterTitle: "Chapter 2: Examining Sources",
    storyIntro: "Now you’ll practice identifying trustworthy sources, understanding the motives behind what you read, and using lateral reading techniques to verify claims across the digital landscape. By the end of this module, you’ll start thinking less like a consumer of information and more like an investigator. ",
    subtopics: [
      {
        id: "source-ev",
        title: "Source Evaluation and Fake Media Overview",
        description: "Dive into how fabricated content mimics real sources.",
        estimatedMinutes: 8,
        storyBriefing: "As an analyst, it's essential that you understand the importance of where you source and verify all of the news and information you encounter. Not all sources are created equal: some are deliberately misleading, some are biased, and others are simply incomplete. Developing a critical eye for source reliability is your first line of defense against misinformation.",
        sections: [
          { type: "text", title: "What is fake news?", content: "“Fake news” refers to information that is presented as legitimate news but is actually false, misleading, or lacks reliable evidence. Fake news can take many forms, including satire that is mistaken for real reporting, manipulated images or information, and entirely fabricated stories designed to deceive. It is often spread for reasons such as political influence, financial gain through clicks and advertising, propaganda, or entertainment. The rapid growth of social media, along with technologies like bots and artificial intelligence, has made it easier for fake news to spread quickly and widely, making it increasingly important for individuals to think critically and verify information before believing or sharing it." },
          { type: "bullets", title: "The Significance of Evaluating Where Your Information Comes From", content: "", items: [
            "The source behind a claim determines whether it's reliable, biased, or entirely fabricated",
            "Cross-referencing claims across multiple independent sources is one of the most reliable habits you can build",
            "Evaluating sources protects you from making decisions based on false or incomplete information, whether in your personal life, health choices, or civic participation",
            "In an era where anyone can publish anything online, source evaluation is no longer optional...it's a basic survival skill for navigating the information landscape",
          ]},
          { 
            type: "image", 
            src: "/assets/fake-news.jpg", 
            alt: "Critical thinking process diagram", 
            title: "",
            content: "" 
          },
          { type: "text", title: "Resources", content: (
              <>
                Learn more at{" "}
                <a href="https://guides.library.cornell.edu/evaluate_news/infographic" target="_blank" rel="noopener noreferrer">
                Misinformation, Disinformation, and Propaganda: Fake News Infographic
                </a>.
                <br></br>
                <a href="https://guides.lib.umich.edu/fakenews" target="_blank" rel="noopener noreferrer">
                "Fake News," Lies, and Misinformation
                </a>
              </>
        
            ), },
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
        id: "idenitfy-sources",
        title: "Identifying credible sources",
        description: "Understand how to spot quality sources and gain hands-on practice.",
        estimatedMinutes: 7,
        storyBriefing: "Not all sources are created equal, and as a new analyst, you quickly learn that trusting the wrong one can send you down a rabbit hole. Identifying credibility means looking beyond flashy headlines or viral traction, it’s about asking who’s behind the information, why it’s being shared, and whether it holds up under scrutiny. In a digital landscape designed to reward clicks over accuracy, your judgment becomes your most powerful tool.",
        sections: [
          { type: "text", title: "Identifying Reliable Sources", content: "Identifying credible sources is an essential part of research because not all information available online or in print is accurate, reliable, or useful. A credible source is one that is based on evidence, written by a knowledgeable author, and published by a trustworthy organization. While this is common in research, consumers should also me mindful when consuming media and news." },
          { type: "bullets", title: "Methods and Techniques", content: "", items: [
            "Check the author’s credibility",
            "Evaluate the publication/source",
            "Examine the purpose and bias",
            "Look for evidence and citations",
            "Cross-check with other sources",
            "Review domain and URL",
            "Verify accuracy of details"
          ]},
          { 
            type: "video", 
            title: "Wonder How You Can Tell if a Source is Credible?", 
            src: "https://www.youtube.com/embed/8AgCPuUh78s", 
            content: "A video explains how you can tell if a source is credible by evaluating a range of factors." 
          },
           { type: "text", title: "Resources", content: (
              <>
                Learn more at{" "}
                <a href="https://www.purdueglobal.edu/blog/online-learning/credible-academic-sources" target="_blank" rel="noopener noreferrer">
                How to Know if a Source Is Credible
                </a>
              </>
        
            ), },
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
        id: "lateral-reading",
        title: " Lateral Rading Techniques",
        description: "Understand what lateral reading is and how you can apply it in your life.",
        estimatedMinutes: 8,
        storyBriefing: "Sometimes, checking a source isn’t enough…you have to read sideways. Lateral reading teaches you to step outside a single page, explore multiple perspectives, and verify claims across the web. For someone just starting at INformed, it feels like detective work: tracing breadcrumbs, connecting accounts, spotting inconsistencies. Mastering this skill means you can see the bigger picture, even when misinformation tries to hide in plain sight.",
        
        sections: [
          { type: "text", title: "What is Lateral Reading?", content: "Lateral reading is a research strategy used by expert fact-checkers that involves leaving a website and opening new tabs to investigate what other reliable sources say about it, rather than relying only on the site itself. Instead of trusting a source at face value, you check who created it, what their intentions might be, and whether other credible organizations confirm the information. This method is important because it helps you quickly identify bias, misinformation, or lack of credibility by comparing multiple sources, making it a more effective and reliable way to evaluate information online." },
          { 
            type: "image", 
            src: "/assets/lat-reading.png", 
            alt: "Lateral reading diagram", 
            title: "",
            content: "" 
          },
          { type: "bullets", title: "Steps:", content: "", items: [
            "When examining a source, open a new browser tab to check through these factors to ensure your information is trustworthy. ",
            "Find out who runs the site: Determine the ownership and organization/background, Visit the “About” page or use domain lookup tools.",
            "Identify potential bias: Check for viewpoints, affiliations, and funding sources.",
            "Evaluate claims and evidence:",
            "Ask critical questions: Consider who is behind the information, what their intentions are, the type of content being created, and whether the evidence is credible.",
          ]},
          { type: "text", title: "Resources", content: (
              <>
                Diagram from at{" "}
                <a href="https://guides.library.charlotte.edu/c.php?g=1499262&p=11329376" target="_blank" rel="noopener noreferrer">
                Understanding and Evaluating Sources
                </a>
                <br></br>
                <a href="https://libguides.princeton.edu/medialiteracy/lateralreading" target="_blank" rel="noopener noreferrer">
                What is Lateral Reading
                </a>
              </>
        
            ), },

          {
            type: "fill-blank",
            title: "Decode the Intel",
            content: "",
            fillBlankItems: [
              { textBefore: "When evaluating a source by checking other sites instead of trusting it directly, this is called", textAfter: ".", correctAnswer: "lateral reading", acceptableAnswers: ["lateral reading"], hint: "" },
              { textBefore: "Opening a new tab to research a website or claim and comparing it with", textAfter: ".", correctAnswer: "trusted sources", acceptableAnswers: ["trusted sources", "reliable source", "credible source", "verified source"], hint: "" },
              { textBefore: "Investigating a website’s “About” page or using a domain lookup tool helps determine the", textAfter: "of the source.", correctAnswer: "ownership", acceptableAnswers: ["ownership", "credibility"], hint: "" },
            ],
          },
          { type: "quiz", title: "Context Check", content: "Why is it important to open new tabs instead of staying on the original site?", options: ["To increase page views", "To see if other sources confirm or dispute the information", "To read the site faster", "It enables you to bypass embedded advertisements"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: "visual-deception",
    number: 3,
    title: "Visual Deception",
    description: "After getting familiar with the fundamentals of misinformation, source evaluation, and its significance in today’s world, you begin to look into visual deception and the role it can play in misinformation.",
    color: "hsl(var(--module-3))",
    chapterTitle: "Chapter 3: The Visual Front",
    storyIntro: "Images and videos can be more convincing than words. They grab attention, trigger emotions, and shape beliefs almost instantly. But in a world of manipulated visuals, deepfakes, and misleading graphics, your eyes can’t always be trusted. As a junior analyst at INformed, your job is to learn not just to see, but to question what you see, and recognize when perception has been engineered.",
    subtopics: [
      {
        id: "deepfakes",
        title: "Manipulated Images and Deepfakes",
        description: "Your field manual for rapid source evaluation.",
        estimatedMinutes: 10,
        storyBriefing: "A single image can tell a thousand lies. From subtly edited photos to AI-generated deepfakes, these manipulations can appear surprisingly real. As people are increasingly getting their news from social media, as an analyst you’re gonna learn ways to note the hallmarks of fakery, and accept that your instincts aren’t enough, what looks real can be fake. Recognizing these tricks early helps prevent misinformation from spreading unchecked.",
        
        sections: [
          { type: "text", title: "What are Deepfakes?", content: "Deepfakes are videos, audio, or images that have been manipulated or created using artificial intelligence (AI) tools. These generated forms of media are often created to replace, alter faces, or synthesize speech. As AI has become more accessible and technologically advanced, deepfakes can seem authentic to the human eye and ear and are becoming more challenging to distinguish." },
           { type: "bullets", title: "Where can we encounter them?", content: "", items: [
            "Manipulated media = images, videos, or audio that have been altered.",
            "Deepfakes = a specific type of manipulated media created using artificial intelligence (AI).",
          ]},
          { type: "bullets", title: "Where can we encounter them?", content: "", items: [
            "Social Media Platforms: Instagram, YouTube, TicTok, X (Twitter)",
            "Online News & Blog Posts: Online forums, shared articles",
            "Professional Platforms: LinkedIn, emails, communication channels",
            "...essentially anywhere digital media can exist",
          ]},
          { 
            type: "video", 
            title: "Overview of Deepfakes", 
            src: "https://www.youtube.com/embed/o5k6UdOQBoU", 
            content: "A TED-Ed that explains on how false news spreads and why it's so hard to stop." 
          },
          
          { type: "text", title: "Real World Cases:", content: "Deepfakes include a range of videos, audio, or images, check out some examples collected from surfing the media." },
          { type: "text", title: "NPR: AI images and internet rumors spread confusion about ICE agent involved in shooting", content: (
              <>
                <a href="https://www.npr.org/transcripts/nx-s1-5671740" target="_blank" rel="noopener noreferrer">
                Read about it here
                </a>
                <br></br>
              </>
        
            ), },
          // VISUAL EXAMPLE of real world deepfakes: ICE, Politics/trump, etc      
          { type: "text", title: "Deepfake image example", content: "" },
    
          { 
            type: "image", 
            src: "/assets/df.png", 
            alt: "Original photo compared to a deepfake", 
            title: "",
            content: "A side by side comparision of how its increasingly more challenging to distinguish between real photos and deepfakes." 
          },
          { 
            type: "video", 
            title: "An AI Deepfake video example", 
            src: "https://www.youtube.com/embed/oxXpB9pSETo", 
            content: "A short video clip from 2022 depicting AI deepfake video capabilities. It's important to note that modern tools have further advanced deepfakes." 
          },

            { type: "text", title: "References and Additional Resources", content: (
              <>
                Deepfake image example from at{" "}
                <a href="https://www.frontiersin.org/journals/sociology/articles/10.3389/fsoc.2022.907199/full" target="_blank" rel="noopener noreferrer">
                Using deepfakes for experiments in the social sciences - A pilot study
                </a>
                <br></br>
                <a href="https://www.gao.gov/products/gao-24-107292" target="_blank" rel="noopener noreferrer">
                Science & Tech Spotlight: Combating Deepfakes | U.S. GAO                 
                </a>
                <br></br>
                <a href=" https://mass.pbslearningmedia.org/resource/nvair-sci-deepfake/manipulating-reality-deepfake-videos-and-generated-images-nova/" target="_blank" rel="noopener noreferrer">
                Manipulating Reality: Deepfake Videos and Generated Images | NOVA                </a>
              </>
        
            ), },

          {
            type: "true-false",
            title: "Intel Verification Drill",
            content: "",
            trueFalseItems: [
              { statement: "Deepfakes can be used in professional or workplace scams.", isTrue: true, explanation: "As highlighted in LinkedIn and workplace security discussions, deepfakes can impersonate executives in video calls or voice messages to commit fraud." },
              { statement: "If a story appears on multiple social media accounts, it must be true.", isTrue: false, explanation: "Coordinated sharing campaigns can make fabricated stories appear widespread. Always check for independent original reporting." },
              { statement: "If a video or image triggers a strong emotional reaction, you should pause before trusting it.", isTrue: true, explanation: "Deepfakes and manipulated media are often designed to provoke strong emotions (anger, fear, shock) to encourage rapid sharing. Being mindful and slowing down is one of the best defenses." },
              { statement: "A realistic-looking video of a public figure is strong evidence that the event actually happened.", isTrue: false, explanation: "Deepfakes can create highly realistic videos of people saying or doing things they never did. According to U.S. GAO research, AI-generated media can convincingly mimic real individuals, making visual evidence alone unreliable." },
            ],
          },

          {
            type: "scenario",
            title: "Apply your knowledge in action",
            content: "",
            scenarioData: {
              situation: "You’re scrolling on Instagram and see a reel going viral. The footage shows a well-known politician speaking at a podium, clearly saying something controversial. At first glance the video looks normal but the statements are absurd, what do you do?",
              choices: [
                { text: "Like and share it since it looks real and other people believe it", outcome: "This is how deepfakes spread. The video looks convincing, but that’s exactly the point of AI-generated content. By not stopping to verify, you may be amplifying false or manipulated information to your network.", isOptimal: false },
                { text: "Pause, check who originally posted it, search if major news outlets are reporting it, and look for signs the video may be altered", outcome: "Wise choice. The video was later revealed to be AI generated. By being mindful and cautious it helped you avoid being misled and prevented spreading misinformation.", isOptimal: true },
                { text: "Comment “Is this real?” and wait for responses", outcome: "While questioning is good, you're relying on others to do your verification. In fast-moving situations, comments can spread confusion just as quickly as the original post.", isOptimal: false },
              ],
            },
          },
        ],
      },
      {
        id: "out-of-context",
        title: "Out-of-context Videos and Content",
        description: "Real facts and information, but misleading context",
        estimatedMinutes: 8,
        storyBriefing: "Sometimes the content itself isn’t fake, it’s the story around it. A video clipped, a quote truncated, a post repurposed, suddenly, context is missing, and meaning is twisted. You discover that misinformation doesn’t always need fabrication; it often rides on selective framing. Spotting when content is out of context is like reading between the lines of a conversation you weren’t meant to see.",
        sections: [
          { type: "text", title: "What is “Out-of-Context” Content?", content: "Out-of-context media is real information, data, images, etc. that are oulled from their orginal context and shared with incorrect or misleading information to dostort understanding." },
          { type: "bullets", title: "Common tactics:", content: "", items: [
            "Snippets of a video, not showing the entire footage",
            "False, misleading captions",
            "Cropped photos and images",
            "Using old/outdated footage",
          ]},
          { type: "text", title: "How this Differs from Deepfakes", content: "Deepfakes involve AI-generated or altered content that isn’t real, while out-of-context content uses real media but presents it in a misleading way. In short, deepfakes change reality, while out-of-context content changes how you interpret it." },

          // EXAMPLE of real world out-of-context footage: linkedin AND GRAPHS/STATS!!
         
          { type: "text", title: "Misleading Data and Graphs", content: "Even numbers and stats can lie too. Skewed axes, cherry-picked data points, and deceptive infographics can make anything look true. Understanding these visual traps helps you spot misinformation before it infects public perception." },
          { 
            type: "image", 
            src: "/assets/mis-data1.png", 
            alt: "Diagram of robberies in the U.S from 2014 to 2016", 
            title: "",
            content: "At first glace this graph looks like its showing a steady increase...However, pay attention to the scaling." 
          },
                    { 
            type: "image", 
            src: "/assets/mis-data2.png", 
            alt: "Diagram of robberies in the U.S from 2014 to 2016", 
            title: "",
            content: "By adjusting the scale, this is a much more accurate depiction of the same data, yet it tells a different story." 
          },

          { type: "text", title: "Resources", content: (
              <>
                Graphs from {" "}
                <a href="https://web.stevenson.edu/mbranson/m4tp/version1/fake-news-misleading-graphs.html" target="_blank" rel="noopener noreferrer">
                Understanding and Evaluating Sources
                </a>
                <br></br>
                <a href="https://www.pbs.org/newshour/science/out-of-context-photos-are-a-powerful-low-tech-form-of-misinformation" target="_blank" rel="noopener noreferrer">
                Out-of-context photos are a powerful low-tech form of misinformation
                </a>
              </>
        
            ), },


         {
          type: "sorting",
          title: "Choose the Right Move to Check Context",
          content: "",
          sortingCategories: [
            { name: "🔍 Trace the Original Source" },
            { name: "🧾 Check the Story Being Told" },
            { name: "📅 Verify Time & Place" },
          ],
          sortingItems: [
            { text: "Run a reverse image search to find earlier versions", correctCategory: 0 },
            { text: "Look for the full, uncropped version of the video", correctCategory: 0 },
            { text: "Search if trusted news outlets are reporting the same claim", correctCategory: 1 },
            { text: "Use fact-checking sites like Snopes or FactCheck.org", correctCategory: 1 },
            { text: "Check when the image or video first appeared online", correctCategory: 2 },
            { text: "Check archived pages to confirm the original date and context of the content", correctCategory: 2 },          ],
        },
        ],
      },
      
      {
        id: "rev-img",
        title: "Reverse Image Searching and Tools",
        description: "Using reverse image search and other tools to help find original sources and identify deepfakes.",
        estimatedMinutes: 7,
        storyBriefing: "Not every visual deception can be spotted by looking alone. Reverse image searching becomes your detective tool: tracing the origin of a photo, uncovering prior contexts, verifying authenticity. It’s like following a trail of breadcrumbs left in pixels. Explore this module to learn more.",
        sections: [
          { type: "text", title: "What is Resverse Image Search?", content: "A URL is like a digital address. Learning to read it properly can instantly reveal whether a website is legitimate or a clever impersonation." },
          { type: "bullets", title: "Common Tools for Reverse Image Search:", content: "", items: [
            "Google's build in reverse image search",
            "Tineye.com: reverse image search engine"
          ]},
          { type: "bullets", title: "Additional Tools for Deepfake Detection and Sites They Are Found on:", content: "", items: [
            "Misspelled domain names (gogle.com, faceb00k.com)",
            "Pay attention to unrealistic motions and actions in videos",
            "Extra subdomains (login.bank.suspicious-site.com)",
            "Unusual domain extensions",
            "Very long URLs with random characters",
            "HTTP instead of HTTPS on sites that should be secure",
          ]},

          { type: "text", title: "Resources", content: (
              <>
                <a href="https://www.clearvoice.com/resources/reverse-image-search-tools/" target="_blank" rel="noopener noreferrer">
                The Top 7 Reverse Image Search Tools and How to Use Them                </a>
              </>
        
            ), },

          {
            type: "sorting",
            title: "Real or Manipulated?",
            content: "",
            sortingCategories: [
              { name: "✅ Likely Authentic" },
              { name: "🚨 Likely Fake/Manipulated" },
            ],
            sortingItems: [
              { text: "Reverse image search shows photo matches original news agency upload from 3 years ago", correctCategory: 0 },
              { text: "Reverse image search finds same face appearing in profiles with 6 different names", correctCategory: 1 },
              { text: "TinEye finds zero results: image appears to be an original, unpublished photo", correctCategory: 0 },
              { text: "Profile photo returns results from a stock photo site when reverse searched", correctCategory: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "national-security",
    number: 4,
    title: "National Security",
    description: "With a better understanding of how facts, news, and visuals can be manipulated, you’ll now explore the role of information and narratives on a larger scale and investigate how they influence the way people think and act. From domestic movements to foreign influence plans, misinformation can be strategically crafted and shared. Propaganda and coordinated campaigns can be used to amplify conflicts, impact trust, and shape public opinion.",
    color: "hsl(var(--module-4))",
    chapterTitle: "Chapter 4: The Big Picture",
    storyIntro: "As an analyst, you begin to look into the impacts of misinformation and media on society. You’ll see how misleading narratives spread, uncover motives, and learn ways to be aware and better navigate news and media.",
    subtopics: [
      {
        id: "narratives-propaganda",
        title: "Narratives and Propaganda",
        description: "Understand how stories, framing, and persuasive techniques are used to shape perception and influence beliefs.",
        estimatedMinutes: 15,
        storyBriefing: "The way information is framed can influence how it’s understood, from which details are emphasized, and what’s left out entirely. The emotional appeals to selective storytelling, propaganda techniques are designed to guide perception without you realizing it.",
        sections: [
          { type: "text", title: "The Role Narratives Play in Shaping Perspectives", content: "Propaganda is more than the simple spread of misleading information and stories, it's about shaping public perception. At its core, propaganda uses selective information, emotional appeals, and repetition to influence how people think and feel about political issues, governments, or entire systems of belief. It operates across media platforms in all content forms. From comments, posts, to images, and videos, it's most effective when audiences are unaware of the influence and recognize the intent." },
          { type: "text", content: "Narratives play a central role in shaping public opinion because they organize information into emotionally compelling stories. Rather than asking audiences to analyze evidence objectively, narratives provide ready-made interpretations of reality. They answer implicit questions like: Who is right? Who is wrong? What kind of world do we live in? Because of this, narratives often have greater persuasive power than factual accuracy alone."},
          { type: "key-term", term: "Information Warfare", content: "Goes beyond isolated messaging and operates continuously across multiple platforms and channels. Is a sustained, strategic campaign using information to influence the beliefs, emotions, and behaviors of target audiences." },
          { type: "key-term", term: "Propaganda", content: "The deliberate dissemination of information designed and shared to deliberately shape and influence public opinion to support a specific political agenda." },

          { type: "text", title: "In the Real World", content: "For example, during the 2016 U.S. presidential election, Russian-linked groups used fake social media accounts and targeted ads to amplify political divisions and shape voter perceptions. Similarly, during the COVID-19 pandemic, competing narratives about the virus’s origins, vaccines, and government responses spread widely online, sometimes promoting public health, but often fueling confusion and distrust." },
          
          { type: "text", title: "References (Read more about it)", content: (
              <>
                
                <a href="https://www.bbc.com/news/technology-46590890" target="_blank" rel="noopener noreferrer">
                Russia 'meddled in all big social media' around US election                </a>
                <br></br>
                <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10655972/" target="_blank" rel="noopener noreferrer">
                Trend analysis of COVID-19 mis/disinformation narratives–A 3-year study
                </a>

          
              </>
        
            ), },

           { 
            type: "video", 
            title: "Propaganda Explained", 
            src: "https://www.youtube.com/embed/T8L8tGErQPs", 
            content: "A TED-Ed that explains on how false news spreads and why it's so hard to stop." 
          },

         { 
            "type": "bullets", 
            "title": "Key Takeaways", 
            "content": "", 
            "items": [
              "Propaganda is not just false information, it is the strategic use of messaging to shape perceptions and influence behavior",
              "Narratives are often more powerful than facts because they provide meaning and emotional context",
              "Modern information warfare is continuous and multi-platform, not limited to isolated campaigns",
              "Authoritarian states like China and Russia actively manipulate the information environment to advance their interests",
              "Disinformation can be used not only to persuade, but also to confuse and erode trust in truth itself",
              "Digital platforms and social media have transformed how information spreads, prioritizing engagement over accuracy",
              "Effective influence requires culturally relevant messaging tailored to specific audiences",
              "In today’s world, shaping the narrative can be as important as military or economic power"
            ]
          },

          { type: "text", title: "Resources", content: (
              <>
                <a href="https://alexanderhamiltonsociety.org/security-strategy/issue-five/winning-the-war-of-ideas-a-u-s-strategy-for-the-twenty-first-century-information-domain/" target="_blank" rel="noopener noreferrer">
                Winning the War of Ideas: A U.S. Strategy for the Twenty-First-Century Information Domain
                </a>
              </>
        
          ), },


          {
            "type": "scenario",
            "title": "Narratives in Action",
            "content": "",
            "scenarioData": {
              "situation": "You come across a well-produced short video discussing protests in another country. It includes real footage, interviews, and statistics, but frames the situation as either a fight for freedom or evidence of instability—depending on interpretation. The video is shared by an account with unclear affiliations. What do you do?",
              "choices": [
                { 
                  "text": "Accept the video’s framing since the footage and data appear real and credible", 
                  "outcome": "Even accurate facts can be selectively framed to support a specific narrative. Information warfare often relies on shaping interpretation, not just spreading falsehoods.", 
                  "isOptimal": false 
                },
                { 
                  "text": "Analyze how the information is framed, compare it with other sources, and consider what perspective might be missing", 
                  "outcome": "This reflects advanced critical thinking. Competing narratives often use the same facts but present them differently. Evaluating framing, omissions, and intent helps you better understand the full picture.", 
                  "isOptimal": true 
                },
                { 
                  "text": "Reject the video entirely because the source isn’t clearly trustworthy", 
                  "outcome": "While source credibility matters, dismissing information outright can cause you to overlook real events. Information environments are complex, and not all influence relies on false content.", 
                  "isOptimal": false 
                }
              ]
            }
          },
          {
            "type": "true-false",
            "title": "Narrative Awareness Drill",
            "content": "",
            "trueFalseItems": [
              { 
                "statement": "Propaganda is always false or misleading information.", 
                "isTrue": false, 
                "explanation": "Propaganda often uses true information, but selectively frames or presents it to shape perceptions and advance a specific narrative." 
              },
              { 
                "statement": "If multiple sources are reporting the same event, the narrative is likely unbiased.", 
                "isTrue": false, 
                "explanation": "Different actors can report the same facts but frame them in ways that support different narratives or agendas." 
              },
              { 
                "statement": "Information warfare can aim to create confusion and distrust rather than persuade people of a single viewpoint.", 
                "isTrue": true, 
                "explanation": "Some strategies—like flooding the information space with conflicting claims—are designed to erode trust in objective reality itself." 
              }
            ]
          },
          {
            "type": "quiz",
            "title": "Narrative Check",
            "content": "A government spreads multiple conflicting explanations about a major event, making it difficult for people to determine what is true. What strategy is being used?",
            "options": [
              "Firehose of falsehood",
              "Objective reporting",
              "Neutral information sharing",
              "Transparency campaign"
            ],
            "correctIndex": 0
          }],
      },
      {
        id: "influence-ops",
        title: "Influence Operations",
        description: "Explore how organized networks use coordinated tactics to spread narratives and manipulate public opinion at scale.",
        estimatedMinutes: 15,
        storyBriefing: "Some information campaigns are carefully coordinated efforts designed to influence public opinion on a large scale. Foreign actors and organized groups may use fake accounts, bots, and targeted messaging to amplify specific narratives and support the dissemination of certain beliefs.",
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
        id: "misinfo-demo",
        title: "Misinformation, Democracy, and Trust",
        description: "Learn how misinformation around elections can impact public confidence and influence democratic participation.",
        estimatedMinutes: 8,
        storyBriefing: "In a democracy, trust in the process is everything. Misinformation around elections and politics, whether about voting procedures, results, or security, can create confusion and discourage participation.",
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
