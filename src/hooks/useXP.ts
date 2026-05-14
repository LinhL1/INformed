import { useState, useCallback } from "react";
import avatar1 from "@/assets/avatars/1.png";
import avatar2 from "@/assets/avatars/2.png";
import avatar3 from "@/assets/avatars/3.png";
import avatar4 from "@/assets/avatars/4.png";
import avatar5 from "@/assets/avatars/5.png";
import avatar6 from "@/assets/avatars/6.png";

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
  { level: 2, title: "Field Agent", xpRequired: 100, avatar: avatar2 },
  { level: 3, title: "Analyst", xpRequired: 265, avatar: avatar3 },
  { level: 4, title: "Senior Operative", xpRequired: 530, avatar: avatar4 },
  // { level: 5, title: "Commander", xpRequired: 860, avatar: avatar5 },
  // { level: 6, title: "Guardian of Veritás", xpRequired: 1320, avatar: avatar6 },
];

export const AVATAR_UPGRADES: AvatarUpgrade[] = [
  { 
    level: 1, 
    name: "Junior Analyst Badge", 
    avatar: avatar1, 
    description: "Fresh out of university, you’ve been flagged for your potential. Your first assignment begins." 
  },
  { 
    level: 2, 
    name: "Signal Tracker", 
    avatar: avatar2, 
    description: "You start noticing subtle patterns across platforms—small signals most would ignore." 
  },
  { 
    level: 3, 
    name: "Pattern Mapper", 
    avatar: avatar3, 
    description: "Connections emerge. What once looked random now reveals coordinated behavior." 
  },
  { 
    level: 4, 
    name: "Narrative Analyst", 
    avatar: avatar4, 
    description: "You begin to understand how stories are shaped, amplified, and weaponized." 
  },
  // { 
  //   level: 5, 
  //   name: "Cognitive Defender", 
  //   avatar: avatar5, 
  //   description: "You recognize the real target isn’t systems—it’s people. You work to protect how they think." 
  // },
  // { 
  //   level: 6, 
  //   name: "INformed Operative", 
  //   avatar: avatar6, 
  //   description: "You see the bigger picture. Not just content, but influence. Not just posts, but impact." 
  // },
];

export const STORY_UNLOCKS: StoryUnlock[] = [
  { 
    level: 2, 
    title: "Internal Memo: Why You Were Flagged", 
    icon: "📁", 
    content: "You weren’t recruited by accident. A professor flagged your work—pattern recognition, skepticism, curiosity. Traits that are becoming harder to find, and more valuable." 
  },
  { 
    level: 3, 
    title: "Briefing Note: Early Signals", 
    icon: "🧠", 
    content: "Individually, the posts seem harmless. A headline here, a comment there. But across platforms, the same narratives begin to repeat—slightly altered, optimized for engagement." 
  },
  { 
    level: 4, 
    title: "Intel Summary: Coordinated Behavior", 
    icon: "🌐", 
    content: "Analysis suggests these patterns are not organic. Networks of accounts—some human, some automated—are amplifying the same ideas across multiple communities." 
  },
  // { 
  //   level: 5, 
  //   title: "Restricted File: Narrative Engineering", 
  //   icon: "🔍", 
  //   content: "The objective isn’t to convince—it’s to overwhelm. Repetition builds familiarity. Familiarity builds belief. Over time, trust erodes—not in one source, but in everything." 
  // },
  // { 
  //   level: 6, 
  //   title: "Final Briefing: The Real Target", 
  //   icon: "📜", 
  //   content: "These operations don’t target systems or servers. They target perception. What people believe, what they doubt, and how they decide what’s true. That’s where the real impact is." 
  // },
];

export const BADGES: Badge[] = [
  { 
    id: "first-pattern", 
    title: "First Pattern", 
    icon: "🔎", 
    description: "Complete your first lesson and identify a misleading signal", 
    requiredLevel: 1 
  },
  { 
    id: "signal-spotter", 
    title: "Signal Spotter", 
    icon: "👁️", 
    description: "Correctly identify 3 misleading cues on the first attempt", 
    requiredLevel: 2 
  },
  { 
    id: "context-builder", 
    title: "Context Builder", 
    icon: "🧩", 
    description: "Recognize how information changes meaning across contexts", 
    requiredLevel: 3 
  },
  { 
    id: "narrative-breaker", 
    title: "Narrative Breaker", 
    icon: "🔦", 
    description: "Identify repeated narratives across multiple scenarios", 
    requiredLevel: 4 
  },
  // { 
  //   id: "cognitive-guard", 
  //   title: "Cognitive Guard", 
  //   icon: "🛡️", 
  //   description: "Consistently detect manipulation without relying on obvious signals", 
  //   requiredLevel: 5 
  // },
  // { 
  //   id: "pattern-analyst", 
  //   title: "Pattern Analyst", 
  //   icon: "📊", 
  //   description: "Demonstrate mastery in recognizing coordinated information patterns", 
  //   requiredLevel: 6 
  // },
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
