"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Reduced to just 2 essential phrases for faster loading
const loadingPhrases = [
  "Conjuring magic...",
  "Summoning totoro..."
];

export default function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(loadingPhrases[0]);
  const phraseIndex = useRef(0);
  const phraseInterval = useRef<NodeJS.Timeout | null>(null);
  const phraseTime = 750; // Cut in half from 1500ms to 750ms
  
  useEffect(() => {
    // Mark component as mounted - this ensures it's visible during SSR and initial client render
    setMounted(true);
    
    // Add a class to signal loader is active
    document.documentElement.classList.add('loading');
    
    // Show first phrase immediately
    setCurrentPhrase(loadingPhrases[0]);
    
    // Switch to second phrase after a short delay
    const firstPhraseTimer = setTimeout(() => {
      setCurrentPhrase(loadingPhrases[1]);
    }, 1000); // Show first phrase for 1 second, then switch
    
    // Hide after showing both phrases
    const timer = setTimeout(() => {
      if (phraseInterval.current) clearInterval(phraseInterval.current);
      setVisible(false);
      // Remove the loading class when animation completes
      setTimeout(() => {
        document.documentElement.classList.remove('loading');
      }, 400);
    }, 2500); // Enough time to show both phrases clearly
    
    return () => {
      clearTimeout(firstPhraseTimer);
      clearTimeout(timer);
      if (phraseInterval.current) clearInterval(phraseInterval.current);
    };
  }, []);
  
  // Add a no-js fallback to ensure something shows during SSR
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-90">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }} // Reduced from 0.8s to 0.4s
        >
          {/* Magical background with gradient and particles */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
            {/* Animated dust particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`dust-${i}`}
                className="absolute rounded-full bg-primary/10"
                initial={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, Math.random() * 10 - 5, 0],
                  scale: [0, Math.random() * 0.5 + 0.5, 0],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.1
                }}
                style={{
                  width: 4 + Math.random() * 6,
                  height: 4 + Math.random() * 6,
                }}
              />
            ))}
          </div>
          
          <div className="relative flex flex-col items-center">
            {/* Totoro-inspired loader */}
            <motion.div
              className="relative w-44 h-44"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }} // Reduced from 0.5s to 0.3s
            >
              {/* Main body shadow */}
              <motion.div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/20 rounded-full blur-md"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Main body */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-40 bg-gray-600 rounded-[50%]"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Belly */}
                <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-300 rounded-[50%]" />
                
                {/* Eyes */}
                <div className="absolute top-[25%] left-[30%] w-4 h-4 bg-white rounded-full flex justify-center items-center">
                  <motion.div 
                    className="w-2 h-2 bg-black rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                  />
                </div>
                
                <div className="absolute top-[25%] right-[30%] w-4 h-4 bg-white rounded-full flex justify-center items-center">
                  <motion.div 
                    className="w-2 h-2 bg-black rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                  />
                </div>
                
                {/* Nose */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-3 h-2 bg-black rounded-full" />
                
                {/* Whiskers */}
                <motion.div 
                  className="absolute top-[43%] left-[20%] w-8 h-0.5 bg-black/60 rounded-full origin-left"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <motion.div 
                  className="absolute top-[43%] right-[20%] w-8 h-0.5 bg-black/60 rounded-full origin-right"
                  animate={{ rotate: [5, -5, 5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <motion.div 
                  className="absolute top-[50%] left-[18%] w-6 h-0.5 bg-black/60 rounded-full origin-left"
                  animate={{ rotate: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                
                <motion.div 
                  className="absolute top-[50%] right-[18%] w-6 h-0.5 bg-black/60 rounded-full origin-right"
                  animate={{ rotate: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                
                {/* Ears */}
                <motion.div 
                  className="absolute top-[5%] left-[25%] w-5 h-8 bg-gray-600 rounded-[50%] origin-bottom"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <motion.div 
                  className="absolute top-[5%] right-[25%] w-5 h-8 bg-gray-600 rounded-[50%] origin-bottom"
                  animate={{ rotate: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Loading progress indicator - shortened to match faster timing */}
              <motion.div
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/20 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }} // Reduced from 0.5s to 0.2s
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 2.5, // Fixed duration instead of phrase-based
                    ease: "linear" 
                  }}
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }} // Reduced delays and duration
              className="mt-16 text-center"
            >
              {/* Improved text animation with better alignment and quicker transitions */}
              <div className="h-10 relative w-64 mx-auto flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentPhrase} // Important: Key changes trigger animation
                    className="text-xl font-medium font-heading text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary absolute w-full text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }} // Slightly faster (0.7s -> 0.5s)
                  >
                    {currentPhrase}
                  </motion.p>
                </AnimatePresence>
              </div>
              
              {/* Magical sparkles around text */}
              <div className="relative mt-2">
                <motion.div 
                  className="flex gap-2 justify-center" // Increased gap for better spacing
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {['•', '•', '•'].map((dot, i) => (
                    <motion.span
                      key={i}
                      className="text-primary text-xl"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        delay: i * 0.3,
                        repeatType: "loop" 
                      }}
                    >
                      {dot}
                    </motion.span>
                  ))}
                </motion.div>
                
                {/* Tiny stars/sparkles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute w-1.5 h-1.5 text-yellow-400"
                    style={{
                      top: `${-5 - Math.random() * 15}px`,
                      left: `${20 + i * 10 + Math.random() * 15}px`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      y: [0, -10, -5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      repeatDelay: Math.random() * 2
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
                    </svg>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Animated forest silhouette at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
            {/* Wavy landscaping */}
            <svg className="w-full absolute bottom-0" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                fill="currentColor"
                className="text-primary/10"
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              ></path>
            </svg>
            
            {/* Trees silhouette with a bit more variation */}
            <div className="absolute bottom-0 left-0 right-0 h-20">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute bottom-0 ${i % 3 === 0 ? 'bg-primary/20' : 'bg-primary/15'}`}
                  style={{
                    left: `${i * 4 + Math.random() * 3}%`,
                    height: `${8 + Math.random() * 15}px`,
                    width: `${4 + Math.random() * 8}px`,
                    borderRadius: `${40 + Math.random() * 20}% ${40 + Math.random() * 20}% 0 0`
                  }}
                  animate={{ 
                    height: [`${8 + Math.random() * 15}px`, `${10 + Math.random() * 15}px`, `${8 + Math.random() * 15}px`],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 1.5 + Math.random(), 
                    repeat: Infinity, 
                    delay: Math.random(),
                  }}
                />
              ))}
              
              {/* Add some distinct Ghibli-like trees */}
              <motion.div
                className="absolute bottom-0 left-[30%] w-12 h-20 flex justify-center"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-5 h-14 bg-primary/20 rounded-sm"></div>
                <div className="absolute bottom-7 w-10 h-6 bg-primary/20 rounded-full"></div>
                <div className="absolute bottom-10 w-12 h-6 bg-primary/20 rounded-full"></div>
                <div className="absolute bottom-7 w-10 h-6 bg-primary/20 rounded-full"></div>
                <div className="absolute bottom-10 w-12 h-6 bg-primary/20 rounded-full"></div>
                <div className="absolute bottom-13 w-10 h-5 bg-primary/20 rounded-full"></div>
              </motion.div>
              
              <motion.div
                className="absolute bottom-0 right-[35%] w-14 h-18 flex justify-center"
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="w-6 h-12 bg-primary/25 rounded-sm"></div>
                <div className="absolute bottom-5 w-12 h-5 bg-primary/25 rounded-full"></div>
                <div className="absolute bottom-8 w-14 h-5 bg-primary/25 rounded-full"></div>
                <div className="absolute bottom-11 w-10 h-4 bg-primary/25 rounded-full"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}