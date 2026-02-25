"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if dark mode is active
  const isDark = mounted ? theme === "dark" || resolvedTheme === "dark" : false;

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <div className="h-12 w-20" />;
  }

  return (
    <motion.div
      className="relative h-14 w-24 rounded-xl overflow-hidden border border-primary/20 cursor-pointer shadow-md"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
    >
      {/* Background day/night sky */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          background: isDark
            ? "linear-gradient(to bottom, #14213d 0%, #283756 100%)"
            : "linear-gradient(to bottom, #a8ddff 0%, #c6e5ff 100%)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Scene elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Stars - only visible in dark mode */}
        <AnimatePresence>
          {isDark && (
            <>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute rounded-full bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: Math.random() * 0.7 + 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 60}%`,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Clouds - Ghibli style */}
        <AnimatePresence>
          {!isDark && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`cloud-${i}`}
                  className="absolute bg-white/90 rounded-full"
                  initial={{
                    x: -30,
                    opacity: 0.9,
                    scale: 0.8 + i * 0.2,
                  }}
                  animate={{
                    x: 50,
                    opacity: 0.9,
                  }}
                  exit={{
                    x: -30,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 15 + i * 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: i * 2,
                  }}
                  style={{
                    width: 20 + i * 10,
                    height: 10 + i * 5,
                    top: 10 + i * 10,
                    borderRadius: "50%",
                    filter: "blur(2px)",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Totoro or Sun */}
        <motion.div
          className="absolute rounded-full"
          animate={{
            backgroundColor: isDark ? "#e2e8f0" : "#fbbf24",
            boxShadow: isDark
              ? "0 0 5px 0 rgba(255, 255, 255, 0.3)"
              : "0 0 30px 5px rgba(251, 191, 36, 0.7)",
            width: isDark ? 18 : 22,
            height: isDark ? 18 : 22,
            top: isDark ? 6 : 12,
            right: isDark ? 9 : 26,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          {/* Totoro features - only visible in dark mode */}
          <AnimatePresence>
            {isDark && (
              <>
                <motion.div
                  className="absolute bg-slate-800 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  style={{ width: 4, height: 4, top: 4, left: 4 }}
                />
                <motion.div
                  className="absolute bg-slate-800 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  style={{ width: 4, height: 4, top: 4, right: 4 }}
                />
                <motion.div
                  className="absolute bg-white rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  style={{ width: 2, height: 2, top: 3, left: 5 }}
                />
                <motion.div
                  className="absolute bg-white rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  style={{ width: 2, height: 2, top: 3, right: 5 }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ground/horizon - with Ghibli grass */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          animate={{
            height: "35%",
            backgroundColor: isDark ? "#223044" : "#4ade80",
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Grass or hills - Ghibli style in light mode */}
          <AnimatePresence>
            {!isDark && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`grass-${i}`}
                    className="absolute bottom-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      width: 4 + i * 2,
                      height: 6 + i * 2,
                      left: 4 + i * 5,
                      backgroundColor: "#2e8b57",
                      borderRadius: "50% 50% 0 0",
                    }}
                  />
                ))}
                
                <motion.div
                  className="absolute bottom-0 left-[60%] w-8 h-5 bg-[#2e8b57] rounded-t-full"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Soot sprites - only in dark mode */}
          <AnimatePresence>
            {isDark && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`soot-${i}`}
                    className="absolute bottom-1 rounded-full bg-black/80"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 0.7, 
                      x: [0, -5, 0, 5, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.5,
                    }}
                    style={{
                      width: 4 + i,
                      height: 4 + i,
                      left: 7 + i * 8,
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Toggle text indicator */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center">
        <motion.div
          className="text-[10px] font-medium rounded-full px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white/90"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {isDark ? "Day" : "Night"}
        </motion.div>
      </div>
    </motion.div>
  );
}
