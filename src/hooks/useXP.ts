import { useState, useCallback } from "react";
import avatar1 from "@/assets/avatars/1.png";
import avatar2 from "@/assets/avatars/2.png";
import avatar3 from "@/assets/avatars/3.png";
import avatar4 from "@/assets/avatars/4.png";

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  requiredLevel: number;
}

export interface AvatarUpgrade {
  level: number;
  name: string;
  avatar: string;
  description: string;
}

export interface StoryUnlock {
  level: number;
  title: string;
  content: string;
  icon: string;
}

export interface XPState {
  totalXP: number;
  earnedBadges: string[];
  quizBonuses: { [key: string]: boolean };
  activityBonuses: { [key: string]: boolean };
}

const STORAGE_KEY = "ms-informed-xp";

const XP_PER_LESSON = 25;
const XP_PER_QUIZ_CORRECT = 15;
const XP_PER_ACTIVITY = 20;
const XP_PER_MODULE_COMPLETE = 50;


export const LEVELS = [
  { level: 1, title: "Recruit", xpRequired: 0, avatar: avatar1 },
  { level: 2, title: "Field Agent", xpRequired: 75, avatar: avatar2 },
  { level: 3, title: "Analyst", xpRequired: 200, avatar: avatar3 },
  { level: 4, title: "Senior Operative", xpRequired: 400, avatar: avatar4 },
  { level: 5, title: "Commander", xpRequired: 650, avatar: "⚔️" },
  { level: 6, title: "Guardian of Veritás", xpRequired: 1000, avatar: "🏛️" },
];

export const AVATAR_UPGRADES: AvatarUpgrade[] = [
  { level: 1, name: "Recruit Badge", avatar: avatar1, description: "Your journey begins. Welcome to the Corps." },
  { level: 2, name: "Agent Shades", avatar: avatar2, description: "You've earned your field agent disguise." },
  { level: 3, name: "Satellite Uplink", avatar: avatar3, description: "Access to advanced intelligence tools." },
  { level: 4, name: "Defense Shield", avatar: avatar4, description: "Your mental defenses are hardening." },
  { level: 5, name: "Commander's Sword", avatar: "⚔️", description: "Leading the fight against misinformation." },
  { level: 6, name: "Guardian Crown", avatar: "🏛️", description: "You are the Guardian of Veritás." },
];

export const STORY_UNLOCKS: StoryUnlock[] = [
  { level: 2, title: "Classified Dossier: The Origins", icon: "📁", content: "Veritás was founded in 2019 after the Great Disinfo Wave. A coalition of journalists, researchers, and technologists came together to build a city where truth is the highest value." },
  { level: 3, title: "Agent Profile: The Architect", icon: "🧠", content: "The Architect is the mysterious figure who designed Veritás's information defenses. No one knows their true identity, but their protocols have protected millions." },
  { level: 4, title: "Intel Report: The Shadow Network", icon: "🌐", content: "Intelligence suggests a coordinated network of troll farms, AI content generators, and amplification bots operating across 47 countries. Codename: ECHO." },
  { level: 5, title: "Secret File: Operation Looking Glass", icon: "🔮", content: "Operation Looking Glass is Veritás's counter-disinformation program. It uses the same tools as the enemy — AI, social networks, virality — but in service of truth." },
  { level: 6, title: "The Guardian's Archive", icon: "📜", content: "Welcome to the inner sanctum. As a Guardian, you now have access to the complete archive of every disinformation campaign ever detected and neutralized by the Corps." },
];

export const BADGES: Badge[] = [
  // { id: "first-clue", title: "First Contact", icon: "🔎", description: "Complete your first lesson", requiredLevel: 1 },
  // { id: "sharp-eye", title: "Sharp Eye", icon: "👁️", description: "Get 3 quizzes correct on first try", requiredLevel: 2 },
  // { id: "fact-checker", title: "Fact Checker", icon: "✅", description: "Reach Analyst rank", requiredLevel: 3 },
  // { id: "truth-seeker", title: "Truth Seeker", icon: "🔦", description: "Reach Senior Operative rank", requiredLevel: 4 },
  // { id: "media-guardian", title: "Cyber Sentinel", icon: "🛡️", description: "Reach Commander rank", requiredLevel: 5 },
  // { id: "master-decoder", title: "Guardian of Veritás", icon: "🏆", description: "Reach Guardian rank", requiredLevel: 6 },
];

function loadXP(): XPState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { totalXP: 0, earnedBadges: [], quizBonuses: {}, activityBonuses: {} };
  } catch {
    return { totalXP: 0, earnedBadges: [], quizBonuses: {}, activityBonuses: {} };
  }
}

function saveXP(state: XPState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getLevel(xp: number) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) current = level;
    else break;
  }
  const nextLevel = LEVELS.find((l) => l.xpRequired > xp);
  const xpToNext = nextLevel ? nextLevel.xpRequired - xp : 0;
  const xpInLevel = nextLevel ? xp - current.xpRequired : 0;
  const xpForLevel = nextLevel ? nextLevel.xpRequired - current.xpRequired : 1;
  return { ...current, nextLevel, xpToNext, progressPercent: nextLevel ? Math.round((xpInLevel / xpForLevel) * 100) : 100 };
}

export function useXP() {
  const [state, setState] = useState<XPState>(loadXP);

  const addXP = useCallback((amount: number): number => {
    let gained = amount;
    setState((prev) => {
      const next = { ...prev, totalXP: prev.totalXP + amount };
      const level = getLevel(next.totalXP);
      const newBadges = BADGES.filter(
        (b) => level.level >= b.requiredLevel && !prev.earnedBadges.includes(b.id)
      );
      if (newBadges.length > 0) {
        next.earnedBadges = [...prev.earnedBadges, ...newBadges.map((b) => b.id)];
      }
      saveXP(next);
      return next;
    });
    return gained;
  }, []);

  const awardLessonXP = useCallback(() => {
    return addXP(XP_PER_LESSON);
  }, [addXP]);

  const awardQuizXP = useCallback((quizKey: string) => {
    let gained = 0;
    setState((prev) => {
      if (prev.quizBonuses[quizKey]) return prev;
      gained = XP_PER_QUIZ_CORRECT;
      const next = {
        ...prev,
        totalXP: prev.totalXP + XP_PER_QUIZ_CORRECT,
        quizBonuses: { ...prev.quizBonuses, [quizKey]: true },
      };
      const level = getLevel(next.totalXP);
      const newBadges = BADGES.filter(
        (b) => level.level >= b.requiredLevel && !prev.earnedBadges.includes(b.id)
      );
      if (newBadges.length > 0) {
        next.earnedBadges = [...prev.earnedBadges, ...newBadges.map((b) => b.id)];
      }
      saveXP(next);
      return next;
    });
    return gained;
  }, []);

  const awardActivityXP = useCallback((activityKey: string) => {
    let gained = 0;
    setState((prev) => {
      if (prev.activityBonuses?.[activityKey]) return prev;
      gained = XP_PER_ACTIVITY;
      const next = {
        ...prev,
        totalXP: prev.totalXP + XP_PER_ACTIVITY,
        activityBonuses: { ...prev.activityBonuses, [activityKey]: true },
      };
      const level = getLevel(next.totalXP);
      const newBadges = BADGES.filter(
        (b) => level.level >= b.requiredLevel && !prev.earnedBadges.includes(b.id)
      );
      if (newBadges.length > 0) {
        next.earnedBadges = [...prev.earnedBadges, ...newBadges.map((b) => b.id)];
      }
      saveXP(next);
      return next;
    });
    return gained;
  }, []);

  const awardModuleCompleteXP = useCallback(() => {
    return addXP(XP_PER_MODULE_COMPLETE);
  }, [addXP]);

  const level = getLevel(state.totalXP);

  return {
    totalXP: state.totalXP,
    level,
    earnedBadges: state.earnedBadges,
    awardLessonXP,
    awardQuizXP,
    awardActivityXP,
    awardModuleCompleteXP,
    addXP,
  };
}
