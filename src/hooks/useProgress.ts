import { useState, useCallback } from "react";

interface Progress {
  [moduleId: string]: {
    [subtopicId: string]: boolean;
  };
}

const STORAGE_KEY = "ms-informed-progress";

function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  const markComplete = useCallback((moduleId: string, subtopicId: string) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        [moduleId]: { ...prev[moduleId], [subtopicId]: true },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (moduleId: string, subtopicId: string) =>
      !!progress[moduleId]?.[subtopicId],
    [progress]
  );

  const getModuleProgress = useCallback(
    (moduleId: string, totalSubtopics: number) => {
      const completed = Object.values(progress[moduleId] || {}).filter(Boolean).length;
      return { completed, total: totalSubtopics, percent: totalSubtopics > 0 ? Math.round((completed / totalSubtopics) * 100) : 0 };
    },
    [progress]
  );

  return { markComplete, isComplete, getModuleProgress };
}
