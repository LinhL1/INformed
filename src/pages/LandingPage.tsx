import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Eye, Lightbulb } from "lucide-react";
import mentorImage from "@/assets/ms-informed-mentor.png";
import bg from "@/assets/landing-bg.png";
import lightbulbImage from "@/assets/lightbulb.png"; 

const LandingPage = () => (
  <div
    className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center overflow-hidden px-4 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${bg})` }}
  >
    {/* Hanging wire and lightbulb both anchor on left-[57%] -translate-x-1/2
        against this same full-width container. That idiom centers each
        element on the 57% mark regardless of the element's own width, so
        the two stay aligned to each other at any viewport width — unlike
        two independently-tuned right-% offsets, which only line up at one
        width, or nesting them in a shared wrapper, which (since both
        children are position:absolute) collapses to a zero-width box and
        breaks centering and image sizing alike. */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute top-0 left-[57%] translate-x-[calc(-50%-1px)] w-0.5 h-[150px] bg-primary z-20"
      style={{ transformOrigin: "top" }}
    />

    {/* Lightbulb Button */}
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        type: "spring",
        bounce: 0.4
      }}
      style={{ x: "-50%" }}
      className="absolute top-[150px] left-[57%] z-20 cursor-pointer group"
    >
      <Link to="/modules">
        <motion.div
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        initial="initial"
        animate="initial"
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          variants={{
            initial: { opacity: 0.5, scale: 1 },
            hover: { opacity: 1.8, scale: 1.8 }
          }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 rounded-full bg-accent/60 blur-2xl"
        />

          {/* Image instead of icon */}
          <img
            src={lightbulbImage}
            alt="Click to explore modules"
            className="w-24 h-24 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
          />

          {/* Tooltip on hover */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileHover={{ opacity: 1, y: -15 }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium text-foreground bg-accent px-3 py-1 rounded pointer-events-none"
          >
            Explore Modules
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>

    <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 py-16 text-center lg:flex-row lg:text-left lg:gap-12">
      <div className="flex flex-col items-center lg:items-start">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 font-display text-11xl font-bold text-foreground sm:text-9xl"
        >
          Be <br /><span className="text-accent italic">Informed.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground"
        >
          Disinformation doesn't just mislead, it threatens national security.
          As a newly recruited analyst at INformed, begin your adventure to learning the best ways to
          nagivate the new era of digital media. 
        </motion.p>
      </div>
    </div>
  </div>
);

export default LandingPage;