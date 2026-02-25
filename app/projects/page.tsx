"use client";

import { Suspense, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, ExternalLink, Github, Star, Code, Eye, Filter, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getSafeImageUrl } from '@/utils/image-utils';

// Define the interface for our project items
interface Project {
  _id: string;
  _creationTime: number; 
  title: string;
  category: string;
  image: string;
  description: string;
  technologies: string[];
  link: string;
  githubUrl?: string;
  featured: boolean;
  order?: number;
}

// Define the interface for category items
interface Category {
  id: string;
  label: string;
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Fetch projects from Convex backend
  const allProjects = useQuery(api.projects.getAll);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Define categories for filtering
  const categories: Category[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'design', label: 'Design Work' }
  ];

  // Filter projects based on selected category
  const filteredProjects = !allProjects ? [] : 
    filter === 'all' 
      ? allProjects 
      : allProjects.filter(project => project.category === filter);

  // Loading state when projects are being fetched
  if (!allProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading magical projects...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative overflow-x-hidden">
      {/* Animated background */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/90" />
          
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
          
          {/* Ghibli-inspired decorative cloud */}
          <motion.div
            className="absolute w-96 h-60 top-[15%] right-[-10%]"
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
        </div>
      )}
      
      <Suspense fallback={<div className="min-h-screen bg-background"></div>}>
        {/* Page header with magical elements */}
        <section className="relative pt-40 pb-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                  Magical Creations
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-6 leading-relaxed">
                Like Miyazaki crafts enchanting worlds, I build digital experiences that blend 
                artistry with functionality, creating something truly magical.
              </p>
            </motion.div>
            
            {/* Ghibli-inspired flying elements */}
            {mounted && (
              <div className="absolute right-10 top-1/3">
                <motion.svg width="120" height="60" viewBox="0 0 120 60" opacity="0.7">
                  <motion.path
                    d="M10,30 C20,15 40,15 50,30 C60,45 80,45 90,30"
                    stroke="hsl(var(--primary) / 0.6)"
                    strokeWidth="2"
                    fill="none"
                    animate={{ 
                      d: [
                        "M10,30 C20,15 40,15 50,30 C60,45 80,45 90,30",
                        "M10,30 C20,45 40,45 50,30 C60,15 80,15 90,30",
                        "M10,30 C20,15 40,15 50,30 C60,45 80,45 90,30"
                      ]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx="50" cy="30" r="4" 
                    fill="hsl(var(--primary))"
                    animate={{
                      cx: [50, 50, 50],
                      cy: [30, 30, 30]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx="30" cy="22" r="2" 
                    fill="hsl(var(--secondary))"
                    animate={{
                      cx: [30, 30, 30],
                      cy: [22, 38, 22]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx="70" cy="38" r="2" 
                    fill="hsl(var(--secondary))"
                    animate={{
                      cx: [70, 70, 70],
                      cy: [38, 22, 38]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.svg>
              </div>
            )}
          </div>
        </section>
        
        {/* Portfolio section with Ghibli-inspired elements */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="mb-16 flex flex-col md:flex-row md:justify-between md:items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-8 md:mb-0"
              >
                <div className="flex items-center">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Featured Projects
                  </h2>
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="ml-3"
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                  </motion.div>
                </div>
                <p className="text-muted-foreground mt-2 max-w-xl">
                  Each project represents a journey of creativity and problem-solving, 
                  crafted with attention to detail and a touch of magic.
                </p>
              </motion.div>
              
              {/* Enhanced filter section with mobile support */}
              <div className="relative">
                {/* Mobile filter menu toggle */}
                <div className="md:hidden mb-6">
                  <Button 
                    variant="outline"
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="w-full flex items-center justify-between"
                  >
                    <span>Filter: {categories.find(c => c.id === filter)?.label}</span>
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                
                {/* Animated filter menu for mobile */}
                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div 
                      className="absolute z-50 left-0 right-0 bg-card/95 backdrop-blur-sm rounded-lg border border-primary/10 shadow-lg md:hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-3 space-y-1">
                        {categories.map(category => (
                          <Button
                            key={category.id}
                            variant={filter === category.id ? 'default' : 'ghost'}
                            size="sm"
                            className={`w-full justify-start text-left rounded-md ${
                              filter === category.id 
                                ? 'bg-primary text-primary-foreground' 
                                : ''
                            }`}
                            onClick={() => {
                              setFilter(category.id);
                              setShowFilterMenu(false);
                            }}
                          >
                            {category.label}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Desktop filter buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="hidden md:flex flex-wrap gap-2"
                >
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={filter === category.id ? 'default' : 'outline'}
                      size="sm"
                      className={`rounded-full capitalize transition-all ${
                        filter === category.id 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
                          : 'hover:shadow-sm hover:border-primary/50'
                      }`}
                      onClick={() => setFilter(category.id)}
                    >
                      {category.id === 'all' ? 'All' : category.id}
                    </Button>
                  ))}
                </motion.div>
              </div>
            </div>
            
            {/* Enhanced project grid with animated transitions */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {filteredProjects.length === 0 ? (
                  <motion.div
                    className="text-center py-20 col-span-1 md:col-span-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="inline-block p-6 rounded-full bg-primary/5 mb-6">
                      <Code className="h-12 w-12 text-primary/60" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No projects found</h3>
                    <p className="text-muted-foreground mb-6">
                      No projects match the current filter. Try selecting a different category.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFilter('all')}
                      className="rounded-full border-primary/30"
                    >
                      Show All Projects
                    </Button>
                  </motion.div>
                ) : (
                  filteredProjects.map((project, index) => (
                    <motion.div
                      key={project._id}
                      className={`bg-gradient-to-br from-card/80 to-card border border-primary/10 rounded-xl overflow-hidden shadow-md relative group ${project.featured ? 'md:col-span-2' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      onMouseEnter={() => setHoveredId(project._id)}
                      onMouseLeave={() => setHoveredId(null)}
                      layout
                    >
                      <div className={`${project.featured ? 'md:flex md:flex-row' : ''}`}>
                        <div className={`aspect-video bg-muted relative overflow-hidden ${project.featured ? 'md:w-2/5' : 'w-full'}`}>
                          {/* Project image with enhanced placeholder */}
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-secondary/5">
                            <Image 
                              src={getSafeImageUrl(project.image)} 
                              alt={project.title}
                              fill
                              className="object-cover opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target) target.style.display = 'none';
                              }}
                            />
                          </div>
                          
                          {/* Magical gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Category label with glowing effect */}
                          <div className="absolute top-4 right-4">
                            <div className={`px-3 py-1 rounded-full text-xs uppercase font-medium
                              ${project.category === 'web' ? 'bg-primary/20 text-primary' : 
                                project.category === 'mobile' ? 'bg-secondary/20 text-secondary' : 
                                'bg-accent/20 text-accent'}`}
                            >
                              {project.category}
                            </div>
                          </div>
                          
                          {/* Featured badge */}
                          {project.featured && (
                            <div className="absolute top-4 left-4">
                              <motion.div 
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Star className="h-3 w-3" fill="currentColor" />
                                <span>Featured</span>
                              </motion.div>
                            </div>
                          )}
                        </div>
                        
                        <div className={`p-6 ${project.featured ? 'md:w-3/5' : 'w-full'}`}>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                          <p className="text-muted-foreground mb-4">{project.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.technologies.map((tech, i) => (
                              <motion.span 
                                key={i} 
                                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.2 + (i * 0.05) }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link href={project.link} className="flex-1">
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button 
                                  className="w-full bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary text-white"
                                >
                                  View Project
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                              </motion.div>
                            </Link>
                            
                            {project.githubUrl && (
                              <Link href={project.githubUrl} className="sm:w-auto">
                                <motion.div
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Button 
                                    variant="outline"
                                    className="w-full border-primary/30 hover:bg-primary/5"
                                  >
                                    <Github className="mr-2 h-4 w-4" />
                                    <span className="sm:hidden md:inline">Source Code</span>
                                    <span className="hidden sm:inline md:hidden">Code</span>
                                  </Button>
                                </motion.div>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Magic particles around hovered project */}
                      {mounted && hoveredId === project._id && (
                        <>
                          {[...Array(10)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute rounded-full bg-primary/30"
                              initial={{ 
                                top: `${50 + (Math.random() * 50) - 25}%`,
                                left: `${50 + (Math.random() * 50) - 25}%`,
                                scale: 0
                              }}
                              animate={{
                                top: [`${50 + (Math.random() * 50) - 25}%`, `${50 + (Math.random() * 100) - 50}%`],
                                left: [`${50 + (Math.random() * 50) - 25}%`, `${50 + (Math.random() * 100) - 50}%`],
                                scale: [0, 1, 0],
                                opacity: [0, 0.8, 0]
                              }}
                              transition={{
                                duration: 2 + Math.random() * 2,
                                ease: "easeInOut",
                                delay: i * 0.1
                              }}
                              style={{
                                width: 3 + Math.random() * 5,
                                height: 3 + Math.random() * 5,
                              }}
                            />
                          ))}
                        </>
                      )}
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Bottom magic elements */}
            {mounted && (
              <motion.div
                className="mt-20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <motion.svg width="200" height="50" viewBox="0 0 200 50" className="mx-auto opacity-50">
                  <motion.path
                    d="M20,30 C50,10 80,40 100,30 C120,20 150,50 180,30"
                    stroke="hsl(var(--primary) / 0.3)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                    animate={{ 
                      d: [
                        "M20,30 C50,10 80,40 100,30 C120,20 150,50 180,30",
                        "M20,30 C50,50 80,20 100,30 C120,40 150,10 180,30",
                        "M20,30 C50,10 80,40 100,30 C120,20 150,50 180,30"
                      ] 
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {[...Array(5)].map((_, i) => (
                    <motion.circle 
                      key={i} 
                      cx={40 + i * 30} 
                      cy="30"
                      r="2"
                      fill="hsl(var(--primary) / 0.5)"
                      animate={{ 
                        y: [-10, 10, -10],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        duration: 4,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.svg>
                
                <div className="mt-6 flex justify-center">
                  <Link href="/contact">
                    <Button className="rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all hover:scale-105">
                      Start Your Magical Project
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </Suspense>
    </main>
  );
}
