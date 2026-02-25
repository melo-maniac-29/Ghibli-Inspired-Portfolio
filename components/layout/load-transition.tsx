"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LoadTransition() {
  const pathname = usePathname();
  const [isPresent, setIsPresent] = useState(false);

  // Handle route changes with slightly longer transition
  useEffect(() => {
    setIsPresent(true);
    const timeout = setTimeout(() => {
      setIsPresent(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isPresent && (
        <motion.div
          key={pathname}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="w-20 h-20 relative"
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background">
              {/* Ghibli-inspired small spirits */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/70"
                  animate={{
                    x: [0, 5, 0, -5, 0],
                    y: [0, -5, 0, 5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    width: 4,
                    height: 4,
                    top: 5 + i * 7,
                    left: 5 + i * 7,
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          <motion.div
            className="mt-6 text-sm text-primary flex items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Journeying
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
