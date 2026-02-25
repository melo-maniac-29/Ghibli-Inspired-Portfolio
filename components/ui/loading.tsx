"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  minimumLoadingTime?: number;
  loadingText?: string;
}

export function Loading({
  isLoading,
  setIsLoading,
  minimumLoadingTime = 1500, // Increased from 1000ms to 1500ms
  loadingText = "Loading experience..."
}: LoadingProps) {
  const [displayLoader, setDisplayLoader] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      // Add a longer delay before hiding the loader for smoother transitions
      const timer = setTimeout(() => {
        setDisplayLoader(false);
      }, 500); // Increased from 300ms to 500ms
      return () => clearTimeout(timer);
    } else {
      setDisplayLoader(true);
    }
  }, [isLoading]);

  useEffect(() => {
    // Ensure a minimum loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minimumLoadingTime);
    return () => clearTimeout(timer);
  }, [minimumLoadingTime, setIsLoading]);

  // Variants for the loading animation with slower timing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.7 } // Slower fade in
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.7 } // Slower fade out
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.8 } // Slower scale and fade
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, delay: 0.3 } // Slower text animation with more delay
    }
  };

  return (
    <AnimatePresence>
      {displayLoader && (
        <motion.div
          className="fixed inset-0 bg-background z-50 flex items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="relative w-16 h-16"
              variants={iconVariants}
            >
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background"></div>
            </motion.div>
            
            <motion.p 
              className="mt-6 text-muted-foreground font-medium tracking-wide"
              variants={textVariants}
            >
              <span className="inline-block animate-pulse">{loadingText}</span>
            </motion.p>
            
            <motion.div
              className="mt-4 flex space-x-1"
              variants={textVariants}
            >
              {[0, 1, 2].map((dot) => (
                <div 
                  key={dot} 
                  className="w-2 h-2 rounded-full bg-primary/60"
                  style={{
                    animation: `pulse 1.5s ease-in-out ${dot * 0.2}s infinite`
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
