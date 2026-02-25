"use client";

import { Suspense, useEffect, useState } from 'react';
import { motion, useTransform, useScroll, useSpring } from 'framer-motion';
import { Sparkles, Wind, Leaf, Code, Globe, Layers, Heart, Award, Zap, MessageCircle } from 'lucide-react';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

// Ghibli-styled Background
function GhibliServicesBackground({ mounted }: { mounted: boolean }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [bgStyle, setBgStyle] = useState({});
  
  useEffect(() => {
    setBgStyle({
      background: isDark 
        ? 'linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)' 
        : 'linear-gradient(to bottom, #bae6fd 0%, #e0f2fe 100%)'
    });
  }, [isDark]);
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={bgStyle}
      />
      
      {/* Decorative mountains/hills in background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 ghibli-mountains-bg opacity-30" />
      
      {/* Clouds */}
      {mounted && !isDark && (
        <>
          {[...Array(3)].map((_, i) => (
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
                top: 100 + i * 150,
                filter: "blur(8px)",
                opacity: 0.4 + i * 0.08,
              }}
            />
          ))}
        </>
      )}
      
      {/* Stars for dark mode */}
      {mounted && isDark && (
        <>
          {[...Array(60)].map((_, i) => {
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
        </>
      )}
      
      {/* Forest silhouette at bottom */}
      <div className="ghibli-forest-bg opacity-40" />
      
      {/* Floating spirits/dust */}
      {mounted && (
        <>
          {[...Array(15)].map((_, i) => {
            const size = Math.random() * 6 + 2;
            const isSpirit = i % 8 === 0;
            return (
              <motion.div
                key={`dust-${i}`}
                className={isSpirit ? "ghibli-lantern" : "ghibli-dust"}
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
                  borderRadius: "50%",
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

// Improved Service Card with Ghibli style
function GhibliServiceCard({ service, index }: { 
  service: { icon: string; title: string; description: string; }, 
  index: number 
}) {
  return (
    <motion.div
      key={index}
      className="relative group h-full perspective-800"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Card container with 3D effect */}
      <motion.div 
        className="w-full h-full"
        whileHover={{ 
          rotateX: 5, 
          rotateY: 10, 
          y: -10,
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      >
        {/* Glow effect that shows on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="bg-card hover:bg-card/95 transition-colors p-8 rounded-xl border border-border flex flex-col h-full relative z-10 overflow-hidden">
          {/* Top radial gradient */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-20 bg-gradient-to-b from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          
          {/* Icon with animated magical glow */}
          <div className="mx-auto mb-6">
            <motion.div 
              className="rounded-full bg-gradient-to-br from-primary/10 to-secondary/5 p-5 w-20 h-20 flex items-center justify-center text-primary relative"
              animate={{ boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 20px rgba(147,51,234,0.3)", "0 0 0 rgba(0,0,0,0)"] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
            >
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="text-4xl relative z-10">{service.icon}</span>
              
              {/* Magical particles around icon on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1.5 h-1.5 bg-primary/60 rounded-full"
                    animate={{
                      x: [0, (i % 2 ? 30 : -30) * Math.random()],
                      y: [0, -40 * Math.random()],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Content with better spacing and typography */}
          <h3 className="text-2xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-300">{service.title}</h3>
          <p className="text-muted-foreground text-center mb-6">{service.description}</p>
          
          {/* Learn more link that appears on hover */}
          <div className="mt-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="ghost" size="sm" className="rounded-full text-primary/70 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
                Learn more
                <motion.div 
                  className="ml-1 relative"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: index * 0.2 }}
                >
                  →
                </motion.div>
              </Button>
            </motion.div>
          </div>
          
          {/* Decorative corner element */}
          <svg width="80" height="80" viewBox="0 0 80 80" className="absolute bottom-0 right-0 text-primary/5">
            <path d="M0,80 L80,80 L80,0 C40,0 0,40 0,80 Z" fill="currentColor" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Improved Testimonial Card with Ghibli style
function GhibliTestimonialCard({ testimonial, index }: { 
  testimonial: { content: string; author: string; position: string; rating: number; }, 
  index: number 
}) {
  return (
    <motion.div
      key={index}
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0, 0.7, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
      />
      
      <div className="ghibli-paper-card p-8 relative h-full overflow-visible">
        {/* Top decorative element */}
        <motion.div 
          className="absolute -top-4 -right-4 w-10 h-10 text-secondary"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
          </svg>
        </motion.div>
        
        {/* Quote icon */}
        <div className="mb-4 text-primary/20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
          </svg>
        </div>
        
        {/* Rating stars with improved glowing effect */}
        <div className="flex mb-4 relative">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.span 
              key={i} 
              className="text-primary text-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                textShadow: ["0 0 0px rgba(147,51,234,0)", "0 0 10px rgba(147,51,234,0.5)", "0 0 0px rgba(147,51,234,0)"]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              ★
            </motion.span>
          ))}
        </div>
        
        <blockquote className="text-lg font-medium mb-6 relative text-foreground/80 italic">
          {testimonial.content}
        </blockquote>
        
        <div className="flex items-center">
          {/* Avatar placeholder */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-white font-bold mr-4">
            {testimonial.author.charAt(0)}
          </div>
          
          <div>
            <div className="font-bold">{testimonial.author}</div>
            <div className="text-sm text-muted-foreground">{testimonial.position}</div>
          </div>
        </div>
        
        {/* Improved decorative border corners */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/30 rounded-tl-sm"></div>
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/30 rounded-tr-sm"></div>
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/30 rounded-bl-sm"></div>
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/30 rounded-br-sm"></div>
      </div>
    </motion.div>
  );
}

// Improved Process Step Card
function ProcessStepCard({ step, index }: { 
  step: { icon: React.ReactNode; title: string; description: string; color: string; }, 
  index: number 
}) {
  const springConfig = { stiffness: 100, damping: 10 };
  const y = useSpring(0, springConfig);

  return (
    <motion.div
      key={index}
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      onHoverStart={() => {
        y.set(-8);
      }}
      onHoverEnd={() => {
        y.set(0);
      }}
      style={{ y }}
    >
      {/* Step number circle with floating animation */}
      <div className="relative z-20 mb-6 flex justify-center">
        <motion.div 
          className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 
                    flex items-center justify-center relative"
          animate={{ 
            boxShadow: ["0 0 0px rgba(147,51,234,0)", "0 0 15px rgba(147,51,234,0.3)", "0 0 0px rgba(147,51,234,0)"]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            delay: index * 0.5 
          }}
        >
          <span className="text-2xl font-bold text-primary relative z-10">{index + 1}</span>
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full blur-md bg-primary/10 opacity-70" />
          
          {/* Animated particles around the circle */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1.5 h-1.5 bg-primary/60 rounded-full"
              animate={{
                x: [(20 + i * 5) * Math.cos(i * Math.PI/2), (30 + i * 5) * Math.cos(i * Math.PI/2)],
                y: [(20 + i * 5) * Math.sin(i * Math.PI/2), (30 + i * 5) * Math.sin(i * Math.PI/2)],
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                top: '50%',
                left: '50%',
              }}
            />
          ))}
        </motion.div>
      </div>
      
      <div className="ghibli-paper-card p-8 text-center h-full">
        <div className="mb-6 text-primary flex justify-center">
          {step.icon}
        </div>
        <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
        <p className="text-muted-foreground">{step.description}</p>
        
        {/* Decorative wavy line */}
        <div className="mt-6 flex justify-center">
          <svg width="120" height="10" viewBox="0 0 120 10" className="text-primary/30">
            <path d="M0,5 C20,0 40,10 60,5 C80,0 100,10 120,5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

// Stats section
function StatsSection() {
  return (
    <section className="py-20 bg-transparent relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "95%", label: "Client Satisfaction", icon: <Heart className="h-6 w-6" /> },
            { value: "120+", label: "Projects Completed", icon: <Award className="h-6 w-6" /> },
            { value: "4.9", label: "Average Rating", icon: <Zap className="h-6 w-6" /> },
            { value: "24/7", label: "Customer Support", icon: <MessageCircle className="h-6 w-6" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative p-8 rounded-xl bg-gradient-to-br from-card/80 to-card border border-primary/10 flex flex-col items-center text-center h-full group">
                {/* Glowing background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon */}
                <div className="p-3 bg-primary/10 text-primary rounded-full mb-4 relative">
                  <motion.div
                    animate={{ 
                      boxShadow: ["0 0 0px rgba(147,51,234,0)", "0 0 15px rgba(147,51,234,0.3)", "0 0 0px rgba(147,51,234,0)"]
                    }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 rounded-full"
                  />
                  {stat.icon}
                </div>
                
                {/* Value */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                >
                  <span className="text-4xl font-bold text-ghibli-gradient">{stat.value}</span>
                </motion.div>
                
                {/* Label */}
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-6 relative">
        <motion.div
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-card via-card/95 to-card/90 p-10 rounded-2xl border border-primary/20 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Magical floating elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`float-${i}`}
              className="absolute rounded-full bg-primary/20"
              animate={{
                x: [0, Math.random() * 40 - 20],
                y: [0, Math.random() * -50],
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                width: 5 + Math.random() * 15,
                height: 5 + Math.random() * 15,
                left: `${20 + Math.random() * 60}%`,
                bottom: '10%',
              }}
            />
          ))}
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Bring Your Vision to Life?</h2>
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            Let's create something magical together. Reach out to discuss how my services
            can help transform your ideas into reality.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all hover:scale-105 text-white">
                Get in Touch
              </Button>
            </Link>
            
            <Link href="/projects">
              <Button variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/10">
                View My Work
              </Button>
            </Link>
          </div>
          
          {/* Decorative element */}
          <motion.div
            className="absolute -bottom-10 -right-10 w-40 h-40 text-primary/10 opacity-50"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Animated section title
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

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const services = [
    {
      icon: "🎨",
      title: 'Web Design',
      description: 'Creating intuitive, responsive websites that provide exceptional user experiences across all devices.'
    },
    {
      icon: "💻",
      title: 'Web Development',
      description: 'Building fast, reliable and scalable applications using modern frameworks and best practices.'
    },
    {
      icon: "✏️",
      title: 'UI/UX Design',
      description: 'Designing user interfaces that are not only beautiful but also functional and user-friendly.'
    },
    {
      icon: "📢",
      title: 'Digital Marketing',
      description: 'Helping your business grow through strategic digital marketing campaigns and SEO optimization.'
    },
  ];

  const testimonials = [
    {
      content: "Working with this developer was an absolute pleasure. They delivered our project on time and exceeded our expectations with their attention to detail.",
      author: "Sarah Johnson",
      position: "CEO, TechStart",
      rating: 5
    },
    {
      content: "Our website traffic increased by 200% after the redesign. The intuitive interface and mobile responsiveness have significantly improved user engagement.",
      author: "Michael Chen",
      position: "Marketing Director, Growth Co",
      rating: 5
    },
    {
      content: "I was impressed by their technical expertise and creative approach to solving our complex requirements. The end result was exactly what we needed.",
      author: "Alex Rivera",
      position: "Product Manager, InnovateX",
      rating: 5
    },
    {
      content: "The project was delivered ahead of schedule and within budget. Communication was excellent throughout the entire process.",
      author: "Priya Sharma",
      position: "Founder, Design Hub",
      rating: 5
    },
  ];

  const processSteps = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Discovery",
      description: "Understanding your needs, goals, and vision through deep conversation",
      color: "primary"
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Planning",
      description: "Mapping out strategies and solutions tailored to your unique requirements",
      color: "secondary"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Creation",
      description: "Bringing ideas to life through meticulous design and development",
      color: "accent"
    },
    {
      icon: <Wind className="h-8 w-8" />,
      title: "Refinement",
      description: "Polishing and perfecting every detail until excellence is achieved",
      color: "primary"
    }
  ];

  return (
    <main className="relative">
      <Suspense fallback={<div className="min-h-screen bg-background"></div>}>
        {/* Ghibli style background */}
        <GhibliServicesBackground mounted={mounted} />
        
        {/* Page header with improved parallax effect */}
        <motion.div 
          className="relative bg-transparent pt-32 pb-20 z-10"
          style={{ y: foregroundY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 relative inline-block">
                  <span className="text-ghibli-gradient">My Services</span>
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  />
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Explore the range of digital services I offer to help bring your vision to life with a touch of magic.
                </p>
                
                {/* Added CTA button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Link href="/contact">
                    <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all hover:scale-105 text-white">
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Floating leaves */}
          {mounted && (
            <>
              {[...Array(8)].map((_, i) => (
                <FallingLeaf key={i} delay={i * 2} scale={0.8 + Math.random() * 0.4} />
              ))}
            </>
          )}
        </motion.div>
        
        {/* Services section */}
        <section className="py-20 bg-transparent relative z-10">
          <div className="container mx-auto px-6">
            <AnimatedSectionTitle
              title="What I Offer"
              subtitle="I provide a range of services to help businesses establish a strong online presence and achieve their digital goals."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <GhibliServiceCard key={index} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Stats Section (New) */}
        <StatsSection />
        
        {/* Process section (improved) */}
        <section className="py-20 bg-transparent relative z-10">
          <div className="container mx-auto px-6">
            <AnimatedSectionTitle
              title="My Creative Process"
              subtitle="How I bring your vision to life through a thoughtful and methodical approach"
            />
            
            <div className="relative mt-16">
              {/* Connection line with animation */}
              <motion.div 
                className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/10 via-secondary/30 to-accent/10 transform -translate-y-1/2 hidden md:block"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {processSteps.map((step, index) => (
                  <ProcessStepCard key={index} step={step} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials section with improved styling */}
        <section className="py-20 bg-transparent relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-muted/30 to-muted/10 opacity-70" />
          
          <div className="container mx-auto px-6 relative z-10">
            <AnimatedSectionTitle
              title="What Clients Say"
              subtitle="Don't just take my word for it - hear what my clients have to say about working with me."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <GhibliTestimonialCard key={index} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section (New) */}
        <CTASection />
      </Suspense>
      
      {/* Add animation styles */}
      <style jsx global>{`
        /* Ghibli gradient text */
        .text-ghibli-gradient {
          background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        
        /* Paper card style */
        .ghibli-paper-card {
          background-color: hsl(var(--card));
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                     0 4px 6px -2px rgba(0, 0, 0, 0.05),
                     inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        /* 3D perspective */
        .perspective-800 {
          perspective: 800px;
        }
        
        /* Mountains background */
        .ghibli-mountains-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,300 L1000,300 L1000,250 C900,220 850,280 800,250 C750,220 700,280 650,250 C600,220 550,250 500,220 C450,190 400,250 350,220 C300,190 250,220 200,190 C150,160 100,220 50,190 C25,175 0,190 0,170 Z' fill='%23334155' opacity='0.5'/%3E%3C/svg%3E");
          background-size: cover;
          background-position: bottom;
          background-repeat: no-repeat;
        }
        
        /* Forest background */
        .ghibli-forest-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 15%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,100 L1000,100 L1000,60 C970,60 960,20 950,20 C940,20 930,60 920,60 C910,60 900,40 890,40 C880,40 870,60 860,60 C840,60 830,30 820,30 C810,30 800,60 790,60 C770,60 760,35 750,35 C740,35 730,60 720,60 C700,60 690,25 680,25 C670,25 660,60 650,60 C630,60 620,40 610,40 C600,40 590,60 580,60 C560,60 550,20 540,20 C530,20 520,60 510,60 C490,60 480,30 470,30 C460,30 450,60 440,60 C420,60 410,35 400,35 C390,35 380,60 370,60 C350,60 340,25 330,25 C320,25 310,60 300,60 C280,60 270,40 260,40 C250,40 240,60 230,60 C210,60 200,20 190,20 C180,20 170,60 160,60 C140,60 130,30 120,30 C110,30 100,60 90,60 C70,60 60,35 50,35 C40,35 30,60 20,60 C10,60 0,50 0,50 Z' fill='%23064e3b' opacity='0.7'/%3E%3C/svg%3E");
          background-size: cover;
          background-position: bottom;
          background-repeat: no-repeat;
        }
        
        /* Dust/spirit particles */
        .ghibli-dust {
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
        }
        
        .ghibli-lantern {
          background: radial-gradient(circle, rgba(252,211,77,0.8) 0%, rgba(252,211,77,0) 70%);
          box-shadow: 0 0 10px 5px rgba(252,211,77,0.3);
        }
      `}</style>
    </main>
  );
}
