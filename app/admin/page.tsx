"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileSymlink, UserCircle, LayoutDashboard, FileText, Image, Phone, Mail, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from 'sonner';

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [migratingIcons, setMigratingIcons] = useState(false);
  const router = useRouter();
  
  const migrateIcons = useMutation(api.migrateIcons.migrateIconsToIconUrl);

  const handleMigrateIcons = async () => {
    try {
      setMigratingIcons(true);
      await migrateIcons();
      toast.success("Social icons migrated successfully");
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Failed to migrate social icons");
    } finally {
      setMigratingIcons(false);
    }
  };

  useEffect(() => {
    // Verify authentication with the server
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/verify-auth');
        
        if (response.ok) {
          const data = await response.json();
          if (data.authorized) {
            setIsAuthorized(true);
          } else {
            // Not authorized - redirect to home
            router.push('/');
          }
        } else {
          // Error - redirect to home
          router.push('/');
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuth();
  }, [router]);
  
  // Add keyboard shortcut listener
  useEffect(() => {
    let keys: string[] = [];
    const keySequence = ['Control', 'Alt', 'l'];
    
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Add the key to the sequence
      keys.push(e.key);
      
      // Check if the last 3 keys match our sequence
      if (keys.length > 3) {
        keys = keys.slice(keys.length - 3);
      }
      
      // Check if the key sequence matches
      if (JSON.stringify(keys) === JSON.stringify(keySequence)) {
        // Clear the sequence
        keys = [];
        
        // Trigger the secret login
        try {
          const response = await fetch('/api/secret-login', {
            method: 'POST',
          });
          
          if (response.ok) {
            console.log('Admin access granted');
            // Force refresh to apply new cookie
            window.location.reload();
          }
        } catch (error) {
          console.error('Secret login failed:', error);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="bg-card p-6 rounded-lg border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome to the Admin Area</h2>
          <p className="text-muted-foreground mb-6">
            From here you can manage your website content and settings.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin sections */}
          <Link href="/admin/about">
            <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent/5 transition-colors flex items-start gap-4 h-full">
              <UserCircle className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium text-lg mb-2">About Page</h3>
                <p className="text-sm text-muted-foreground">
                  Edit your bio, experience, education, skills and other about page content.
                </p>
              </div>
            </div>
          </Link>
          
          {/* Add more admin sections as needed */}
          <Link href="/admin/projects">
            <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent/5 transition-colors flex items-start gap-4 h-full">
              <FileSymlink className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium text-lg mb-2">Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your project portfolio, add new projects or update existing ones.
                </p>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/contacts" className="block">
            <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent/5 transition-colors flex items-start gap-4 h-full">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium text-lg mb-2">Contact Requests</h3>
                <p className="text-sm text-muted-foreground">
                  Manage and respond to contact form submissions from website visitors.
                </p>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/contact-page" className="block">
            <div className="p-6 border border-border rounded-lg bg-background hover:bg-accent/5 transition-colors flex items-start gap-4 h-full">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium text-lg mb-2">Contact Page Content</h3>
                <p className="text-sm text-muted-foreground">
                  Edit your contact page contents, message form settings and map display.
                </p>
              </div>
            </div>
          </Link>
        </div>
        
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800 mt-8">
          <CardHeader>
            <CardTitle className="text-amber-800 dark:text-amber-200">Maintenance Actions</CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              System maintenance and database operations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-amber-700 dark:text-amber-300">
            <div className="space-y-2">
              <p className="text-sm">Fix any database inconsistencies with these actions:</p>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Migrate Social Icons</h4>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Convert 'icon' fields to 'iconUrl' in Contact Page
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="bg-white dark:bg-amber-900 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200"
                    onClick={handleMigrateIcons}
                    disabled={migratingIcons}
                  >
                    {migratingIcons ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Migrating...
                      </>
                    ) : (
                      'Run Migration'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button
            onClick={async () => {
              await fetch('/api/logout', { method: 'POST' });
              router.push('/');
            }}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
          >
            Logout
          </Button>
        </div>
      </div>
    </main>
  );

}
