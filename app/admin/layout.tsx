"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Verify authentication with the server
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/verify-auth', {
          // Add cache: 'no-store' to prevent caching
          cache: 'no-store',
          headers: {
            // Add a random param to bypass cache
            'Cache-Control': 'no-cache',
            'x-timestamp': Date.now().toString(),
          },
        });
        
        const data = await response.json();
        
        if (response.ok && data.authorized) {
          setIsAuthorized(true);
          setIsLoading(false);
        } else {
          console.log('Auth failed, redirecting...');
          toast.error('Authentication required');
          // Navigate back to home and reset loading state
          router.push('/');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        toast.error('Authentication error');
        router.push('/');
        setIsLoading(false);
      }
    };
    
    verifyAuth();
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    // If not authorized, this will show briefly before redirect happens
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-background min-h-screen">
      {/* Admin content container with proper spacing for existing navbar */}
      <div className="pt-16 md:pt-20 px-4 max-w-7xl mx-auto">
        {/* Admin context banner */}
        <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-200 text-sm flex justify-between items-center">
          <span>You are in Admin Mode</span>
          <button 
            onClick={() => router.push('/')} 
            className="text-xs px-2 py-1 rounded bg-amber-200 dark:bg-amber-900 hover:bg-amber-300 dark:hover:bg-amber-800 text-amber-800 dark:text-amber-200 transition-colors"
          >
            Return to Site
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
}
