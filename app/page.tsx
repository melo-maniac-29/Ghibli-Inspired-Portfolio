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
  return null;
}

// ...rest of the unchanged code...

// Add an easter egg interaction
const [magicCounter, setMagicCounter] = useState(0);
const [magicActivated, setMagicActivated] = useState(false);

// Handle special easter egg when clicking on Totoro
const handleTotoroClick = () => {
  setMagicCounter(prev => {
    const newCount = prev + 1;
    if (newCount >= 3 && !magicActivated) {
      setMagicActivated(true);
      setTimeout(() => setMagicActivated(false), 5000);
    }
    return newCount; // Removed modulo reset to prevent skipping clicks
  });
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const headerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const featuredProjects = useQuery(api.projects.getFeatured) || [];
  const aboutData = useQuery(api.about.get);

  // ...rest of the component code remains unchanged...
}