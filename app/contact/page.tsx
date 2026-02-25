"use client";

import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Check, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  LoaderCircle, 
  Loader2,
  Github,
  Instagram,
  Search as SearchIcon
} from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ContactPage() {
  // State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState<string>('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  
  // Mutations and queries
  const createContactSubmission = useMutation(api.contact.createContactSubmission);
  const submissionsByEmail = useQuery(
    api.contact.checkSubmissionStatusByEmail, 
    checkEmail ? { email: checkEmail } : "skip"
  );
  const contactPageContent = useQuery(api.contactPage.getPublic);
  const { toast } = useToast();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Form handling
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log("Preparing to submit form data:", formData);
      
      const maxRetries = 3;
      let attemptCount = 0;
      let success = false;
      let submissionId = null;
      
      while (attemptCount < maxRetries && !success) {
        try {
          attemptCount++;
          console.log(`Submission attempt ${attemptCount}/${maxRetries}`);
          
          const submissionPromise = createContactSubmission({
            name: formData.name,
            email: formData.email,
            subject: formData.subject || "No subject",
            message: formData.message,
          });
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Submission timeout")), 10000)
          );
          
          submissionId = await Promise.race([
            submissionPromise,
            timeoutPromise
          ]);
          
          console.log("Submission successful, ID:", submissionId);
          success = true;
          
        } catch (retryError) {
          console.error(`Attempt ${attemptCount} failed:`, retryError);
          if (attemptCount >= maxRetries) {
            throw new Error(`Failed after ${maxRetries} attempts`);
          }
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      
      if (!success) {
        throw new Error("Failed to submit message after multiple attempts");
      }
      
      setCheckEmail(formData.email);
      setSubmissionId(submissionId);
      
      setIsSubmitted(true);
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setIsSubmitting(false);
        setIsSubmitted(false);
        setTrackingDialogOpen(true);
      }, 3000);
      
    } catch (error) {
      console.error("Form submission error:", error);
      
      let errorMessage = "There was an error sending your message. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error sending message",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address to check your request status",
        variant: "destructive"
      });
      return;
    }
    setStatusDialogOpen(true);
  };

  // Helpers and data formatting
  const contactInfo = contactPageContent ? [
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email',
      value: contactPageContent.email || 'allenbobby2003@gmail',
      link: `mailto:${contactPageContent.email || 'allenbobby2003@gmail.com'}`
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Phone',
      value: contactPageContent.phone || '+91 6238128951',
      link: `tel:${contactPageContent.phone || '+91 6238128951'}`
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Address',
      value: contactPageContent.address || 'kerala,india',
      link: contactPageContent.mapLocation || 'https://maps.google.com/?q=kerala,india'
    }
  ] : [];

  const getStatusInfo = (status?: string) => {
    switch(status) {
      case 'pending':
        return { 
          icon: <Clock className="h-5 w-5 text-amber-500" />,
          label: 'Pending',
          description: 'Your request has been received and is waiting to be processed.',
          color: 'text-amber-500'
        };
      case 'processing':
        return { 
          icon: <LoaderCircle className="h-5 w-5 text-blue-500 animate-spin" />,
          label: 'Processing',
          description: 'Your request is currently being processed.',
          color: 'text-blue-500'
        };
      case 'completed':
        return { 
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          label: 'Completed',
          description: 'Your request has been successfully processed.',
          color: 'text-green-500'
        };
      case 'rejected':
        return { 
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          label: 'Rejected',
          description: 'Your request cannot be processed at this time.',
          color: 'text-red-500'
        };
      default:
        return { 
          icon: <Clock className="h-5 w-5 text-muted-foreground" />,
          label: 'Unknown',
          description: 'Status information not available.',
          color: 'text-muted-foreground'
        };
    }
  };

  // Content from backend
  const headerTitle = contactPageContent?.headerTitle || "Send a Message";
  const headerSubtitle = contactPageContent?.headerSubtitle || 
    "Like a magical letter carried by the wind in a Ghibli film, your message will find its way to me. Let's start our creative journey together.";
  
  const locationTitle = contactPageContent?.locationTitle || "Find Me Here";
  const locationSubtitle = contactPageContent?.locationSubtitle || 
    "Like a hidden spot in a Ghibli landscape, here's where you can find me.";
  
  // Icon rendering
  const renderSocialIcon = (iconValue: string) => {
    switch (iconValue?.toLowerCase()) {
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      default:
        return <span className="text-lg">{iconValue}</span>;
    }
  };

  // Format social links
  const socialLinks = contactPageContent?.socialLinks?.map(social => ({
    platform: social.platform,
    href: social.url,
    icon: renderSocialIcon(social.iconUrl || social.icon),
    color: 
      social.platform.toLowerCase() === 'twitter' ? "from-blue-400/20 to-blue-600/10" :
      social.platform.toLowerCase() === 'linkedin' ? "from-blue-600/20 to-blue-800/10" :
      social.platform.toLowerCase() === 'github' ? "from-purple-600/20 to-purple-800/10" :
      social.platform.toLowerCase() === 'instagram' ? "from-pink-500/20 to-purple-600/10" :
      "from-gray-400/20 to-gray-600/10"
  })) || [
    { platform: 'Twitter', href: "https://twitter.com", icon: <span className="text-lg">𝕏</span>, color: "from-blue-400/20 to-blue-600/10" },
    { platform: 'LinkedIn', href: "https://www.linkedin.com/in/allenbobby/", icon: <span className="text-lg">in</span>, color: "from-blue-600/20 to-blue-800/10" },
    { platform: 'GitHub', href: "https://github.com/melo-maniac-29", icon: <Github className="w-5 h-5" />, color: "from-purple-600/20 to-purple-800/10" },
    { platform: 'Instagram', href: "https://instagram.com", icon: <Instagram className="w-5 h-5" />, color: "from-pink-500/20 to-purple-600/10" },
  ];

  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Background elements - only shown when mounted */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/90" />
          
          {/* Decorative elements */}
          <>
            {/* Dust particles */}
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
            
            {/* Cloud element */}
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
            
            {/* Leaf element */}
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
            
            {/* Floating orbs */}
            {[...Array(5)].map((_, i) => (
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
        </div>
      )}
      
      <Suspense fallback={<div className="min-h-screen bg-background"></div>}>
        {/* Header section */}
        <section className="relative pt-40 pb-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                  {headerTitle}
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
                {headerSubtitle}
              </p>
            </motion.div>
            
            {/* Animated letter */}
            {mounted && (
              <div className="relative h-32 mt-8 overflow-hidden">
                <motion.div
                  className="absolute left-0 w-full"
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <svg width="120" height="80" viewBox="0 0 120 80" className="fill-primary/30">
                    <motion.path 
                      d="M10,40 C20,20 40,30 60,35 C80,40 100,25 110,45"
                      strokeWidth="2" 
                      stroke="hsl(var(--primary) / 0.4)"
                      fill="none"
                      animate={{
                        d: [
                          "M10,40 C20,20 40,30 60,35 C80,40 100,25 110,45",
                          "M10,40 C20,50 40,40 60,35 C80,30 100,45 110,35",
                          "M10,40 C20,20 40,30 60,35 C80,40 100,25 110,45"
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.g
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <rect x="45" y="22" width="30" height="20" fill="white" stroke="hsl(var(--primary) / 0.6)" strokeWidth="1" />
                      <path d="M45,22 L60,32 L75,22" fill="none" stroke="hsl(var(--primary) / 0.6)" strokeWidth="1" />
                    </motion.g>
                  </svg>
                </motion.div>
              </div>
            )}
          </div>
        </section>
        
        {/* Main content section */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact info column */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-2xl border border-primary/10 h-full">
                  <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Let's Connect
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Like characters in a Ghibli film who meet by chance and form lasting bonds, 
                    I look forward to connecting with you and bringing your vision to life.
                  </p>
                  
                  {/* Contact information */}
                  <div className="space-y-8">
                    {contactInfo.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start group"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/20 group-hover:border-primary/40 transition-colors">
                          {item.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-semibold mb-1 text-muted-foreground">{item.title}</h3>
                          <a
                            href={item.link}
                            className="text-lg group-hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Social links */}
                  <div className="mt-12 pt-8 border-t border-primary/10">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-secondary" />
                      <span>Follow My Journey</span>
                    </h3>
                    <div className="flex space-x-4">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center hover:scale-110 transition-all border border-primary/10`}
                          aria-label={social.platform}
                          whileHover={{ 
                            y: -5,
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" 
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                  
                  {/* Decorative element */}
                  {mounted && (
                    <motion.div
                      className="mt-12"
                      animate={{ 
                        y: [0, -10, 0],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg width="200" height="50" viewBox="0 0 200 50">
                        <path 
                          d="M10,30 C30,10 60,40 100,25 C140,10 170,30 190,20" 
                          fill="none"
                          stroke="hsl(var(--primary) / 0.2)"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        {[...Array(5)].map((_, i) => (
                          <motion.circle 
                            key={i}
                            cx={30 + i * 35} 
                            cy={30 - (i % 3) * 10} 
                            r="3"
                            fill="hsl(var(--primary) / 0.3)"
                            animate={{ 
                              y: [0, -15, 0],
                              opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{ 
                              duration: 3 + i,
                              delay: i * 0.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {/* Contact form column */}
              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="bg-gradient-to-br from-secondary/5 to-transparent rounded-2xl border border-secondary/10 p-8 relative overflow-hidden">
                  {/* Success message overlay */}
                  {isSubmitted && (
                    <motion.div 
                      className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-700/10 rounded-full flex items-center justify-center mb-6"
                      >
                        <Check className="w-10 h-10 text-green-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground text-center max-w-sm">
                        Thank you for reaching out. I'll get back to you as soon as possible.
                      </p>
                      <p className="text-xs mt-4 text-muted-foreground">
                        Your submission ID: <span className="font-mono">{submissionId}</span>
                      </p>
                    </motion.div>
                  )}
                  
                  {/* Contact form */}
                  <div className="relative z-0">
                    <div className="flex items-center mb-8">
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                        Send Me a Message
                      </h2>
                      <motion.div 
                        className="ml-4"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 0.9, 1]
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                      >
                        <Sparkles className="w-5 h-5 text-secondary" />
                      </motion.div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Your Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Chihiro"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-background/50 border-secondary/20 focus:border-secondary"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="chihiro@spiritedaway.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-background/50 border-secondary/20 focus:border-secondary"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Let's create something magical together"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="bg-background/50 border-secondary/20 focus:border-secondary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Your Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell me about your project or just say hello..."
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="min-h-[150px] bg-background/50 border-secondary/20 focus:border-secondary"
                        />
                      </div>
                      
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => setTrackingDialogOpen(true)}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
                        >
                          Track your request status
                        </button>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-6"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending Message...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <span>Send Message</span>
                              <Send className="ml-2 h-5 w-5" />
                            </div>
                          )}
                        </Button>
                      </motion.div>
                      
                      {/* Decorative element */}
                      {mounted && (
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                          <motion.svg width="200" height="100" viewBox="0 0 200 100" opacity="0.5">
                            <motion.path
                              d="M20,50 C60,30 140,30 180,50"
                              stroke="hsl(var(--secondary) / 0.3)"
                              strokeWidth="1"
                              strokeDasharray="6 4"
                              fill="none"
                              animate={{
                                d: [
                                  "M20,50 C60,30 140,30 180,50",
                                  "M20,50 C60,70 140,70 180,50",
                                  "M20,50 C60,30 140,30 180,50"
                                ]
                              }}
                              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            {[...Array(7)].map((_, i) => (
                              <motion.circle 
                                key={i} 
                                cx={30 + i * 20} 
                                cy="50" 
                                r="3"
                                fill="hsl(var(--secondary) / 0.3)"
                                animate={{ 
                                  y: [0, -20 - i * 3, 0],
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
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Location section */}
        <section className="py-20 bg-background relative">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                {locationTitle}
              </h2>
              <p className="text-lg text-muted-foreground">
                {locationSubtitle}
              </p>
            </motion.div>
            
            {/* Map visualization */}
            <motion.div
              className="relative rounded-xl overflow-hidden border border-primary/10 h-96 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
                <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                  <rect x="0" y="240" width="800" height="160" fill="hsl(210, 80%, 85%, 0.3)" />
                  <path d="M0,240 C100,230 200,250 300,240 C400,230 500,250 600,240 C700,230 800,250 800,240 L800,400 L0,400 Z" fill="hsl(210, 80%, 75%, 0.2)" />
                  <path d="M0,0 L800,0 L800,240 C700,230 600,250 500,240 C400,230 300,250 200,240 C100,230 0,250 0,240 Z" fill="hsl(100, 40%, 85%, 0.2)" />
                  
                  <path d="M0,150 C50,100 100,180 150,150 C200,120 250,170 300,140 C350,110 400,160 450,130 C500,100 550,150 600,120 C650,90 700,140 750,110 C800,80 800,240 800,240 L0,240 Z" fill="hsl(120, 40%, 70%, 0.2)" />
                  
                  <path d="M200,240 C250,200 300,150 400,170 C500,190 600,150 700,200" stroke="hsl(30, 80%, 80%, 0.4)" strokeWidth="10" fill="none" />
                  <path d="M100,240 C150,150 250,100 350,120" stroke="hsl(30, 80%, 80%, 0.3)" strokeWidth="6" fill="none" />
                  {[...Array(20)].map((_, i) => (
                    <circle 
                      key={i} 
                      cx={50 + Math.random() * 700} 
                      cy={50 + Math.random() * 150} 
                      r={5 + Math.random() * 10}
                      fill="hsl(120, 70%, 40%, 0.3)"
                    />
                  ))}
                  
                  <rect x="380" y="170" width="40" height="30" fill="hsl(0, 0%, 70%, 0.3)" />
                  <rect x="385" y="150" width="30" height="20" fill="hsl(0, 0%, 75%, 0.3)" />
                  {[...Array(12)].map((_, i) => {
                    const x = 100 + (i % 6) * 100 + Math.random() * 50;
                    const y = 180 + Math.floor(i / 6) * 40;
                    return (
                      <g key={i}>
                        <rect x={x} y={y} width="15" height="10" fill={`hsl(${i * 30}, 70%, 70%, 0.4)`} />
                        <polygon points={`${x},${y} ${x+7.5},${y-8} ${x+15},${y}`} fill={`hsl(${i * 30}, 70%, 60%, 0.4)`} />
                      </g>
                    );
                  })}
                  
                  <motion.g
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <circle cx="400" cy="185" r="15" fill="hsl(var(--primary) / 0.3)" />
                    <circle cx="400" cy="185" r="7" fill="hsl(var(--primary) / 0.7)" />
                  </motion.g>
                  
                  <motion.path 
                    d="M720,100 C740,90 760,110 780,100" 
                    stroke="hsl(var(--secondary) / 0.4)" 
                    strokeWidth="2" 
                    fill="none"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <motion.path 
                    d="M50,80 C70,70 90,90 110,80" 
                    stroke="hsl(var(--accent) / 0.4)" 
                    strokeWidth="2" 
                    fill="none"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  />
                </svg>
                
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-background/80 px-6 py-3 rounded-full backdrop-blur-sm border border-primary/20">
                  <p className="font-medium text-lg flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" /> 
                    {contactPageContent?.address || "kerala,india"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Suspense>
      
      {/* Request tracking dialog */}
      <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-primary" />
              Track Your Requests
            </DialogTitle>
            <DialogDescription>
              Enter your email to check the status of your contact submissions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckStatus} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tracking-email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tracking-email"
                  value={checkEmail}
                  onChange={(e) => setCheckEmail(e.target.value)}
                  placeholder="Enter the email you used to contact us"
                  type="email"
                  required
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the same email address you used when submitting your contact request.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setTrackingDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <SearchIcon className="mr-2 h-4 w-4" />
                Check Status
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Your Request Status
            </DialogTitle>
            <DialogDescription>
              View the status of your contact submissions
            </DialogDescription>
          </DialogHeader>
          
          {submissionsByEmail === undefined ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : submissionsByEmail === null || submissionsByEmail.length === 0 ? (
            <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              <p className="flex items-center font-medium">
                <AlertCircle className="h-5 w-5 mr-2" />
                No requests found
              </p>
              <p className="text-sm mt-2">
                No contact requests found for this email address. Please make sure you entered the correct email.
              </p>
            </div>
          ) : (
            <>
              <div className="text-sm mb-2 flex items-center justify-between">
                <span className="text-muted-foreground">Found {submissionsByEmail.length} request(s)</span>
                <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {checkEmail}
                </div>
              </div>
                
              <div className="max-h-[450px] overflow-y-auto pr-1 -mr-1">
                <div className="space-y-4">
                  {submissionsByEmail.map((submission, index) => {
                    const status = getStatusInfo(submission.status);
                    return (
                      <div 
                        key={submission._id} 
                        className="border rounded-lg overflow-hidden transition-colors hover:border-primary/20 hover:bg-primary/5"
                      >
                        <div className={`px-4 py-3 flex items-center gap-3 border-b ${
                          submission.status === 'completed' 
                            ? 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/40' 
                            : submission.status === 'processing'
                            ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/40'
                            : submission.status === 'rejected'
                            ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800/40'
                            : 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/40'
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            submission.status === 'completed' 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300' 
                              : submission.status === 'processing'
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                              : submission.status === 'rejected'
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                              : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}>
                            {status.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-semibold truncate ${status.color}`}>
                              {status.label}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Submitted: {
                                submission.createdAt 
                                  ? new Date(submission.createdAt).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: 'numeric',
                                      minute: 'numeric'
                                    })
                                  : "Unknown date"
                              }
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            data-state={`details-${index}`}
                            onClick={(e) => {
                              const button = e.currentTarget;
                              const currentState = button.getAttribute('data-state');
                              const detailsEl = document.getElementById(`submission-details-${index}`);
                              
                              if (currentState === `details-${index}-open`) {
                                button.setAttribute('data-state', `details-${index}-closed`);
                                button.textContent = 'Show Details';
                                detailsEl?.classList.add('hidden');
                              } else {
                                button.setAttribute('data-state', `details-${index}-open`);
                                button.textContent = 'Hide Details';
                                detailsEl?.classList.remove('hidden');
                              }
                            }}
                          >
                            Show Details
                          </Button>
                        </div>
                        
                        <div className="hidden" id={`submission-details-${index}`}>
                          <div className="p-4 space-y-3 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <p className="font-medium text-xs text-muted-foreground">Subject</p>
                                <p>{submission.subject || "No subject"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="font-medium text-xs text-muted-foreground">From</p>
                                <p className="truncate">{submission.name} ({submission.email})</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-medium text-xs text-muted-foreground">Message</p>
                              <p className="whitespace-pre-line max-h-24 overflow-y-auto border p-2 rounded-md text-muted-foreground bg-muted/40 text-xs">
                                {submission.message}
                              </p>
                            </div>
                            
                            {submission.notes && (
                              <div>
                                <p className="font-medium text-xs text-muted-foreground">Notes from Admin</p>
                                <div className="mt-1 p-2 bg-primary/5 rounded-md border border-primary/20">
                                  <p className="whitespace-pre-line text-xs">{submission.notes}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="text-xs text-muted-foreground border-t pt-2">
                              <p className="flex items-center justify-between">
                                <span>Reference ID:</span>
                                <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{submission._id}</code>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-between items-center gap-2 border-t pt-4 mt-4">
            <p className="text-xs text-muted-foreground">
              We'll respond to your inquiry as soon as possible.
            </p>
            <Button 
              onClick={() => setStatusDialogOpen(false)}
              className="bg-primary hover:bg-primary/90"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
