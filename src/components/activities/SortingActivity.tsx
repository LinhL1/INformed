import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Layers } from "lucide-react";

export interface SortingCategory {
  name: string;
  color?: string;
}

export interface SortingItem {
  text: string;
  correctCategory: number; // index into categories
}

interface Props {
  title?: string;
  categories: SortingCategory[];
  items: SortingItem[];
  onComplete?: (score: number) => void;
}

const SortingActivity = ({ title, categories, items, onComplete }: Props) => {
  const [placements, setPlacements] = useState<(number | null)[]>(new Array(items.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const unplacedItems = items.map((_, i) => i).filter((i) => placements[i] === null);

  const handlePlaceItem = (categoryIndex: number) => {
    if (activeItem === null || submitted) return;
    const newPlacements = [...placements];
    newPlacements[activeItem] = categoryIndex;
    setPlacements(newPlacements);
    setActiveItem(null);
  };

  const handleRemoveItem = (itemIndex: number) => {
    if (submitted) return;
    const newPlacements = [...placements];
    newPlacements[itemIndex] = null;
    setPlacements(newPlacements);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = placements.filter((p, i) => p === items[i].correctCategory).length;
    onComplete?.(score);
  };

  const handleReset = () => {
    setPlacements(new Array(items.length).fill(null));
    setSubmitted(false);
    setActiveItem(null);
  };

  const allPlaced = placements.every((p) => p !== null);
  const score = submitted ? placements.filter((p, i) => p === items[i].correctCategory).length : 0;

  const categoryColors = [
    "border-accent/40 bg-accent/5",
    "border-[hsl(var(--module-5))]/40 bg-[hsl(var(--module-5))]/5",
    "border-success/40 bg-success/5",
    "border-[hsl(var(--module-6))]/40 bg-[hsl(var(--module-6))]/5",
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-accent" />
        <h4 className="font-display text-base font-semibold text-foreground">
          {title || "Sort the Items"}
        </h4>
      </div>

      {/* Unplaced items */}
      {unplacedItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Tap an item, then tap a category to place it
          </p>
          <div className="flex flex-wrap gap-2">
            {unplacedItems.map((itemIndex) => (
              <button
                key={itemIndex}
                onClick={() => setActiveItem(activeItem === itemIndex ? null : itemIndex)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  activeItem === itemIndex
                    ? "border-accent bg-accent/15 text-foreground ring-2 ring-accent/30"
                    : "border-border bg-secondary/50 text-foreground hover:border-accent/50"
                }`}
              >
                {items[itemIndex].text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((cat, catIndex) => {
          const placedHere = items
            .map((_, i) => i)
            .filter((i) => placements[i] === catIndex);

          return (
            <button
              key={catIndex}
              onClick={() => handlePlaceItem(catIndex)}
              disabled={activeItem === null && !submitted}
              className={`rounded-xl border-2 border-dashed p-3 text-left transition-all min-h-[80px] ${
                categoryColors[catIndex % categoryColors.length]
              } ${
                activeItem !== null && !submitted
                  ? "cursor-pointer hover:scale-[1.02] hover:shadow-sm"
                  : "cursor-default"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {cat.name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {placedHere.map((itemIndex) => (
                  <motion.span
                    key={itemIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${
                      submitted
                        ? items[itemIndex].correctCategory === catIndex
                          ? "border-success/50 bg-success/10 text-success"
                          : "border-destructive/50 bg-destructive/10 text-destructive"
                        : "border-border bg-card text-foreground cursor-pointer hover:bg-destructive/5"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!submitted) handleRemoveItem(itemIndex);
                    }}
                  >
                    {items[itemIndex].text}
                    {submitted &&
                      (items[itemIndex].correctCategory === catIndex ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      ))}
                  </motion.span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {submitted ? (
          <>
            <p
              className={`text-sm font-medium ${
                score === items.length ? "text-success" : score >= items.length * 0.7 ? "text-accent" : "text-destructive"
              }`}
            >
              {score}/{items.length} correct —{" "}
              {score === items.length
                ? "Perfect classification!"
                : score >= items.length * 0.7
                ? "Good work, agent."
                : "Review and try again."}
            </p>
            <button
              onClick={handleReset}
              className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Try Again
            </button>
          </>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allPlaced}
            className={`ml-auto rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              allPlaced
                ? "bg-accent text-accent-foreground hover:opacity-90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            Check Answers
          </button>
        )}
      </div>
    </div>
  );
};

export default SortingActivity;
