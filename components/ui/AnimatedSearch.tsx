"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search } from "lucide-react";

export function AnimatedSearch({ defaultValue }: { defaultValue: string }) {
  const { scrollY } = useScroll();
  const [isHidden, setIsHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // If scrolling down and we've scrolled past the hero section (150px)
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else if (latest < previous) {
      // If scrolling up, show it again
      setIsHidden(false);
    }
  });

  return (
    <motion.div
      className="sticky top-28 z-30 mb-12 origin-top"
      initial={false}
      animate={{ 
        opacity: isHidden ? 0 : 1, 
        y: isHidden ? -40 : 0,
        scale: isHidden ? 0.9 : 1,
        pointerEvents: isHidden ? "none" : "auto" 
      }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="max-w-3xl mx-auto flex justify-center h-[52px] md:h-[60px] px-4">
        <form method="GET" className="relative shadow-glass-lg rounded-full group w-14 md:w-16 hover:w-full focus-within:w-full transition-all duration-500 ease-out overflow-hidden bg-white/70 backdrop-blur-xl border border-white/60 h-full cursor-pointer">
          <div className="absolute left-0 top-0 bottom-0 w-14 md:w-16 flex items-center justify-center z-10 transition-colors pointer-events-none">
            <Search className="h-5 w-5 text-brand-500 transition-transform duration-300 group-hover:scale-110 group-focus-within:scale-110" />
          </div>
          <input
            name="search"
            defaultValue={defaultValue}
            placeholder="Search for articles, topics, or ideas..."
            className="absolute inset-0 w-full h-full pl-14 md:pl-16 pr-6 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm md:text-base outline-none font-medium opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 delay-100 cursor-text"
          />
        </form>
      </div>
    </motion.div>
  );
}
