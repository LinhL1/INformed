import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type SeenMap = Record<string, boolean>;
type ChoiceMap = Record<string, string>;

/**
 * Seen-flags and choice records for story scenes, persisted in Supabase auth
 * user_metadata (same pattern as onboarding_seen) — readable synchronously
 * from the session, no table or fetch needed. Writes replace the whole map
 * key, so each write sends the merged map.
 */
export function useStoryState() {
  const { user } = useAuth();
  const [seen, setSeen] = useState<SeenMap>(
    () => (user?.user_metadata?.story_seen as SeenMap) ?? {},
  );

  const hasSeen = useCallback((key: string) => !!seen[key], [seen]);

  const markSeen = useCallback((key: string) => {
    setSeen((prev) => {
      if (prev[key]) return prev;
      const next = { ...prev, [key]: true };
      void supabase.auth.updateUser({ data: { story_seen: next } });
      return next;
    });
  }, []);

  const recordChoice = useCallback(
    (key: string, optionId: string) => {
      const prev = (user?.user_metadata?.story_choices as ChoiceMap) ?? {};
      void supabase.auth.updateUser({ data: { story_choices: { ...prev, [key]: optionId } } });
    },
    [user],
  );

  return { hasSeen, markSeen, recordChoice };
}
