"use client";

import { Suspense, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Globe, Layers, Sparkles, Wind, Leaf, ExternalLink, Github } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import InitialLoader from '@/components/loaders/initial-loader';
import { cn } from '@/lib/utils';
import { useTheme } from "next-themes";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Loading fallback
function LoadingFallback() {
  return null; // No need for a duplicate loader since InitialLoader is now global
}

// Animated Nature Background
function GhibliBackground({ mounted }: { mounted: boolean }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [bgStyle, setBgStyle] = useState({});
  
  // Use useEffect to set style on client side only to avoid hydration mismatch
  useEffect(() => {
    setBgStyle({
      background: isDark 
        ? 'linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)' 
        : 'linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 100%)'
    });
  }, [isDark]);
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={bgStyle}
      />
      
      {/* Mountains in background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 ghibli-mountains-bg" />
      
      {/* Clouds */}
      {mounted && !isDark && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute bg-white/90 rounded-[50%]"
              animate={{
                x: ["-10%", "110%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 120 + i * 30,
                ease: "linear",
                delay: i * 10,
              }}
              style={{
                width: 180 + i * 40,
                height: 80 + i * 20,
                top: 50 + i * 100,
                filter: "blur(8px)",
                opacity: 0.6 + i * 0.08,
              }}
            />
          ))}
        </>
      )}
      
      {/* Stars */}
      {mounted && isDark && (
        <>
          {[...Array(100)].map((_, i) => {
            const size = Math.random() * 3 + 1;
            return (
              <motion.div
                key={`star-${i}`}
                className="absolute bg-white rounded-full"
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                style={{
                  width: size,
                  height: size,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                }}
              />
            );
          })}
          
          {/* Moon */}
          <div
            className="absolute w-24 h-24 rounded-full"
            style={{
              top: '15%',
              right: '15%',
              background: 'radial-gradient(circle, rgba(226,232,240,1) 0%, rgba(226,232,240,0.7) 60%, rgba(226,232,240,0) 100%)',
              boxShadow: '0 0 40px 10px rgba(226,232,240,0.3)',
            }}
          />
        </>
      )}
      
      {/* Forest silhouette at bottom */}
      <div className="ghibli-forest-bg" />
      
      {/* Floating spirits/dust */}
      {mounted && (
        <>
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 6 + 2;
            const isSpirit = i % 8 === 0;
            return (
              <motion.div
                key={`dust-${i}`}
                className={cn(
                  "absolute rounded-full",
                  isSpirit ? "ghibli-lantern" : "ghibli-dust"
                )}
                animate={{
                  y: [0, -40, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: isSpirit ? [0.6, 0.9, 0.6] : [0.1, 0.5, 0.1],
                }}
                transition={{
                  duration: 10 + Math.random() * 20,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
                style={{
                  width: isSpirit ? size * 2 : size,
                  height: isSpirit ? size * 2 : size,
                  left: `${Math.random() * 100}%`,
                  bottom: `${Math.random() * 30}%`,
                  filter: isSpirit ? "blur(1px)" : "blur(0px)",
                }}
              />
            );
          })}
        </>
      )}
      
      {/* Sun/Rays */}
      {mounted && !isDark && (
        <div
          className="absolute hidden md:block"
          style={{
            top: '15%',
            left: '15%',
          }}
        >
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(252,211,77,1) 0%, rgba(252,211,77,0.7) 60%, rgba(252,211,77,0) 100%)',
                boxShadow: '0 0 60px 15px rgba(252,211,77,0.4)',
              }}
            />
            <div className="absolute inset-0 animate-spin-slow">
              {[...Array(12)].map((_, i) => (
                <div
                  key={`ray-${i}`}
                  className="absolute top-1/2 left-1/2 w-1 bg-yellow-300/20"
                  style={{
                    height: 200 + (i % 3) * 30,
                    transform: `rotate(${i * 30}deg) translateX(16px)`,
                    transformOrigin: '0 0',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Totoro Character (simple version)
function TotoroCharacter({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="w-full h-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        {/* Totoro body */}
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 w-full h-[90%] bg-gray-600 rounded-[50%]" />
          
          {/* Belly */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[50%] bg-gray-300 rounded-[50%]" />
          
          {/* Eyes */}
          <div className="absolute top-[25%] left-[30%] w-[10%] h-[10%] bg-white rounded-full">
            <div className="absolute inset-[25%] bg-black rounded-full" />
          </div>
          <div className="absolute top-[25%] right-[30%] w-[10%] h-[10%] bg-white rounded-full">
            <div className="absolute inset-[25%] bg-black rounded-full" />
          </div>
          
          {/* Nose */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[10%] h-[5%] bg-black rounded-full" />
          
          {/* Ears */}
          <div className="absolute top-[5%] left-[25%] w-[12%] h-[15%] bg-gray-600 rounded-[50%]" />
          <div className="absolute top-[5%] right-[25%] w-[12%] h-[15%] bg-gray-600 rounded-[50%]" />
        </div>
      </motion.div>
      
      {/* Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-[10%] bg-black/20 rounded-[50%] blur-sm" />
    </div>
  );
}

// Leaf component
function FallingLeaf({ delay, scale = 1 }: { delay: number, scale?: number }) {
  return (
    <motion.div
      className="absolute text-secondary/60"
      initial={{ top: "-10%", rotate: 0 }}
      animate={{ 
        top: "110%",
        rotate: 360,
        x: [0, 30, -30, 20, -20, 0],
      }}
      transition={{ 
        repeat: Infinity,
        duration: 20 + Math.random() * 10,
        repeatDelay: 0,  // Add this to fix animation restart issues
        delay,
        ease: "linear",
      }}
      style={{
        left: `${Math.random() * 100}%`,
        transform: `scale(${scale})`,
      }}
    >
      <Leaf size={20} />
    </motion.div>
  );
}

// Photo Frame Component
interface PhotoFrameProps {
  src?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

function GhibliPhotoFrame({ 
  src, 
  alt, 
  className, 
  priority = false 
}: PhotoFrameProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <motion.div 
      className={cn("relative perspective-1000", className)} 
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="ghibli-photo-frame h-full w-full">
        <div className="ghibli-photo-inner h-full w-full min-h-[200px]">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">Image not found</span>
            </div>
          ) : (
            <div className="relative w-full h-full min-h-[200px]">
              <Image 
                src={src || "/placeholder-image.jpg"} 
                alt={alt || "Profile photo"}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover w-full h-full"
                priority={priority}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJcAPoIJG3hgAAAABJRU5ErkJggg=="
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <motion.div
        className="absolute -top-3 -right-3 w-10 h-10 text-accent hidden sm:block"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
        </svg>
      </motion.div>
      
      <div className="totoro-shadow"></div>
    </motion.div>
  );
}

// Card that looks like a paper/scroll
interface GhibliPaperCardProps {
  children: React.ReactNode;
  className?: string;
}

function GhibliPaperCard({ children, className }: GhibliPaperCardProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Card background with paper texture */}
      <div
        className="absolute inset-0 rounded-lg opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative ghibli-card p-4 sm:p-6 backdrop-blur-sm">
        {children}
      </div>
      
      {/* Decorative border corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/30 rounded-tl-md"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/30 rounded-tr-md"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/30 rounded-bl-md"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/30 rounded-br-md"></div>
    </div>
  );
}

// Animated section title
interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

function AnimatedSectionTitle({ title, subtitle }: { 
  title: string, 
  subtitle?: string 
}) {
  return (
    <motion.div 
      className="relative pb-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-3xl md:text-5xl font-bold mb-4 inline-block">
        <span className="relative">
          <span className="text-ghibli-gradient">{title}</span>
          <motion.span
            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </span>
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const headerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
    // Fetch data from Convex backend
  const featuredProjects = useQuery(api.projects.getFeatured) || [];
  const aboutData = useQuery(api.about.get);
  
  // Parallax effects
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  
  // Header animations
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
    
    // Fix scrollbar issue
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.documentElement.style.overflowX = '';
      document.body.style.overflowX = '';
    };
  }, []);

  // Fix falling leaves to avoid hydration issues
  const renderFallingLeaves = () => {
    if (!mounted) return null;
    
    return [...Array(typeof window !== 'undefined' && window.innerWidth > 768 ? 8 : 4)].map((_, i) => (
      <FallingLeaf key={i} delay={i * 2} scale={0.8 + Math.random() * 0.4} />
    ));
  };

  // Get proper grid layout based on number of projects
  const getProjectsGridLayout = () => {
    // Instead of applying complex column spans, we'll use a simpler approach
    if (featuredProjects.length === 0) return "grid-cols-1";
    if (featuredProjects.length === 1) return "grid-cols-1";
    if (featuredProjects.length === 2) return "grid-cols-1 sm:grid-cols-2";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  // Add an easter egg interaction
  const [magicCounter, setMagicCounter] = useState(0);
  const [magicActivated, setMagicActivated] = useState(false);
  
  // Handle special easter egg when clicking on Totoro
  const handleTotoroClick = () => {
    setMagicCounter(prev => {
      const newCount = prev + 1;
      if (newCount >= 3 && !magicActivated) {
        // Trigger magic animation after 3 clicks
        setMagicActivated(true);
        // Reset after 5 seconds
        setTimeout(() => setMagicActivated(false), 5000);
      }
      return newCount % 10; // Reset counter after 10
    });
  };

  return (
    <main className="relative">
      
      {/* Special magical dust overlay that appears on Easter egg activation */}
      {magicActivated && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={`magic-dust-${i}`}
              className="absolute w-2 h-2 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                y: [null, Math.random() * -600],
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 2 + 0.5, 0],
                filter: "blur(0px)"
              }}
              transition={{ 
                duration: 4 + Math.random() * 3,
                ease: "easeOut" 
              }}
              style={{
                background: `radial-gradient(circle, ${
                  ['#ff9d00', '#ff4d94', '#7b2ff7', '#0fffc1'][Math.floor(Math.random() * 4)]
                } 0%, rgba(255,255,255,0) 70%)`,
                boxShadow: `0 0 8px ${
                  ['#ff9d00', '#ff4d94', '#7b2ff7', '#0fffc1'][Math.floor(Math.random() * 4)]
                }`
              }}
            />
          ))}
        </div>
      )}
      
      <Suspense fallback={<LoadingFallback />}>
        {/* Hero header with parallax effect */}
        <motion.header 
          ref={headerRef}
          className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20 pb-16 md:pb-20 overflow-hidden"
          style={{
            opacity: headerOpacity,
            scale: headerScale,
          }}
        >
          {/* Animated Ghibli Background */}
          <GhibliBackground mounted={mounted} />
          
          {/* Foreground content (moves faster for parallax effect) */}
          <motion.div 
            className="container relative z-10 px-4 sm:px-6"
            style={{ y: foregroundY }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
              {/* Main content */}
              <motion.div 
                className="flex-1 text-center lg:text-left mt-8 md:mt-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Decorative elements */}
                <div className="hidden lg:block absolute -top-10 -left-10">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -5, 0],
                      y: [0, -10, 5, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                    }}
                  >
                    <svg width="60" height="60" viewBox="0 0 24 24" className="text-accent opacity-70">
                      <path fill="currentColor" d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
                    </svg>
                  </motion.div>
                </div>
                
                {/* Hero heading with hand-drawn underline */}
                <div className="relative mb-6">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-2 tracking-tight">
                    <span className="block">Creating</span>
                    <span className="text-ghibli-gradient">Magical Digital Worlds</span>
                  </h1>
                  <div className="relative">
                    <svg className="absolute -bottom-2 left-0 w-full text-secondary/30" height="8" viewBox="0 0 200 8">
                      <path d="M0,5 C50,0 150,0 200,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                
                <p className="text-base sm:text-lg lg:text-xl mb-6 max-w-xl mx-auto lg:mx-0">
                  I blend artistry with technology to build enchanting websites that captivate
                  users and transport them to imaginative digital realms.
                </p>
                
                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6 md:mt-8">                  {aboutData?.resumeUrl ? (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <a 
                        href={aboutData.resumeUrl}
                        download
                        className="inline-flex items-center justify-center ghibli-button w-full sm:w-auto h-12 px-6"
                      >
                        View My Resume
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </motion.div>
                  ) : (
                    <Link href="/about">
                      <Button size="lg" className="ghibli-button w-full sm:w-auto h-12 px-6">
                        About Me
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href="/contact">
                    <Button variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/10 w-full sm:w-auto h-12 px-6">
                      Let's Connect
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              {/* Hero visual - Totoro or your profile - Fixed for mobile visibility */}
              <motion.div 
                className="flex-1 flex justify-center w-full mt-8 lg:mt-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[350px] sm:h-[420px] md:h-[480px]">
                  {/* Character illustration - Now visible on all devices */}
                  <div 
                    className="absolute -top-10 -left-5 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 z-10 cursor-pointer block" 
                    onClick={handleTotoroClick}
                  >
                    <TotoroCharacter className="w-full h-full" />
                    
                    {/* Easter egg hover hint */}
                    <motion.div 
                      className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-center w-24 bg-primary/10 backdrop-blur-sm px-2 py-1 rounded-full opacity-0"
                      animate={{ opacity: magicCounter > 0 && magicCounter < 3 ? 1 : 0 }}
                    >
                      {3 - magicCounter} more clicks for magic!
                    </motion.div>
                  </div>
                  
                  {/* Photo frame - improved for mobile */}
                  <GhibliPhotoFrame 
                    src="/placeholder-image.jpg" 
                    alt="Your Name"
                    priority
                    className="w-full h-full shadow-lg" 
                  />
                  
                  {/* Floating elements - now visible on mobile too */}
                  <motion.div
                    className="absolute -bottom-10 -right-5 w-16 h-16 block"
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="text-secondary/70 w-full h-full">
                      <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 10,5.25 17,8Z" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
              
            </div>
          </motion.div>
          
          {/* Falling leaves */}
          {renderFallingLeaves()}
          
          {/* Elegant scroll indicator */}
          <motion.div 
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2"
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm mb-2 opacity-70">Scroll to explore</p>
              <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-primary/50 flex items-center justify-center">
                <motion.div 
                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary"
                  animate={{
                    y: [0, 12, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.header>
        
        {/* About/Bio section - Modern, clean, responsive redesign */}
        <section className="py-16 md:py-28 bg-background relative overflow-hidden">
          {/* Soft accent background shape */}
          <div className="absolute -top-24 -left-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-3xl pointer-events-none z-0" />
          <div className="absolute -bottom-32 -right-32 w-[380px] h-[380px] rounded-full bg-accent/10 blur-3xl pointer-events-none z-0" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimatedSectionTitle 
              title="The Story Behind the Magic"
              subtitle="A glimpse into my journey and creative philosophy"
            />
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10 md:gap-16 mt-12 md:mt-20">
              {/* Accent Illustration or Photo */}
              <motion.div
                className="flex-shrink-0 flex items-center justify-center w-full md:w-auto"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="relative">
                  <div className="rounded-full bg-card shadow-lg border-4 border-primary/20 w-40 h-40 md:w-56 md:h-56 flex items-center justify-center overflow-hidden">
                    {/* Replace with your photo if desired */}
                    <TotoroCharacter className="w-32 h-32 md:w-44 md:h-44" />
                  </div>
                  {/* Decorative accent ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-pulse-slow pointer-events-none" />
                </div>
              </motion.div>
              {/* Bio Card */}
              <motion.div
                className="w-full md:flex-1 flex flex-col justify-center bg-card/90 rounded-2xl shadow-xl px-6 py-8 md:px-10 md:py-12"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Weaving Digital Dreams</h3>
                <p className="text-base md:text-lg text-muted-foreground mb-6">
                  I’m a web developer and designer inspired by the enchanting worlds of Studio Ghibli.
                  My work blends artistry and technology to create digital experiences that are both magical and meaningful.
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-sm md:text-base">Creative Vision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-secondary" />
                    <span className="text-sm md:text-base">Technical Craft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-accent" />
                    <span className="text-sm md:text-base">Adaptive Solutions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    <span className="text-sm md:text-base">Growth Mindset</span>
                  </div>
                </div>
                <div>
                  <Link href="/about">
                    <Button className="rounded-full bg-gradient-to-r from-primary to-secondary text-white px-6 h-12 shadow-md hover:scale-105 transition-transform">
                      Continue My Story
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Services section - Fixed dark color issue */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Magical background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90"></div>
          
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Background decorative elements */}
            <div className="ghibli-mountains-bg opacity-30" />
            
            {/* Floating spirits */}
            {mounted && (
              <>
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={`float-${i}`}
                    className="absolute rounded-full bg-white/30"
                    animate={{
                      y: [0, -30, 0],
                      x: [0, Math.random() * 20 - 10, 0],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 10 + Math.random() * 10,
                      repeat: Infinity,
                      delay: i * 0.7,
                    }}
                    style={{
                      width: 5 + Math.random() * 10,
                      height: 5 + Math.random() * 10,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      filter: "blur(1px)",
                    }}
                  />
                ))}
              </>
            )}
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimatedSectionTitle 
              title="Creative Journey" 
              subtitle="Let's craft experiences beyond the ordinary"
            />
            
            {/* Add floating illustrations around services - made responsive for mobile */}
            <div className="absolute inset-0 pointer-events-none">
              {mounted && (
                <>
                  {/* Floating code brackets */}
                  <motion.div
                    className="absolute text-primary/30 text-4xl sm:text-6xl font-mono"
                    style={{ right: '5%', top: '30%' }}
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  >
                    {`{}`}
                  </motion.div>
                  
                  {/* Floating paintbrush */}
                  <motion.div
                    className="absolute"
                    style={{ left: '8%', bottom: '20%' }}
                    animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" className="sm:w-10 sm:h-10 text-secondary/30">
                      <path fill="currentColor" d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21C8.21,21 10,19.21 10,17C10,15.79 9.21,14 8,14H7Z" />
                    </svg>
                  </motion.div>
                </>
              )}
            </div>
            
            {/* Responsive grid layout with better mobile spacing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-8 md:mt-12">
              {/* Service cards - now with responsive icon size and text */}
              <motion.div
                className="group relative service-card-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-xl transform group-hover:scale-105 transition-transform duration-300 origin-bottom" />
                
                <div className="relative bg-background/40 backdrop-blur-sm rounded-xl border border-primary/10 overflow-hidden p-5 md:p-8 transition-all duration-300 h-full flex flex-col">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                    <div className="w-full h-full" style={{ 
                      backgroundImage: "url('/images/pattern-house.svg')", 
                      backgroundSize: "900px",
                      backgroundPosition: "center", 
                      backgroundRepeat: "repeat"
                    }}></div>
                  </div>
                  
                  <div className="relative">
                    <div className="rounded-full bg-primary/10 p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6 overflow-hidden group-hover:bg-primary/20 transition-colors duration-300">
                      <Globe className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full">
                        <div className="w-full h-full animate-pulse-slow"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors">Crafting Digital Homes</h3>
                    
                    <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                      Your digital presence should feel both comfortable and captivating—like the homey cottages in "My Neighbor Totoro." I build websites that welcome visitors with warmth while showcasing your unique story.
                    </p>
                    
                    {/* Responsive tag layout */}
                    <div className="mt-auto flex flex-wrap gap-1.5 md:gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Responsive Design</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">SEO Optimized</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Performance</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-secondary/5 to-transparent rounded-xl transform group-hover:scale-105 transition-transform duration-300 origin-bottom" />
                
                <div className="relative bg-background/40 backdrop-blur-sm rounded-xl border border-secondary/10 overflow-hidden p-6 md:p-8 transition-all duration-300 h-full flex flex-col">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                    <div className="w-full h-full" style={{ 
                      backgroundImage: "url('/images/pattern-wave.svg')", 
                      backgroundSize: "900px",
                      backgroundPosition: "center", 
                      backgroundRepeat: "repeat"
                    }}></div>
                  </div>
                  
                  <div className="relative">
                    <div className="rounded-full bg-secondary/10 p-4 w-16 h-16 flex items-center justify-center mb-6 overflow-hidden group-hover:bg-secondary/20 transition-colors duration-300">
                      <Layers className="h-8 w-8 text-secondary" />
                      <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full">
                        <div className="w-full h-full animate-pulse-slow"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">Interactive Storytelling</h3>
                    
                    <p className="text-muted-foreground mb-6">
                      Like the moving castle in Howl's world, your website should surprise and delight visitors. I create fluid interactions and meaningful animations that guide users through your story with a sense of wonder.
                    </p>
                    
                    <div className="mt-auto flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">Animations</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">UI/UX Design</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">Interactions</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Code Craftsmanship */}
              <motion.div
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-accent/5 to-transparent rounded-xl transform group-hover:scale-105 transition-transform duration-300 origin-bottom" />
                
                <div className="relative bg-background/40 backdrop-blur-sm rounded-xl border border-accent/10 overflow-hidden p-6 md:p-8 transition-all duration-300 h-full flex flex-col">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                    <div className="w-full h-full" style={{ 
                      backgroundImage: "url('/images/pattern-code.svg')", 
                      backgroundSize: "900px",
                      backgroundPosition: "center", 
                      backgroundRepeat: "repeat"
                    }}></div>
                  </div>
                  
                  <div className="relative">
                    <div className="rounded-full bg-accent/10 p-4 w-16 h-16 flex items-center justify-center mb-6 overflow-hidden group-hover:bg-accent/20 transition-colors duration-300">
                      <Code className="h-8 w-8 text-accent" />
                      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full">
                        <div className="w-full h-full animate-pulse-slow"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-accent transition-colors">Code Craftsmanship</h3>
                    
                    <p className="text-muted-foreground mb-6">
                      With the meticulous care of Porco Rosso maintaining his aircraft, I write code that's elegant beneath the surface—clean, efficient, and built to last, ensuring your digital presence stands strong and adaptable.
                    </p>
                    
                    <div className="mt-auto flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">Clean Code</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">Accessibility</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">Maintenance</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Services call to action */}
            <motion.div 
              className="mt-16 text-center" 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Link href="/services">
                <Button variant="outline" className="rounded-full border-primary/30 group hover:border-primary">
                  Explore All Services
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Portfolio preview section - Updated to show actual projects with better responsive layout */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent h-40" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimatedSectionTitle 
              title="Featured Projects" 
              subtitle="A glimpse into the worlds I've created"
            />
            
            <div className={`grid ${getProjectsGridLayout()} gap-6 md:gap-8 mt-12`}>
              {featuredProjects.length === 0 ? (
                // Show placeholder when no projects are available
                <div className="col-span-full text-center py-16">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="inline-flex flex-col items-center"
                  >
                    <Code className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Projects Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      I'm currently working on some magical projects to showcase here.
                      Please check back soon!
                    </p>
                    <Link href="/projects">
                      <Button variant="outline" className="rounded-full border-primary/30">
                        View All Projects
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              ) : (
                // Display actual featured projects from backend with responsive layout
                featuredProjects.slice(0, 3).map((project, i) => (
                  <motion.div 
                    key={project._id}
                    className="group relative project-card-container"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                  >
                    <Link href={`/projects?project=${project._id}`} className="block">
                      {/* Add decorative corner accents that appear on hover */}
                      <div className="absolute top-0 left-0 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-primary/50">
                          <path d="M0,0 L100,0 L100,20 C40,20 20,40 20,100 L0,100 L0,0 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 rotate-180">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-primary/50">
                          <path d="M0,0 L100,0 L100,20 C40,20 20,40 20,100 L0,100 L0,0 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      
                      {/* Rest of the project card */}
                      <div className="ghibli-photo-frame p-2 mx-auto max-w-md sm:max-w-full enhanced-hover">
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                          {project.image ? (
                            <div className="relative w-full h-full">
                              <Image 
                                src={project.image} 
                                alt={project.title}
                                fill
                                sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                                className="object-cover transition-all duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  if (target) target.style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 flex items-center justify-center">
                              <span className="text-xl font-bold opacity-70">{project.title}</span>
                            </div>
                          )}
                          
                          {/* Category tag */}
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded">
                            {project.category}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies?.slice(0, 3).map((tech, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies?.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-primary group-hover:text-secondary transition-colors">
                              <span>View Project</span>
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                            
                            {project.githubUrl && (
                              <a 
                                href={project.githubUrl}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors p-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Show "View All" button only if there are projects */}
            {featuredProjects.length > 0 && (
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <Link href="/projects">
                  <Button variant="outline" className="rounded-full border-primary/30">
                    View All Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>
        
        {/* Quick links to other pages */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 ghibli-forest-bg opacity-30" />
          
          <div className="container relative z-10">
            <AnimatedSectionTitle 
              title="Continue the Journey" 
              subtitle="Explore the different chapters of my story"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {[
                { 
                  title: "About Me",
                  description: "Learn more about my journey and creative philosophy",
                  href: "/about",
                  color: "from-primary/20 to-secondary/20",
                  icon: <motion.div 
                    animate={{ rotate: [0, 10, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="text-primary/70"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,8.39C13.57,9.4 15.42,10 17.42,10C18.2,10 18.95,9.91 19.67,9.74C19.88,10.45 20,11.21 20,12C20,16.41 16.41,20 12,20C9,20 6.39,18.34 5,15.89L6.75,14V13A1.25,1.25 0 0,1 8,11.75A1.25,1.25 0 0,1 9.25,13V14H12M16,11.75A1.25,1.25 0 0,0 14.75,10.5A1.25,1.25 0 0,0 13.5,11.75A1.25,1.25 0 0,0 14.75,13A1.25,1.25 0 0,0 16,11.75Z" />
                    </svg>
                  </motion.div>
                },
                { 
                  title: "Projects",
                  description: "Explore the magical projects I've created",
                  href: "/projects",
                  color: "from-secondary/20 to-accent/20",
                  icon: <motion.div 
                    animate={{ rotate: [0, -10, 5, 0] }}
                    transition={{ duration: 7, repeat: Infinity }}
                    className="text-secondary/70"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path d="M17,22A2,2 0 0,1 15,20V8H17V20H21V22H17M7,16V14H13V16H7M7,8H13V10H7V8M7,12H13V14H7V12M7,4H13V6H7V4H3V20H7V22H3A2,2 0 0,1 1,20V4A2,2 0 0,1 3,2Z" />
                    </svg>
                  </motion.div>
                },
                { 
                  title: "Services",
                  description: "Discover how my skills can enhance your vision",
                  href: "/services",
                  color: "from-accent/20 to-primary/20",
                  icon: <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="text-accent/70"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path d="M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M11,18H13V15.87C14.73,15.43 16,13.86 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12C8,13.86 9.27,15.43 11,15.87V18Z" />
                    </svg>
                  </motion.div>
                },
                { 
                  title: "Contact Me",
                  description: "Begin our creative collaboration",
                  href: "/contact",
                  color: "from-secondary/20 to-primary/20",
                  icon: <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-primary/70"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path d="M17,12L12,17V14H8V10H12V7L17,12M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15Z" />
                    </svg>
                  </motion.div>
                }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link href={item.href} className="block group">
                    <div className="relative h-full transition-all duration-300">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-300`} />
                      <div className="relative h-full ghibli-card flex p-6">
                        <div className="mr-6">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-4">{item.description}</p>
                          <div className="flex items-center text-primary group-hover:text-secondary transition-colors">
                            <span>Explore</span>
                            <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Suspense>

      {/* Add animation styles with improved dark mode compatibility */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        @keyframes float-spirits {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        .animate-float-spirits {
          animation: float-spirits 8s ease-in-out infinite;
        }

        /* Better mobile styling */
        @media (max-width: 640px) {
          .ghibli-photo-frame {
            display: block !important;
            width: 100% !important;
            max-width: 280px !important;
            margin: 0 auto;
          }
          
          /* Fix mobile text sizing */
          h1 {
            font-size: 2rem !important;
            line-height: 1.2 !important;
          }
          
          h2 {
            font-size: 1.75rem !important;
          }
          
          .prose {
            font-size: 0.95rem !important;
          }
          
          section {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Improve padding for small screens */
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          /* Better mobile scrolling performance by reducing animations */
          .ghibli-mountains-bg, 
          .ghibli-forest-bg {
            opacity: 0.15 !important;
          }
          
          /* Optimize mobile touch targets */
          button, .button, a.button {
            min-height: 44px;
          }
          
          /* Adjust photo frame for better mobile display */
          .ghibli-photo-inner {
            min-height: 280px !important;
          }
        }
        
        /* Add desktop optimizations */
        @media (min-width: 1024px) {
          .hero-content {
            max-width: 70%;
            margin: 0 auto;
          }
          
          /* Improved desktop view for services and project cards */
          .ghibli-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .ghibli-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        }
        
        /* Fix perspective property for all browsers */
        .perspective-1000 {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        
        /* Fix totoro shadow for better mobile display */
        .totoro-shadow {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          height: 8px;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          filter: blur(3px);
        }
        
        /* Improve text gradient appearance across devices */
        .text-ghibli-gradient {
          background: linear-gradient(to right, #3b82f6, #6d28d9);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline;
        }
        
        /* Better touch experience */
        @media (hover: none) {
          .ghibli-button:active {
            transform: scale(0.98);
          }
        }

        /* Project card sizing improvements */
        .ghibli-photo-frame {
          width: 100%;
          height: 100%;
          max-width: 450px;
          margin: 0 auto;
        }
        
        /* Media queries for responsive projects */
        @media (max-width: 640px) {
          .ghibli-photo-frame {
            max-width: 100%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        /* Paper fold effect - Fixed dark mode compatibility */
        .paper-with-fold {
          position: relative;
          overflow: visible;
        }
        
        .paper-with-fold::after {
          content: '';
          position: absolute;
          top: -2px;
          right: -2px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 16px 16px 0;
          border-color: transparent var(--card) transparent transparent;
          filter: drop-shadow(-2px 2px 2px rgba(0,0,0,0.1));
          z-index: 20;
        }
        
        /* Fix for dark mode paper fold */
        :root.dark .paper-with-fold::after {
          border-color: transparent var(--card) transparent transparent;
        }
        
        /* Fix dark mode corner fold contrast */
        :root.dark .relative > .absolute.bg-card.rotate-45 {
          background-color: hsl(var(--card));
        }

        /* Enhanced paper fold effect - more visible in all themes */
        .paper-with-fold {
          position: relative;
          overflow: visible;
        }
        
        /* Explicitly use border for fold effect instead of pseudo-element */
        .paper-with-fold::after {
          content: '';
          position: absolute;
          top: -2px;
          right: -2px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 20px 20px 0;
          border-color: transparent var(--card);
          filter: drop-shadow(-2px 2px 2px rgba(0,0,0,0.1));
          z-index: 30;
        }
        
        /* Add highlight to the fold */
        .paper-with-fold::before {
          content: '';
          position: absolute;
          top: -3px;
          right: -3px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 21px 21px 0;
          border-color: transparent rgba(var(--primary-rgb), 0.1) transparent transparent;
          z-index: 29;
        }
        
        /* Fix for dark mode paper fold */
        :root.dark .paper-with-fold::after {
          border-color: transparent hsl(var(--card));
          filter: drop-shadow(-1px 1px 3px rgba(0,0,0,0.2));
        }
        
        /* Enhance the folded corner shadow */
        .relative > .absolute.rotate-45 {
          box-shadow: -5px 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        :root.dark .relative > .absolute.rotate-45 {
          background-color: hsl(var(--card));
          box-shadow: -5px 5px 15px rgba(0, 0, 0, 0.3);
        }

        /* Enhanced project card hover */
        .enhanced-hover {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .project-card-container:hover .enhanced-hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        
        /* Special sparkle animation */
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        .sparkle {
          position: absolute;
          pointer-events: none;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          z-index: 100;
          animation: sparkle 1.5s ease-in-out;
        }
        
        /* Add subtly animated background */
        .animated-bg-grain {
          position: fixed;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          width: 200%;
          height: 200vh;
          background: transparent url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg'%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3C/rect width="100%" height="100%" filter="url(%23noise)" opacity="0.015"/%3E%3C/svg%3E');
          background-repeat: repeat;
          animation: grain 8s steps(10) infinite;
          opacity: 0.15;
          pointer-events: none;
          z-index: 1;
        }
        
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); }
          50% { transform: translate(12%, 9%); }
          70% { transform: translate(9%, 4%); }
          90% { transform: translate(-1%, 7%); }
        }
        
        /* Additional hover effect for service cards */
        .service-card-border {
          position: relative;
          overflow: hidden;
        }
        
        .service-card-border::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          transform: translateX(-100%);
          transition: transform 0.8s ease;
        }
        
        .service-card-border:hover::before {
          transform: translateX(100%);
        }

        /* New hover lift effect for paper card */
        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) rotateX(2deg);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.05);
        }
        
        /* New perspective for 3D effects */
        .perspective-1200 {
          perspective: 1200px;
        }
        
        /* Glow effect for central circle */
        .glow-circle {
          background: radial-gradient(circle, var(--primary) 0%, rgba(255,255,255,0) 70%);
          filter: blur(6px);
        }
        
        /* Interactive circle effects */
        .ghibli-circle {
          transition: all 0.3s ease;
          box-shadow: 0 0 0 rgba(var(--primary-rgb), 0);
        }
        
        .ghibli-circle:hover {
          box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3);
        }
        
        /* New animations */
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
        
        /* First letter styling for enhanced typography */
        .first-letter\:text-3xl:first-letter {
          font-size: 3rem;
          line-height: 1;
        }
      `}</style>
      
      {/* Add animated background grain texture */}
      <div className="animated-bg-grain"></div>
      
      {/* Add click effect script */}
      {mounted && (
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('click', function(e) {
              // Create sparkle effect on click
              if (!document.querySelector('.loading')) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = e.pageX + 'px';
                sparkle.style.top = e.pageY + 'px';
                sparkle.style.width = '10px';
                sparkle.style.height = '10px';
                document.body.appendChild(sparkle);
                
                // Remove after animation completes
                setTimeout(() => {
                  if (sparkle && sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                  }
                }, 1500);
              }
            });
          `
        }} />
      )}
    </main>
  );
}