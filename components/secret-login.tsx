"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

/**
 * A hidden login component that can be activated with a keyboard shortcut: Alt+Shift+L
 */
export function SecretLogin() {
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Listen for the secret key combination
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show login panel on Alt+Shift+L
      if (e.altKey && e.shiftKey && e.key === 'L') {
        setIsVisible(true);
      }
      
      // Hide on Escape
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/secret-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (response.ok) {
        // Cookie is automatically set by the server response
        router.push('/admin');
        setIsVisible(false);
      } else {
        setError('Invalid password');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Authentication failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-lg border border-primary/20 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Admin Access</h2>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default SecretLogin;
