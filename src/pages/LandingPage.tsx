import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Brain, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import mentorImage from "@/assets/ms-informed-mentor.png";

const pillars = [
  { icon: Shield, label: "National Security" },
  { icon: Brain, label: "Critical Thinking" },
  { icon: Eye, label: "Media Literacy" },
];

const LandingPage = () => (
  <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center overflow-hidden px-4">
    {/* Subtle background accents */}
    <motion.div
      className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full opacity-[0.07]"
      style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.12, 0.07] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-[0.05]"
      style={{ background: "radial-gradient(circle, hsl(var(--module-1)), transparent 70%)" }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />

    <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 py-16 text-center lg:flex-row lg:text-left lg:gap-12">
      {/* Mentor figure
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="shrink-0"
      >
        <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg lg:h-64 lg:w-64">
          <img
            src={mentorImage}
            alt="Ms. Informed — your media literacy mentor"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </motion.div> */}

      {/* Copy */}
      <div className="flex flex-col items-center lg:items-start">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-display text-5xl font-bold text-foreground sm:text-6xl"
        >
        Be <span className="text-accent italic">Informed</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground"
        >
          Disinformation doesn't just mislead, it threatens national security.
          Sharpen your critical thinking, learn to spot manipulation tactics, and
          become the strongest link in the chain of defense. Your awareness is your armor.
        </motion.p>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
        >
          {pillars.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-accent" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8"
        >
          <Button asChild size="lg" className="gap-2 text-base">
            <Link to="/modules">
              Let's Begin
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  </div>
);

export default LandingPage;
