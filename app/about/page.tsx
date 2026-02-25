"use client";

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles, Wind, Code, HeartHandshake, Award, GraduationCap, Briefcase, FileDown, Leaf, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import GitHubStats from '@/components/github-stats';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from 'lucide-react';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  
  // Fetch about data from Convex
  const aboutData = useQuery(api.about.get);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while fetching data
  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading magical content...</p>
        </div>
      </div>
    );
  }

  // Extract data from the response
  const { bio, education, experience, awards, skills } = aboutData;

  return (
    <main className="relative overflow-x-hidden">
      <Suspense fallback={<div className="min-h-screen bg-background"></div>}>
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/90" />
          
          {/* Floating elements - only render on client */}
          {mounted && (
            <>
              {/* Magic dust particles */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={`dust-${i}`}
                  className="absolute rounded-full bg-primary/20"
                  initial={{ 
                    left: `${Math.random() * 100}%`, 
                    top: `${Math.random() * 100}%`,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 10,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    width: 2 + Math.random() * 4,
                    height: 2 + Math.random() * 4,
                    filter: "blur(1px)",
                  }}
                />
              ))}
              
              {/* Ghibli-inspired decorative elements - replacing square boxes */}
              {/* Floating Totoro-inspired cloud */}
              <motion.div
                className="absolute w-96 h-60 top-[5%] right-[-10%]"
                animate={{ 
                  y: [0, -15, 0],
                  x: [0, 8, 0],
                  rotate: [0, 1, 0, -1, 0],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{ 
                  y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 8, repeat: Infinity },
                }}
              >
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path 
                    d="M50,30 Q75,10 100,30 T150,30 Q175,10 190,40 T150,70 Q125,90 100,70 T50,70 Q25,90 10,60 T50,30" 
                    fill="url(#cloudGradient)" 
                    stroke="hsl(var(--primary) / 0.2)" 
                    strokeWidth="1"
                  />
                  <defs>
                    <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--secondary) / 0.1)" />
                      <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              
              {/* Leaf-inspired element - Ghibli style */}
              <motion.div
                className="absolute bottom-[15%] left-[-5%] w-80 h-80"
                animate={{ 
                  rotate: [-2, 2, -2],
                  y: [0, -10, 0],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 7, repeat: Infinity },
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path 
                    d="M50,10 C80,30 90,50 90,70 C90,90 70,90 50,90 C30,90 10,90 10,70 C10,50 20,30 50,10" 
                    fill="url(#leafGradient)"
                    stroke="hsl(var(--secondary) / 0.15)" 
                    strokeWidth="0.5"
                  />
                  <path 
                    d="M50,10 C50,40 50,70 50,90" 
                    fill="none" 
                    stroke="hsl(var(--secondary) / 0.2)" 
                    strokeWidth="0.5"
                  />
                  <defs>
                    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--secondary) / 0.08)" />
                      <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              
              {/* Added subtle floating orbs */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`orb-${i}`}
                  className={`absolute rounded-full bg-gradient-to-r ${
                    i % 3 === 0 ? "from-primary/20 to-primary/5" : 
                    i % 3 === 1 ? "from-secondary/20 to-secondary/5" : 
                    "from-accent/20 to-accent/5"
                  } opacity-70 backdrop-blur-md`}
                  initial={{ 
                    top: `${20 + Math.random() * 60}%`, 
                    left: `${Math.random() * 90}%`,
                    scale: 0.8 + Math.random() * 0.4
                  }}
                  animate={{
                    y: [0, -15, 0],
                    x: [0, Math.random() * 10 - 5, 0],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    width: 40 + Math.random() * 40,
                    height: 40 + Math.random() * 40,
                  }}
                />
              ))}
            </>
          )}  
        </div>
        
        {/* Page header with magical elements */}
        <section className="relative pt-40 pb-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Decorative elements */}
                  {mounted && (
                    <motion.div
                      className="absolute -top-10 -left-10 text-accent/70 hidden lg:block"
                      animate={{ rotate: [0, 10, -5, 0], scale: [1, 1.05, 0.95, 1] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
                      </svg>
                    </motion.div>
                  )}
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                      My Magical Journey
                    </span>
                    <motion.div
                      className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-6 leading-relaxed">
                    Explore the story of how I craft enchanting digital experiences 
                    that blend technology with artistic passion, inspired by the magical worlds of Studio Ghibli.
                  </p>
                </motion.div>
              </div>
              
              {/* Ghibli-inspired floating island illustration - fixed for mobile while preserving desktop */}
              <motion.div
                className="flex-1 flex justify-center mt-8 lg:mt-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Adjusted size for better mobile display while keeping desktop view */}
                <div className="relative w-full min-w-[280px] max-w-full lg:max-w-md mx-auto lg:mx-0 aspect-square">
                  {/* Fixed positioning to ensure the island fills the container */}
                  <div className="absolute inset-0 rounded-full overflow-hidden border border-primary/20 shadow-md">
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          y: [0, -10, 0]
                        }}
                        transition={{ duration: 12, repeat: Infinity }}
                        className="relative z-10 w-4/5 h-4/5"
                      >
                        {/* Ghibli-style floating island with mini castle and nature elements */}
                        <svg viewBox="0 0 240 240" className="w-full h-full">
                          {/* Sky background with gradient */}
                          <defs>
                            <radialGradient id="skyGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
                              <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
                              <stop offset="70%" stopColor="hsl(var(--secondary) / 0.1)" />
                              <stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" />
                            </radialGradient>
                            <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                            </filter>
                          </defs>
                          
                          {/* Sky circle */}
                          <circle cx="120" cy="120" r="110" fill="url(#skyGradient)" />
                          
                          {/* Floating island base */}
                          <motion.g
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            {/* Bottom clouds */}
                            <motion.path 
                              d="M60,150 C70,160 90,160 105,155 C120,160 140,160 150,155 C170,160 190,155 200,145 C180,180 80,180 60,150Z" 
                              fill="hsl(var(--secondary) / 0.2)"
                              filter="url(#cloudBlur)"
                              animate={{ 
                                d: [
                                  "M60,150 C70,160 90,160 105,155 C120,160 140,160 150,155 C170,160 190,155 200,145 C180,180 80,180 60,150Z",
                                  "M60,150 C75,162 95,158 105,155 C125,162 135,158 150,155 C165,162 185,153 200,145 C180,180 80,180 60,150Z",
                                  "M60,150 C70,160 90,160 105,155 C120,160 140,160 150,155 C170,160 190,155 200,145 C180,180 80,180 60,150Z"
                                ]
                              }}
                              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            
                            {/* Island main body */}
                            <ellipse cx="120" cy="140" rx="60" ry="25" fill="hsl(129, 60%, 30%)" />
                            <ellipse cx="120" cy="137" rx="55" ry="20" fill="hsl(129, 70%, 40%)" />
                            
                            {/* Island details - rock formations */}
                            <path d="M90,133 L85,120 L95,125 L100,115 L105,123 L110,118 Z" fill="hsl(30, 20%, 60%)" />
                            <path d="M140,130 L145,115 L150,125 L160,110 L165,130 Z" fill="hsl(30, 20%, 65%)" />
                            
                            {/* Castle/cottage on the island - Ghibli style */}
                            <g transform="translate(105, 100) scale(0.8)">
                              {/* Main building */}
                              <rect x="10" y="20" width="30" height="25" fill="hsl(33, 60%, 85%)" />
                              <polygon points="10,20 25,5 40,20" fill="hsl(0, 60%, 50%)" /> {/* Red roof */}
                              
                              {/* Tower */}
                              <rect x="35" y="15" width="15" height="30" fill="hsl(33, 60%, 80%)" />
                              <polygon points="35,15 42,0 50,15" fill="hsl(220, 70%, 60%)" /> {/* Blue tower roof */}
                              
                              {/* Windows */}
                              <rect x="15" y="25" width="7" height="7" fill="hsl(220, 70%, 70%)" />
                              <rect x="28" y="25" width="7" height="7" fill="hsl(220, 70%, 70%)" />
                              <rect x="38" y="20" width="5" height="7" fill="hsl(220, 70%, 70%)" />
                              <rect x="38" y="30" width="5" height="7" fill="hsl(220, 70%, 70%)" />
                              
                              {/* Door */}
                              <rect x="22" y="35" width="7" height="10" fill="hsl(30, 60%, 35%)" />
                              <circle cx="24" cy="40" r="1" fill="hsl(50, 100%, 70%)" />
                            </g>
                            
                            {/* Trees and vegetation */}
                            <motion.g
                              animate={{ 
                                rotate: [-2, 2, -2]
                              }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <path d="M75,130 L75,115 C75,105 85,100 85,110 C85,100 95,105 95,115 L95,120 Z" fill="hsl(150, 70%, 30%)" />
                              <circle cx="85" cy="105" r="8" fill="hsl(120, 60%, 35%)" />
                            </motion.g>
                            
                            <motion.g
                              animate={{ 
                                rotate: [2, -2, 2]
                              }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <path d="M175,125 L175,110 C175,100 165,95 165,105 C165,95 155,100 155,110 L155,115 Z" fill="hsl(150, 70%, 30%)" />
                              <circle cx="165" cy="100" r="8" fill="hsl(120, 60%, 35%)" />
                            </motion.g>
                            
                            {/* Tiny Ghibli-style soot sprites (Susuwatari) */}
                            <motion.circle 
                              cx="130" cy="120" r="2" fill="black" 
                              animate={{ y: [-2, 2, -2] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <motion.circle 
                              cx="135" cy="123" r="1.5" fill="black"
                              animate={{ y: [-1, 3, -1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            />
                            <motion.circle 
                              cx="138" cy="125" r="1.7" fill="black"
                              animate={{ y: [-2, 1, -2] }}
                              transition={{ duration: 1.7, repeat: Infinity, delay: 0.3 }}
                            />
                          </motion.g>
                          
                          {/* Flying creatures */}
                          <motion.path
                            d="M80,80 C85,75 95,85 100,80"
                            stroke="hsl(var(--primary) / 0.6)"
                            strokeWidth="1"
                            fill="none"
                            animate={{ 
                              d: [
                                "M80,80 C85,75 95,85 100,80",
                                "M80,80 C85,85 95,75 100,80",
                                "M80,80 C85,75 95,85 100,80"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          
                          <motion.path
                            d="M160,60 C165,55 175,65 180,60"
                            stroke="hsl(var(--secondary) / 0.6)"
                            strokeWidth="1"
                            fill="none"
                            animate={{ 
                              d: [
                                "M160,60 C165,55 175,65 180,60",
                                "M160,60 C165,65 175,55 180,60",
                                "M160,60 C165,55 175,65 180,60"
                              ]
                            }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                          />
                          
                          <motion.path
                            d="M120,40 C125,35 135,45 140,40"
                            stroke="hsl(var(--accent) / 0.6)"
                            strokeWidth="1"
                            fill="none"
                            animate={{ 
                              d: [
                                "M120,40 C125,35 135,45 140,40",
                                "M120,40 C125,45 135,35 140,40",
                                "M120,40 C125,35 135,45 140,40"
                              ]
                            }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
                          />
                          
                          {/* Floating clouds */}
                          <motion.path 
                            d="M40,100 C45,95 55,95 60,100 C65,90 75,90 80,100 C85,95 95,95 100,100 C95,110 45,110 40,100Z" 
                            fill="white"
                            opacity="0.5"
                            filter="url(#cloudBlur)"
                            animate={{ 
                              x: [0, 5, 0],
                              y: [-2, 2, -2]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                          />
                          
                          <motion.path 
                            d="M140,70 C145,65 155,65 160,70 C165,60 175,60 180,70 C185,65 195,65 200,70 C195,80 145,80 140,70Z" 
                            fill="white"
                            opacity="0.5"
                            filter="url(#cloudBlur)"
                            animate={{ 
                              x: [0, -5, 0],
                              y: [0, 3, 0]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                          />
                          
                          {/* Magical glow */}
                          <motion.circle 
                            cx="120" cy="120" r="110" 
                            fill="url(#skyGradient)"
                            opacity="0.2"
                            animate={{ 
                              opacity: [0.2, 0.4, 0.2],
                              r: [110, 112, 110]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Orbiting elements */}
                  {mounted && (
                    <>
                      <motion.div
                        className="absolute w-full h-full left-0 top-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      >
                        <motion.div 
                          className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Sparkles className="w-4 h-4 text-primary" />
                        </motion.div>
                      </motion.div>
                      
                      <motion.div
                        className="absolute w-full h-full left-0 top-0"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      >
                        <motion.div 
                          className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        >
                          <Code className="w-4 h-4 text-secondary" />
                        </motion.div>
                      </motion.div>
                      
                      <motion.div
                        className="absolute w-full h-full left-0 top-0"
                        animate={{ rotate: 240 }}
                        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                      >
                        <motion.div 
                          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 3.5, repeat: Infinity }}
                        >
                          <HeartHandshake className="w-4 h-4 text-accent" />
                        </motion.div>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Link href="#my-story" scroll={false}>
              <div className="flex flex-col items-center">
                <p className="text-sm mb-2 opacity:70">Scroll to discover</p>
                <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center">
                  <motion.div 
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{
                      y: [0, 12, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
              
        {/* My story section with enhanced design */}
        <section className="py-24 relative">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Profile image with magical frame */}
              <motion.div
                className="lg:col-span-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  <motion.div
                    className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 mix-blend-overlay z-10" />
                    
                    {/* Replace with your actual profile image */}
                    <div className="aspect-[4/5] relative w-full bg-muted">
                      <Image 
                        src="/img-about.jpg" // Replace with your actual image path
                        alt="Profile Image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 500px"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJcAPoIJG3hgAAAABJRU5ErkJggg=="
                        onError={(e) => {
                          // Fallback for image error
                          const target = e.target as HTMLImageElement;
                          if (target) target.style.display = 'none';
                        }}
                      />
                    </div>
                    
                    {/* Magical glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-50"
                      animate={{ opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  {/* Decorative elements */}
                  {mounted && (
                    <>
                      <motion.div
                        className="absolute -top-6 -right-6 w-12 h-12 text-secondary"
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1], 
                        }}
                        transition={{
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 3, repeat: Infinity }
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,2L14.2,6.6L19.2,7L15.4,10.4L16.2,15.5L12,12.9L7.8,15.5L8.6,10.4L4.8,7L9.8,6.6L12,2Z" />
                        </svg>
                      </motion.div>
                      
                      <motion.div
                        className="absolute -bottom-6 -left-6 w-12 h-12 text-primary/70"
                        animate={{ 
                          rotate: -360,
                          scale: [1, 1.2, 1] 
                        }}
                        transition={{
                          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                          scale: { duration: 4, repeat: Infinity }
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
                        </svg>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
                    
              {/* Bio content with enhanced styling */}
              <motion.div
                className="lg:col-span-7"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {bio.title}
                </h2>
                    
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  {bio.paragraphs.map((paragraph, i) => (
                    <p key={i} className={i === 0 ? "text-lg" : ""}>
                      {paragraph}
                    </p>
                  ))}
                  
                  <blockquote className="border-l-4 border-primary/30 pl-6 italic my-8">
                    <p className="text-lg">
                      "{bio.quote}"
                    </p>
                  </blockquote>
                </div>
                
                {/* Achievement stats with magical styling */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bio.stats.map((stat, i) => (
                    <motion.div 
                      key={i} 
                      className="relative overflow-hidden rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
                      <div className="relative z-10 text-center p-4">
                        <motion.div 
                          className="text-3xl font-bold text-primary"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                        >
                          {stat.value}
                        </motion.div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Academic & Professional Journey with Ghibli style */}
        <section className="py-24 relative overflow-hidden" id="journey">
          {/* Ghibli-inspired background elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
            
            {mounted && (
              <>
                {/* Floating grass-like elements (Ghibli style) */}
                {[...Array(8)].map((_, i) => (
                  <motion.div 
                    key={`grass-${i}`}
                    className="absolute bottom-0"
                    style={{
                      left: `${10 + i * 12}%`,
                      height: `${30 + Math.random() * 30}%`,
                      width: '80px',
                      zIndex: 1,
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                  >
                    <svg viewBox="0 0 50 200" className="w-full h-full">
                      <motion.path
                        d={`M25,200 Q${10 + Math.random() * 30},150 25,100 Q${10 + Math.random() * 30},50 25,0`}
                        stroke="hsl(var(--primary) / 0.2)"
                        strokeWidth="2"
                        fill="none"
                        animate={{ 
                          d: [
                            `M25,200 Q${10 + Math.random() * 30},150 25,100 Q${10 + Math.random() * 30},50 25,0`,
                            `M25,200 Q${20 + Math.random() * 20},150 25,100 Q${20 + Math.random() * 20},50 25,0`,
                            `M25,200 Q${10 + Math.random() * 30},150 25,100 Q${10 + Math.random() * 30},50 25,0`
                          ]
                        }}
                        transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </svg>
                  </motion.div>
                ))}
                
                {/* Floating clouds (Ghibli style) */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`cloud-${i}`}
                    className="absolute"
                    style={{ 
                      top: `${15 + i * 25}%`, 
                      opacity: 0.5,
                      zIndex: 1,
                    }}
                    animate={{ 
                      x: ['-100%', '100%'],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 120 + i * 30,
                      ease: "linear",
                      delay: i * 10
                    }}
                  >
                    <svg width={180 + i * 50} height="80" viewBox="0 0 200 100" opacity={0.6 - i * 0.1}>
                      <path 
                        d="M25,60 Q40,40 60,50 T100,50 T140,50 T180,60 Q190,70 170,80 L40,80 Q20,70 25,60" 
                        fill="white" 
                        fillOpacity="0.5"
                      />
                    </svg>
                  </motion.div>
                ))}
              </>
            )}
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                My Journey Through Realms of Knowledge
              </h2>
              <p className="text-lg text-muted-foreground">
                Like a Ghibli protagonist, I've traveled through realms of academia and industry, 
                collecting experiences and knowledge along the way.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Academic Background */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute -top-10 -left-10">
                  <motion.div
                    animate={{ rotate: [-10, 10, -10], scale: [1, 1.05, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <GraduationCap className="h-12 w-12 text-primary/50" />
                  </motion.div>
                </div>
                
                <div className="bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-2xl border border-primary/10">
                  <h3 className="text-2xl font-bold mb-8 text-primary">Academic Enchantments</h3>
                  
                  <div className="space-y-12">
                    {education.length > 0 ? education.map((edu, i) => (
                      <motion.div 
                        key={i}
                        className="relative pl-8 border-l-2 border-primary/30"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 * i }}
                      >
                        {/* Magical glowing dot */}
                        <motion.div 
                          className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary"
                          animate={{ 
                            boxShadow: [
                              '0 0 0 3px hsl(var(--primary) / 0.2)',
                              '0 0 0 5px hsl(var(--primary) / 0.1)',
                              '0 0 0 3px hsl(var(--primary) / 0.2)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        <h4 className="text-xl font-semibold">{edu.degree}</h4>
                        <p className="text-secondary font-medium mt-1">{edu.school}</p>
                        <p className="text-sm text-muted-foreground mt-1">{edu.period}</p>
                        <p className="mt-3">{edu.description}</p>
                      </motion.div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Education details coming soon...</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Professional Experience */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="absolute -top-10 -right-10">
                  <motion.div
                    animate={{ rotate: [10, -10, 10], scale: [1, 1.05, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Briefcase className="h-12 w-12 text-secondary/50" />
                  </motion.div>
                </div>
                
                <div className="bg-gradient-to-br from-secondary/5 to-transparent p-8 rounded-2xl border border-secondary/10">
                  <h3 className="text-2xl font-bold mb-8 text-secondary">Professional Quests</h3>
                  
                  <div className="space-y-12">
                    {experience.length > 0 ? experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        className="relative pl-8 border-l-2 border-secondary/30"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 * i }}
                      >
                        {/* Magical glowing dot */}
                        <motion.div 
                          className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-secondary"
                          animate={{ 
                            boxShadow: [
                              '0 0 0 3px hsl(var(--secondary) / 0.2)',
                              '0 0 0 5px hsl(var(--secondary) / 0.1)',
                              '0 0 0 3px hsl(var(--secondary) / 0.2)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        <h4 className="text-xl font-semibold">{exp.role}</h4>
                        <p className="text-primary font-medium mt-1">{exp.company}</p>
                        <p className="text-sm text-muted-foreground mt-1">{exp.period}</p>
                        <p className="mt-3">{exp.description}</p>
                      </motion.div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Experience details coming soon...</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Achievements & Awards - Optimized for all screen sizes */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {awards && awards.length > 0 ? (
                <>
                  <h3 className="text-2xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent">
                    Magical Achievements & Recognitions
                  </h3>
                  
                  {/* Adjusted grid for better responsive layout */}
                  <div className={cn(
                    "grid gap-8",
                    awards.length === 1 ? "grid-cols-1 max-w-xl mx-auto" :
                    awards.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto" :
                    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  )}>
                    {awards.map((award, i) => (
                      <motion.div
                        key={i}
                        className="bg-gradient-to-br from-accent/5 to-transparent rounded-xl p-6 border border-accent/10 relative overflow-hidden group h-full flex flex-col"
                        whileHover={{ scale: 1.03 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: i * 0.1,
                          type: "spring", 
                          stiffness: 400, 
                          damping: 10
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        {/* Ghibli-inspired decoration */}
                        <div className="absolute -top-4 -right-4">
                          <motion.div
                            animate={{ 
                              rotate: [0, 360],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                              scale: { duration: 3, repeat: Infinity } 
                            }}
                          >
                            <Award className="h-10 w-10 text-accent/30" />
                          </motion.div>
                        </div>
                        
                        {/* Magical glow on hover */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        
                        <div className="relative z-10 flex-1 flex flex-col">
                          <h4 className="text-xl font-semibold">{award.title || ""}</h4>
                          <div className="flex flex-wrap items-center mt-2 gap-2">
                            <p className="text-muted-foreground">{award.organization || ""}</p>
                            {award.organization && award.year && (
                              <span className="text-muted-foreground/50">•</span>
                            )}
                            {award.year && (
                              <p className="text-accent font-medium">{award.year}</p>
                            )}
                          </div>
                          <p className="mt-3 flex-grow">{award.description || ""}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : null}
            </motion.div>

            {/* Resume Download Button - Only show if a resume URL exists */}
            {aboutData.resumeUrl && (
              <motion.div
                className="mt-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.div
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a 
                    href={aboutData.resumeUrl}
                    download
                    className="relative group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg overflow-hidden"
                  >
                    {/* Magical floating particles on hover */}
                    {mounted && [...Array(12)].map((_, i) => (
                      <motion.div 
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white opacity-0 group-hover:opacity-100"
                        initial={{ 
                          x: 0, 
                          y: 0,
                        }}
                        animate={{ 
                          x: [0, (Math.random() - 0.5) * 100],
                          y: [0, (Math.random() - 0.5) * 100],
                          opacity: [0, 0.8, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 1.5,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 0.5
                        }}
                        style={{
                          left: `${30 + Math.random() * 40}%`,
                          top: `${30 + Math.random() * 40}%`,
                        }}
                      />
                    ))}
                    
                    <FileDown className="w-5 h-5" />
                    <span className="font-medium">Download Full Journey (Resume)</span>
                    
                    <motion.div 
                      className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </a>
                </motion.div>
              </motion.div>
            )}
          </div>
        </section>
        
        {/* Creative process section with Ghibli-inspired visuals */}
        <section className="py-24 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                My Creative Process
              </h2>
              <p className="text-lg text-muted-foreground">
                Like the journey of a Ghibli character, every project follows a thoughtful path from concept to reality. 
                Here's how I bring magic to your digital presence.
              </p>
            </motion.div>
            
            {/* Process steps with enhanced visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 relative">
              {/* Connecting line */}
              <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 hidden lg:block" />
              
              {[
                {
                  icon: <Sparkles className="h-8 w-8" />,
                  title: 'Inspiration & Discovery',
                  description: 'Exploring your vision and goals, gathering inspiration, and creating a foundation of understanding.',
                  color: 'primary',
                  delay: 0
                },
                {
                  icon: <Star className="h-8 w-8" />,
                  title: 'Artistic Planning',
                  description: "Sketching concepts and crafting design systems that align with your brand's unique story.",
                  color: 'secondary',
                  delay: 0.1
                },
                {
                  icon: <Code className="h-8 w-8" />,
                  title: 'Magic Development',
                  description: 'Bringing designs to life with clean code and enchanting interactions that engage users.',
                  color: 'accent',
                  delay: 0.2
                },
                {
                  icon: <Wind className="h-8 w-8" />,
                  title: 'Growth & Evolution',
                  description: 'Launching your project and providing support to help it flourish and adapt over time.',
                  color: 'primary',
                  delay: 0.3
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: step.delay }}
                >
                  <div className="relative z-10">
                    {/* Step number with animation - Fix dynamic classes */}
                    <motion.div
                      className="relative mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-8"
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Glowing background - Use conditional classes instead of template literals */}
                      <motion.div 
                        className={cn(
                          "absolute inset-0 rounded-full",
                          step.color === 'primary' ? "bg-primary/20" : 
                          step.color === 'secondary' ? "bg-secondary/20" : 
                          "bg-accent/20"
                        )}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      
                      {/* Border ring - Fix dynamic classes */}
                      <motion.div 
                        className={cn(
                          "absolute inset-0 rounded-full border-2",
                          step.color === 'primary' ? "border-primary/40" : 
                          step.color === 'secondary' ? "border-secondary/40" : 
                          "border-accent/40"
                        )}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {/* Icon - Fix dynamic classes */}
                      <div className={cn(
                        "relative z-10",
                        step.color === 'primary' ? "text-primary" : 
                        step.color === 'secondary' ? "text-secondary" : 
                        "text-accent"
                      )}>
                        {step.icon}
                      </div>
                    </motion.div>
                    
                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* CTA button */}
            <motion.div
              className="mt-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/contact">
                <Button className="rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all hover:scale-105">
                  Start Your Magical Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Skills section with Ghibli-inspired visuals */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                Magical Skills & Tools
              </h2>
              <p className="text-lg text-muted-foreground">
                My toolkit combines technical expertise with artistic sensibility, 
                allowing me to create digital experiences that are both functional and enchanting.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left column - Technical skills with improved visuals */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-2xl border border-primary/10"
              >
                <h3 className="text-2xl font-bold mb-8 flex items-center">
                  <Code className="mr-3 text-primary" />
                  <span>Technical Mastery</span>
                </h3>
                
                {/* Skills with magical progress bars and categorized approach */}
                <div className="space-y-10">
                  {/* Frontend Skills */}
                  <div>
                    <h4 className="text-xl font-medium mb-4 text-primary/90">Frontend Development</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {skills.frontend.length > 0 ? skills.frontend.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground text-sm">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-1 md:col-span-2 text-center py-4 text-muted-foreground">
                          <p>Frontend skills coming soon...</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Backend Skills */}
                  <div>
                    <h4 className="text-xl font-medium mb-4 text-secondary/90">Backend Development</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {skills.backend.length > 0 ? skills.backend.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground text-sm">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: 0.3 + index * 0.1 }}
                            />
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-1 md:col-span-2 text-center py-4 text-muted-foreground">
                          <p>Backend skills coming soon...</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Design Skills */}
                  <div>
                    <h4 className="text-xl font-medium mb-4 text-accent/90">Design & UX</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {skills.design.length > 0 ? skills.design.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground text-sm">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: 0.6 + index * 0.1 }}
                            />
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-1 md:col-span-2 text-center py-4 text-muted-foreground">
                          <p>Design skills coming soon...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Right column - Tools & Software */}
              <div>
                {/* Tools & Technologies with better visual */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="bg-gradient-to-br from-secondary/5 to-transparent p-8 rounded-2xl border border-secondary/10 mb-10"
                >
                  <h3 className="text-2xl font-bold mb-8 flex items-center">
                    <Sparkles className="mr-3 text-secondary" />
                    <span>Tools & Technologies</span>
                  </h3>
                  
                  <div className="flex flex-wrap gap-3">
                    {skills.tools.length > 0 ? skills.tools.map((tool, i) => (
                      <motion.div
                        key={i}
                        className={cn(
                          "px-4 py-2 rounded-full text-center relative overflow-hidden border",
                          tool.level === 'Expert' ? "border-secondary/30 bg-secondary/10" :
                          tool.level === 'Advanced' ? "border-primary/30 bg-primary/10" :
                          tool.level === 'Intermediate' ? "border-accent/30 bg-accent/10" :
                          "border-muted-foreground/30 bg-muted/20"
                        )}
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                      >
                        <span className="text-sm font-medium">{tool.name}</span>
                      </motion.div>
                    )) : (
                      <div className="w-full text-center py-8 text-muted-foreground">
                        <Code className="h-8 w-8 mx-auto mb-4 opacity-50" />
                        <p>Tools and technologies coming soon...</p>
                      </div>
                    )}
                  </div>
                </motion.div>
                
                {/* GitHub Stats Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-gradient-to-br from-accent/5 to-transparent p-8 rounded-2xl border border-accent/10"
                >
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <svg className="mr-3 text-accent" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                    <span>GitHub Stats & Contributions</span>
                  </h3>
                  
                  <GitHubStats username="melo-maniac-29" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </Suspense>
    </main>
  );
}

export function injectGlobalStyles() {
  return (
    <style jsx global>{`
      /* Fix for color classes in dynamic contexts */
      .text-primary { color: hsl(var(--primary)); }
      .text-secondary { color: hsl(var(--secondary)); }
      .text-accent { color: hsl(var(--accent)); }
      .bg-primary\/20 { background-color: hsl(var(--primary) / 0.2); }
      .bg-secondary\/20 { background-color: hsl(var(--secondary) / 0.2); }
      .bg-accent\/20 { background-color: hsl(var(--accent) / 0.2); }
      
      /* Ghibli-specific styles */
      .ghibli-card {
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
        backdrop-filter: blur(7px);
      }
      
      /* Mobile responsiveness fixes */
      @media (max-width: 768px) {
        .container {
          padding-left: 1rem;
          padding-right: 1rem;
        }
      }
    `}</style>
  );
}
