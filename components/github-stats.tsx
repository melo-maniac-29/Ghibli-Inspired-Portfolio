"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// GitHub API response types
interface GitHubUserData {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
  name: string;
  login: string;
}

interface GitHubStatsProps {
  username?: string;
}

export default function GitHubStats({ username = "itsmeallen" }: GitHubStatsProps) {
  const [userData, setUserData] = useState<GitHubUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Calculate account age in years
  const calculateAccountAge = (createdAt: string) => {
    if (!createdAt) return "N/A";
    
    const createdDate = new Date(createdAt);
    const now = new Date();
    const ageInYears = ((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
    
    return `${ageInYears} years`;
  };

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        // Fetch basic user data from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub data');
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError("Couldn't load GitHub data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  return (
    <div className="space-y-6">
      {loading ? (
        // Loading skeleton
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted/40 rounded-xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-40 bg-muted/40 rounded-lg"></div>
            <div className="h-40 bg-muted/40 rounded-lg"></div>
          </div>
        </div>
      ) : error ? (
        // Error message with static fallback
        <div className="space-y-4">
          <div className="bg-muted/20 border border-muted/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted/40"></div>
              <div>
                <h4 className="text-xl font-bold">{username}</h4>
                <p className="text-sm text-muted-foreground">GitHub Profile</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Static GitHub Stats Card */}
            <div className="bg-muted/20 border border-muted/50 rounded-lg p-4 overflow-hidden">
              <h4 className="text-lg font-medium mb-3">Profile Stats</h4>
              <div className="flex justify-center">
                <Image
                  src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&bg_color=1e1e2e&text_color=cdd6f4&icon_color=cba6f7&title_color=94e2d5`}
                  alt="GitHub Stats"
                  width={320}
                  height={165}
                  className="rounded-md"
                  unoptimized
                />
              </div>
            </div>
            
            {/* GitHub Streak Card */}
            <div className="bg-muted/20 border border-muted/50 rounded-lg p-4 overflow-hidden">
              <h4 className="text-lg font-medium mb-3">Contribution Streak</h4>
              <div className="flex justify-center">
                <Image
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&hide_border=true&background=1e1e2e&stroke=94e2d5&ring=cba6f7&fire=f38ba8&currStreakNum=cdd6f4&sideNums=cdd6f4&currStreakLabel=94e2d5&sideLabels=94e2d5&dates=a6adc8`}
                  alt="GitHub Streak"
                  width={320}
                  height={165}
                  className="rounded-md"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // GitHub stats content - focused version
        <div className="space-y-4">
          {/* User summary */}
          {userData && (
            <div className="bg-muted/10 border border-muted/50 rounded-xl p-6">
              <div className="flex items-center gap-4">
                {/* User avatar */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={userData.avatar_url}
                    alt={`${userData.name || username}'s GitHub avatar`}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target) target.style.opacity = '0.5';
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold">{userData.name || username}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>GitHub enthusiast for {calculateAccountAge(userData.created_at)}</span>
                  </div>
                  
                  {/* Compact stats row */}
                  <div className="flex gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-primary">{userData.public_repos}</span>
                      <span className="text-muted-foreground">repos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-secondary">{userData.followers}</span>
                      <span className="text-muted-foreground">followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-accent">{userData.following}</span>
                      <span className="text-muted-foreground">following</span>
                    </div>
                  </div>
                </div>
                
                {/* Profile link */}
                <Link 
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto"
                >
                  <motion.div
                    className="bg-primary/10 hover:bg-primary/20 rounded-full p-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                  </motion.div>
                </Link>
              </div>
            </div>
          )}

          {/* GitHub stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GitHub Stats Card */}
            <div className="bg-muted/20 border border-muted/50 rounded-lg p-4 overflow-hidden">
              <h4 className="text-lg font-medium mb-3">Profile Stats</h4>
              <div className="flex justify-center">
                <Image
                  src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&bg_color=1e1e2e&text_color=cdd6f4&icon_color=cba6f7&title_color=94e2d5`}
                  alt="GitHub Stats"
                  width={320}
                  height={165}
                  className="rounded-md"
                  unoptimized
                />
              </div>
            </div>

            {/* GitHub Streak Card */}
            <div className="bg-muted/20 border border-muted/50 rounded-lg p-4 overflow-hidden">
              <h4 className="text-lg font-medium mb-3">Contribution Streak</h4>
              <div className="flex justify-center">
                <Image
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&hide_border=true&background=1e1e2e&stroke=94e2d5&ring=cba6f7&fire=f38ba8&currStreakNum=cdd6f4&sideNums=cdd6f4&currStreakLabel=94e2d5&sideLabels=94e2d5&dates=a6adc8`}
                  alt="GitHub Streak"
                  width={320}
                  height={165}
                  className="rounded-md"
                  unoptimized
                />
              </div>
            </div>
          </div>
          
          {/* GitHub Contribution Graph */}
          <div className="bg-muted/20 border border-muted/50 rounded-lg p-4 overflow-hidden">
            <h4 className="text-lg font-medium mb-3">Contribution Graph</h4>
            <div className="flex justify-center">
              <Link 
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-90 transition-opacity w-full"
              >
                <Image 
                  src={`https://ghchart.rshah.org/${username}`}
                  alt="GitHub Contribution Chart"
                  width={800}
                  height={120}
                  className="w-full max-w-full rounded-md bg-white dark:bg-gray-800"
                  unoptimized
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
