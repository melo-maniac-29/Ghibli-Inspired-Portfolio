"use client";


import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { useIsClient } from '@/components/hooks/use-is-client';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const isClient = useIsClient();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  useEffect(() => {
    if (!isClient) return;
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Get all sections and determine which one is currently in view
      const sections = ['about', 'services', 'projects', 'process', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      } else if (window.scrollY < 100) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  const menuItems = [
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'projects' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-background/90 backdrop-blur-lg py-3 border-b border-primary/20' 
            : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/" 
              className="relative group"
            >
              <div className="flex items-center">
                <motion.div
                  className="relative overflow-hidden h-10 flex items-center"
                  whileHover="hover"
                >
                  <motion.span 
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent filter drop-shadow-sm"
                  >
                    itsme-allen
                  </motion.span>
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary/80 via-secondary to-accent/80"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1, originX: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary via-secondary to-accent"
                    initial={{ scaleX: 0, originX: 0 }}
                    variants={{
                      hover: {
                        scaleX: 1,
                        transition: {
                          duration: 0.4,
                          ease: "easeInOut"
                        }
                      }
                    }}
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent ml-1"
                >
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7] 
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="w-full h-full rounded-full bg-gradient-to-r from-primary to-accent blur-[1px]"
                  />
                </motion.div>
              </div>
            </Link>
            
            {isClient ? (
              <>
                <div className="hidden md:flex items-center">
                  <div className="relative flex space-x-1 bg-primary/10 backdrop-blur-sm p-1 rounded-full border border-primary/20 shadow-sm">
                    {menuItems.map((item, i) => {
                      const isActive = activeSection === item.href.substring(1);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="relative"
                        >
                          <motion.div
                            className="relative px-5 py-2 rounded-full text-sm font-medium z-10"
                            initial={{ color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
                            animate={{ 
                              color: isActive 
                                ? isDark ? "#ffffff" : "#000000" 
                                : isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" 
                            }}
                            whileHover={{ color: isDark ? "#ffffff" : "#000000" }}
                          >
                            {item.label}
                          </motion.div>
                          
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/90 via-secondary/80 to-accent/70 shadow-md"
                              layoutId="navHighlight"
                              transition={{ 
                                type: "spring", 
                                duration: 0.6,
                                stiffness: 400,
                                damping: 30
                              }}
                            >
                              <motion.div
                                className="absolute inset-0 rounded-full opacity-30"
                                animate={{
                                  background: [
                                    'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                                    'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
                                    'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
                                  ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                            </motion.div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                  
                  <div className="ml-4">
                    <GhibliThemeToggle />
                  </div>
                </div>

                <div className="flex items-center gap-4 md:hidden">
                  <GhibliThemeToggle />
                  <motion.button
                    className="relative z-50 w-10 h-10 flex items-center justify-center bg-primary/5 rounded-full border border-primary/10"
                    onClick={() => setIsOpen(!isOpen)}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle menu"
                  >
                    <AnimatePresence mode="wait">
                      {isOpen ? (
                        <motion.div
                          key="close"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                        >
                          <X size={20} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ opacity: 0, rotate: 90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: -90 }}
                        >
                          <Menu size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </>
            ) : (
              // Skeleton placeholder during server render to prevent hydration errors
              <div className="flex items-center gap-2">
                <div className="w-16 h-10 bg-card/50 rounded-full animate-pulse" />
                <div className="w-10 h-10 bg-card/50 rounded-full md:hidden animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && isClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              className="absolute inset-0 bg-black/80 dark:backdrop-blur-md backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className={cn(
                "absolute inset-y-0 right-0 w-4/5 flex flex-col items-center justify-center px-8 overflow-hidden shadow-lg",
                "dark:bg-gradient-to-bl dark:from-background/95 dark:via-background/90 dark:to-background/85",
                "bg-gradient-to-bl from-background via-background/95 to-background/90",
                "border-l dark:border-primary/5 border-primary/20"
              )}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Decorative elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Background gradient overlay */}
                <div className={cn(
                  "absolute inset-0",
                  "dark:bg-gradient-to-t dark:from-primary/10 dark:via-transparent dark:to-secondary/15",
                  "bg-gradient-to-t from-primary/15 via-secondary/5 to-accent/10"
                )} />
                
                {/* Animated blob */}
                <div className="absolute inset-0">
                  <motion.div
                    className={cn(
                      "absolute w-[300px] h-[300px] rounded-full filter blur-3xl",
                      "dark:bg-gradient-to-r dark:from-primary/20 dark:via-secondary/20 dark:to-accent/20 dark:opacity-20",
                      "bg-gradient-to-r from-primary/25 via-secondary/25 to-accent/25 opacity-30"
                    )}
                    animate={{
                      x: ['-20%', '10%', '-20%'],
                      y: ['10%', '30%', '10%'],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      top: '20%',
                      left: '50%',
                    }}
                  />
                </div>
                
                {/* Top circles */}
                <motion.div 
                  className={cn(
                    "absolute top-12 right-12 w-40 h-40 rounded-full border",
                    "dark:border-primary/20 border-primary/40",
                  )}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  style={{ opacity: isDark ? 0.3 : 0.4 }}
                />
                
                <motion.div 
                  className={cn(
                    "absolute top-20 left-10 w-20 h-20 rounded-full border",
                    "dark:border-secondary/20 border-secondary/40",
                  )}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  style={{ opacity: isDark ? 0.25 : 0.35 }}
                />
                
                {/* Light mode pattern */}
                {!isDark && (
                  <div className="absolute inset-0 opacity-[0.03]" 
                       style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                  />
                )}
                
                {/* Floating spirit particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`spirit-${i}`}
                    className={cn(
                      "absolute rounded-full",
                      isDark 
                        ? "bg-accent/40" 
                        : i % 2 === 0 
                          ? "bg-primary/50" 
                          : i % 3 === 0 
                            ? "bg-secondary/50"
                            : "bg-accent/50"
                    )}
                    animate={{
                      y: [0, -40, 0],
                      x: [0, Math.random() * 20 - 10, 0],
                      opacity: isDark ? [0.2, 0.5, 0.2] : [0.3, 0.6, 0.3],
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
                      bottom: `${Math.random() * 80}%`,
                      filter: isDark ? "blur(1px)" : "blur(1px) brightness(1.1)",
                    }}
                  />
                ))}
                
                {/* Light beam - different colors based on theme */}
                <motion.div
                  className={cn(
                    "absolute h-[60%] w-[1px]",
                    isDark
                      ? "bg-gradient-to-b from-transparent via-primary/30 to-transparent"
                      : "bg-gradient-to-b from-transparent via-secondary/50 to-transparent"
                  )}
                  style={{ left: '30%', top: '20%' }}
                  animate={{
                    opacity: [0, isDark ? 0.7 : 0.9, 0],
                    height: ['60%', '70%', '60%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                
                {/* Light mode extra highlight */}
                {!isDark && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                )}
              </div>
              
              {/* Menu content */}
              <div className="w-full flex flex-col items-center space-y-8 relative z-10">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                    className="relative w-full text-center"
                  >
                    <Link
                      href={item.href}
                      className="relative py-2 px-4 block"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={`text-2xl font-medium relative inline-block ${
                        activeSection === item.href.substring(1) 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent' 
                          : isDark 
                            ? 'text-foreground/90' 
                            : 'text-foreground/80'
                      }`}>
                        {item.label}
                      </span>
                      
                      {activeSection === item.href.substring(1) ? (
                        <motion.div
                          className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-primary via-secondary to-accent"
                          layoutId="mobileNavHighlight"
                        >
                          {/* Animated glow effect - brighter in light mode */}
                          <motion.div 
                            className={cn(
                              "absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent",
                              isDark ? "blur-sm" : "blur-[3px]"
                            )}
                            animate={{ opacity: isDark ? [0.3, 0.7, 0.3] : [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div 
                          className={cn(
                            "absolute -bottom-1 left-1/2 h-[2px] w-0",
                            isDark 
                              ? "bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40"
                              : "bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70"
                          )}
                          whileHover={{ width: '80%', left: '10%' }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      
                      {/* Small accent icon */}
                      {activeSection === item.href.substring(1) && (
                        <motion.div 
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ 
                            scale: 1, 
                            rotate: 360,
                            color: [
                              'hsl(var(--primary))',
                              'hsl(var(--secondary))',
                              'hsl(var(--accent))',
                              'hsl(var(--primary))',
                            ]
                          }}
                          transition={{ 
                            rotate: { duration: 0.5 },
                            color: { duration: 4, repeat: Infinity }
                          }}
                          className={cn(
                            "absolute -right-4 top-1/2 -translate-y-1/2",
                            !isDark && "filter drop-shadow-sm"
                          )}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
                          </svg>
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Decorative divider - enhanced for light mode */}
              <motion.div
                className="w-1/2 h-[1px] my-8 relative"
                initial={{ width: 0 }}
                animate={{ width: "50%" }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className={cn(
                  "absolute inset-0",
                  isDark
                    ? "bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                    : "bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                )} />
                <motion.div 
                  className={cn(
                    "absolute inset-0 h-full w-[20%]",
                    isDark
                      ? "bg-gradient-to-r from-transparent via-primary/70 to-transparent blur-sm"
                      : "bg-gradient-to-r from-transparent via-secondary/80 to-transparent blur-sm"
                  )}
                  animate={{ 
                    left: ['0%', '80%', '0%'],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </motion.div>
              
              {/* Footer content - enhanced for light mode */}
              <motion.div
                className="absolute bottom-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex space-x-4 mb-4 justify-center">
                  {[
                    {icon: "github", href: "#"},
                    {icon: "twitter", href: "#"},
                    {icon: "linkedin", href: "#"}
                  ].map((social, i) => (
                    <motion.a
                      key={social.icon}
                      href={social.href}
                      className={cn(
                        "text-muted-foreground hover:text-accent transition-colors p-2",
                        isDark
                          ? "hover:bg-accent/10 hover:shadow-sm"
                          : "hover:bg-accent/20 hover:shadow-md",
                        "rounded-full relative"
                      )}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -2,
                        boxShadow: isDark 
                          ? "0 0 8px rgba(var(--accent)/0.3)" 
                          : "0 0 12px rgba(var(--accent)/0.4)"
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                    >
                      <motion.div 
                        className={cn(
                          "absolute inset-0 rounded-full opacity-0",
                          isDark ? "bg-accent/5" : "bg-accent/15"
                        )}
                        whileHover={{ 
                          opacity: 1, 
                          scale: 1.2 
                        }}
                        transition={{ duration: 0.2 }}
                      />
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        {social.icon === "github" && <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />}
                        {social.icon === "twitter" && <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />}
                        {social.icon === "linkedin" && <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z" />}
                      </svg>
                    </motion.a>
                  ))}
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  <motion.span
                    className="block" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    &copy; {new Date().getFullYear()} itsme-allen
                  </motion.span>
                  <motion.span 
                    className="text-xs opacity-70 block mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70">✧ Designed with magic ✧</span>
                  </motion.span>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GhibliThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        "relative w-10 h-10 rounded-full overflow-hidden",
        "bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20",
        "dark:bg-gradient-to-br dark:from-primary/15 dark:via-secondary/10 dark:to-accent/15",
        "border border-primary/30 dark:border-primary/20",
        "flex items-center justify-center shadow-sm",
      )}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Moon size={18} className="text-primary drop-shadow-sm" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, rotate: [0, 180, 360] }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ 
                duration: 0.2, 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
              className="flex items-center justify-center"
            >
              <Sun size={18} className="text-amber-500 drop-shadow-sm" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ 
                  opacity: [0.2, 0.4, 0.2] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          className={cn(
            "absolute inset-0 rounded-full",
            isDark 
              ? "bg-gradient-to-br from-indigo-500/20 via-primary/20 to-purple-600/20" 
              : "bg-gradient-to-br from-yellow-400/20 via-amber-500/20 to-orange-500/20"
          )}
          animate={{ 
            opacity: [0, 0.5, 0],
            rotate: isDark ? [0, -360] : [0, 360]
          }}
          transition={{ 
            opacity: { duration: 3, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        />
        
        {/* Sparkle effects */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className={cn(
              "absolute w-1 h-1 rounded-full",
              isDark ? "bg-primary" : "bg-amber-400"
            )}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, (i - 1) * 6],
              y: [0, (i - 1) * -6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              repeatDelay: 1,
            }}
            style={{
              top: '50%',
              left: '50%',
              filter: `blur(${i === 1 ? '0px' : '1px'})`,
            }}
          />
        ))}
      </div>
    </motion.button>
  );
}
