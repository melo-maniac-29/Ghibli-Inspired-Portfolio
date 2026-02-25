"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Loader2 } from 'lucide-react';

export function KeyboardShortcutListener() {
  const router = useRouter();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [error, setError] = useState("");
  const [touchPoints, setTouchPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Track keys for keyboard shortcut
    const keysPressed = new Set();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key);

      // Ctrl+Alt+L shortcut
      if (
        keysPressed.has('Control') &&
        keysPressed.has('Alt') &&
        keysPressed.has('l')
      ) {
        showLogin();
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key);
    };

    // Function to show login modal
    const showLogin = () => {
      setIsPromptOpen(true);
      setError("");
    };

    // Improved touch handling for 4-finger gesture
    const handleTouchStart = (e: TouchEvent) => {
      // Count touch points
      setTouchPoints(e.touches.length);
      
      // If exactly 4 fingers are detected, show login
      if (e.touches.length === 4) {
        e.preventDefault(); // Prevent default behavior
        showLogin();
        console.log("4-finger touch detected");
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    
    try {
      // Use the existing API endpoint for login
      const response = await fetch('/api/secret-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Close the modal
        setIsPromptOpen(false);
        
        // Navigate to admin page
        router.push('/admin');
        
        // Fallback direct navigation after a delay
        setTimeout(() => {
          window.location.href = '/admin';
        }, 500);
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isPromptOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm touch-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Colored top border */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Lock size={18} />
                    <h3 className="text-lg font-semibold">Admin Access</h3>
                  </div>
                  <button 
                    onClick={() => setIsPromptOpen(false)}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                    disabled={loading}
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label 
                        htmlFor="admin-password" 
                        className="block text-sm font-medium mb-1.5 text-muted-foreground"
                      >
                        Password
                      </label>
                      <input
                        id="admin-password"
                        type="password"
                        name="password"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Enter admin password"
                        autoFocus
                        disabled={loading}
                      />
                      
                      {error && (
                        <p className="mt-2 text-sm text-destructive">{error}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPromptOpen(false)}
                        className="px-4 py-2 text-sm rounded-md border border-input bg-background hover:bg-muted transition-colors"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                            <span>Logging in...</span>
                          </>
                        ) : (
                          'Login'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
                    Access with <span className="px-1.5 py-0.5 bg-muted rounded">Ctrl+Alt+L</span> or four-finger touch
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Debug indicator for touch points (visible only in development) */}
      {process.env.NODE_ENV === 'development' && touchPoints > 0 && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-1 rounded-full text-xs z-50">
          {touchPoints} fingers detected
        </div>
      )}
    </>
  );
}
