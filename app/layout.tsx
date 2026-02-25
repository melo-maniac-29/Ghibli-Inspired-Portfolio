import './globals.css';
import type { Metadata } from 'next';
import { Inter, Raleway } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navigation from '@/components/navigation';
import { LoadTransition } from '@/components/layout/load-transition';
import { Suspense } from 'react';
import InitialLoader from '@/components/loaders/initial-loader';
import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import SecretLogin from '@/components/secret-login';
import { ConvexProvider } from '@/components/convex-provider';
import { KeyboardShortcutListener } from '@/components/keyboard-shortcut-listener';
import { Toaster } from "@/components/ui/toaster";

// Use Raleway for headings and Inter for body text
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway', display: 'swap' });

export const metadata: Metadata = {
  title: 'itsmeallen',
  description: 'A cutting-edge portfolio showcasing innovative work and services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add inline loader styles to ensure something shows before React hydrates */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Initial loading indicator that works without JS */
            html:not(.js-loaded)::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: var(--background, #ffffff);
              z-index: 9999;
            }
            
            html:not(.js-loaded)::after {
              content: '';
              position: fixed;
              top: calc(50% - 25px);
              left: calc(50% - 25px);
              width: 50px;
              height: 50px;
              border: 4px solid rgba(127, 127, 127, 0.3);
              border-radius: 50%;
              border-top-color: var(--primary, #3b82f6);
              animation: loader-spin 1s linear infinite;
              z-index: 10000;
            }
            
            @keyframes loader-spin {
              to { transform: rotate(360deg); }
            }
            
            /* Hide static loader once JS loads */
            html.js-loaded::before, html.js-loaded::after {
              display: none;
            }
            
            /* When our React loader is active */
            html.loading {
              overflow: hidden;
            }
          `
        }} />
        
        {/* Script to mark when JS has loaded */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.documentElement.classList.add('js-loaded');
          `
        }} />
      </head>
      <body className={`${inter.variable} ${raleway.variable} font-sans`}>
        {/* Place the InitialLoader outside of any Suspense or hydration boundaries */}
        <InitialLoader />
        
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexProvider>
            <KeyboardShortcutListener />
            {/* Secret login component */}
            <SecretLogin />
            
            {/* Decorative background elements */}
            <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-primary/5 to-transparent" />
              
              {/* Animated subtle particles */}
              <div className="ghibli-particles" />
              
              {/* Magic dust corners */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-40" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl opacity-40" />
            </div>
            
            <div className="flex flex-col min-h-screen relative z-0">
              {/* Use a dedicated suspense boundary for the main content */}
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><InitialLoader /></div>}>
                <Navigation />
                <main className="flex-grow">
                  {children}
                </main>
                
                {/* Simple, elegant footer */}
                <footer className="py-3 border-t border-primary/10 bg-background/70 relative overflow-hidden">
                  {/* Subtle forest silhouette */}
                  <div className="absolute bottom-0 left-0 w-full h-8 opacity-5 ghibli-forest-silhouette pointer-events-none" />
                  
                  {/* Floating dust particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="ghibli-footer-dust" />
                  </div>
                  
                  <div className="container mx-auto px-4 relative">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground group">
                        <Link href="/" className="relative inline-block">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent font-medium mr-1">
                            itsme-allen
                          </span>
                          <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </Link>
                        <span>&copy; {new Date().getFullYear()}</span>
                      </div>
      
                      
                      <div className="flex items-center space-x-6">
                        {[
                          { href: "https://github.com/melo-maniac-29", Icon: Github, hoverClass: "hover:text-primary" },
                          { href: "https://www.linkedin.com/in/allenbobby/", Icon: Linkedin, hoverClass: "hover:text-secondary" },
                          { href: "#", Icon: Twitter, hoverClass: "hover:text-accent" }
                        ].map((social, i) => (
                          <a 
                            key={i}
                            href={social.href}
                            aria-label={`${social.Icon.name || 'Social'} link`}
                            className={`text-muted-foreground ${social.hoverClass} transition-all relative group/icon`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <social.Icon className="h-4 w-4 transform group-hover/icon:-translate-y-1 transition-transform" />
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-0 group-hover/icon:opacity-60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </footer>
                
                <LoadTransition />
              </Suspense>
            </div>
            <Toaster />
          </ConvexProvider>
        </ThemeProvider>
        <Analytics />
        
        {/* Script to remove the static loader once React has hydrated */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Hide static loader after React hydrates
            setTimeout(function() {
              document.body.classList.add('loaded');
            }, 500);
          `
        }} />
      </body>
    </html>
  );
}