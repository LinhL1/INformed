import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { PulsingCue } from "@/components/onboarding/shared";
import PrologueScreen from "@/components/onboarding/PrologueScreen";
import AssignmentScreen from "@/components/onboarding/AssignmentScreen";
import MondayScreen from "@/components/onboarding/MondayScreen";
import ColdOpenScreen from "@/components/onboarding/ColdOpenScreen";
import RevealScreen from "@/components/onboarding/RevealScreen";
import MissionScreen from "@/components/onboarding/MissionScreen";
import OrgScreen from "@/components/onboarding/OrgScreen";
import DeskScreen from "@/components/onboarding/DeskScreen";
import HandoffScreen from "@/components/onboarding/HandoffScreen";

const LESSON_ONE_PATH = "/module/introduction/lesson/what-is-disinfo";

const SCREENS = [
  PrologueScreen,
  AssignmentScreen,
  MondayScreen,
  ColdOpenScreen,
  RevealScreen,
  MissionScreen,
  OrgScreen,
  DeskScreen,
  HandoffScreen,
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  // Captured once on mount so the skip button never appears mid-sequence for first-timers.
  const [seenBefore] = useState(() => !!user?.user_metadata?.onboarding_seen);
  const from = (location.state as { from?: string } | null)?.from ?? "/modules";
  const canSkip = seenBefore && step >= 1;

  const markSeen = useCallback(() => {
    if (!seenBefore) void supabase.auth.updateUser({ data: { onboarding_seen: true } });
  }, [seenBefore]);

  const advance = useCallback(() => {
    if (step < SCREENS.length - 1) {
      setStep(step + 1);
    } else {
      markSeen();
      navigate(LESSON_ONE_PATH, { replace: true });
    }
  }, [step, markSeen, navigate]);

  const skip = useCallback(() => {
    markSeen();
    navigate(from, { replace: true });
  }, [markSeen, navigate, from]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        advance();
      } else if (e.key === "Escape" && canSkip) {
        skip();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance, skip, canSkip]);

  const Screen = SCREENS[step];

  return (
    <div
      className="relative min-h-screen cursor-pointer select-none overflow-hidden bg-background"
      onClick={advance}
    >
      {canSkip && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
          className="absolute right-5 top-5 z-10 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          Skip intro
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex min-h-screen items-center justify-center px-6 py-16"
        >
          <Screen />
        </motion.div>
      </AnimatePresence>

      {/* Last screen carries its own "tap to begin" cue */}
      {step < SCREENS.length - 1 && <PulsingCue key={step} />}
    </div>
  );
}
