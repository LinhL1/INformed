import { useState, useCallback } from "react";

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  requiredLevel: number;
}

export interface XPState {
  totalXP: number;
  earnedBadges: string[];
  quizBonuses: { [key: string]: boolean }; // track per-quiz bonus
}

const STORAGE_KEY = "ms-informed-xp";

const XP_PER_LESSON = 25;
const XP_PER_QUIZ_CORRECT = 15;
const XP_PER_MODULE_COMPLETE = 50;

export const LEVELS = [
  { level: 1, title: "Rookie Analyst", xpRequired: 0, avatar: "🔍" },
  { level: 2, title: "Junior Detective", xpRequired: 75, avatar: "🕵️" },
  { level: 3, title: "Field Investigator", xpRequired: 200, avatar: "📋" },
  { level: 4, title: "Senior Agent", xpRequired: 400, avatar: "🛡️" },
  { level: 5, title: "Chief Intelligence Officer", xpRequired: 650, avatar: "⭐" },
  { level: 6, title: "Master Decoder", xpRequired: 1000, avatar: "🏆" },
];

export const BADGES: Badge[] = [
  { id: "first-clue", title: "First Clue", icon: "🔎", description: "Complete your first lesson", requiredLevel: 1 },
  { id: "sharp-eye", title: "Sharp Eye", icon: "👁️", description: "Get 3 quizzes correct on first try", requiredLevel: 2 },
  { id: "fact-checker", title: "Fact Checker", icon: "✅", description: "Reach Level 3", requiredLevel: 3 },
  { id: "truth-seeker", title: "Truth Seeker", icon: "🔦", description: "Reach Level 4", requiredLevel: 4 },
  { id: "media-guardian", title: "Media Guardian", icon: "🛡️", description: "Reach Level 5", requiredLevel: 5 },
  { id: "master-decoder", title: "Master Decoder", icon: "🏆", description: "Reach Level 6", requiredLevel: 6 },
];

function loadXP(): XPState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { totalXP: 0, earnedBadges: [], quizBonuses: {} };
  } catch {
    return { totalXP: 0, earnedBadges: [], quizBonuses: {} };
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
  const xpInLevel = nextLevel
    ? xp - current.xpRequired
    : 0;
  const xpForLevel = nextLevel
    ? nextLevel.xpRequired - current.xpRequired
    : 1;
  return { ...current, nextLevel, xpToNext, progressPercent: nextLevel ? Math.round((xpInLevel / xpForLevel) * 100) : 100 };
}

export function useXP() {
  const [state, setState] = useState<XPState>(loadXP);

  const addXP = useCallback((amount: number): number => {
    let gained = amount;
    setState((prev) => {
      const next = { ...prev, totalXP: prev.totalXP + amount };
      // Check for new level-based badges
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
    // Only award bonus once per quiz
    if (state.quizBonuses[quizKey]) return 0;
    setState((prev) => {
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
    return XP_PER_QUIZ_CORRECT;
  }, [state.quizBonuses]);

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
    awardModuleCompleteXP,
    addXP,
  };
}
