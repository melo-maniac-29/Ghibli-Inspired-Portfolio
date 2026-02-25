"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function ExamNoticePopup() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if the user has seen this popup before
    const hasSeenNotice = localStorage.getItem('hasSeenExamNotice');
    
    if (!hasSeenNotice) {
      // Show the popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    // Remember that the user has seen the notice
    localStorage.setItem('hasSeenExamNotice', 'true');
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          <motion.div
            className="relative bg-card rounded-xl border border-primary/20 shadow-2xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-ghibli-gradient">Notice</h3>
              
              <p className="mb-3 text-foreground">
                Sorry, due to exams I am not able to complete the backend functionality. 
                Working on it after semester exams!
              </p>
              
              <p className="text-sm text-muted-foreground mb-5">
                Meanwhile, feel free to explore the UI I've designed. Hope you like it! 😊
              </p>
              
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-md transition-all"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ExamNoticePopup;
