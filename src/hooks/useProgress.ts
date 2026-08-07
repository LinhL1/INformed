import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface Progress {
  [moduleId: string]: {
    [subtopicId: string]: boolean;
  };
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress({});
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    supabase
      .from("user_progress")
      .select("module_id, subtopic_id")
      .eq("user_id", user.id)
      .eq("completed", true)
      .then(({ data }) => {
        const shaped: Progress = {};
        for (const row of data ?? []) {
          if (!shaped[row.module_id]) shaped[row.module_id] = {};
          shaped[row.module_id][row.subtopic_id] = true;
        }
        setProgress(shaped);
        setIsLoading(false);
      });
  }, [user?.id]);

  const markComplete = useCallback(
    async (moduleId: string, subtopicId: string) => {
      if (!user) return;
      setProgress((prev) => ({
        ...prev,
        [moduleId]: { ...prev[moduleId], [subtopicId]: true },
      }));
      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          module_id: moduleId,
          subtopic_id: subtopicId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,module_id,subtopic_id" }
      );
      if (error) {
        // Write failed — undo the optimistic update so local state doesn't
        // claim progress that was never persisted (a subsequent fetch would
        // not find it either).
        setProgress((prev) => {
          const moduleProgress = { ...prev[moduleId] };
          delete moduleProgress[subtopicId];
          return { ...prev, [moduleId]: moduleProgress };
        });
      }
    },
    [user]
  );

  const isComplete = useCallback(
    (moduleId: string, subtopicId: string) => !!progress[moduleId]?.[subtopicId],
    [progress]
  );

  const getModuleProgress = useCallback(
    (moduleId: string, totalSubtopics: number) => {
      const completed = Object.values(progress[moduleId] || {}).filter(Boolean).length;
      return {
        completed,
        total: totalSubtopics,
        percent: totalSubtopics > 0 ? Math.round((completed / totalSubtopics) * 100) : 0,
      };
    },
    [progress]
  );

  return { markComplete, isComplete, getModuleProgress, isLoading };
}
