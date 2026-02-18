import { motion } from "framer-motion";
import ModuleCard from "@/components/ModuleCard";
import PageTransition from "@/components/PageTransition";
import { modules } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";

const Index = () => {
  const { getModuleProgress } = useProgress();

  return (
    <PageTransition>
      
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 space-y-3"
        >
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Stay Sharp. Stay Informed.          </h1>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            Build your media literacy skills across six interactive modules.
            Navigating the digital landscape. Learn to spot disinformation, protect yourself and your community.
          </p>
        </motion.div>

        {/* Module Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              progress={getModuleProgress(module.id, module.subtopics.length)}
              index={index}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
