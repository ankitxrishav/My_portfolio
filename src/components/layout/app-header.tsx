"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2, Sun, Moon, Menu, X } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

const navItems = [
  { href: '/#home', label: 'Home' },
  { href: '/#about', label: 'About Me' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#journey-skills', label: 'Journey' },
  { href: '/#contact', label: 'Contact' },
];

interface AppHeaderProps {
  currentTheme: string;
  toggleTheme: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function AppHeader({ currentTheme, toggleTheme }: AppHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // GSAP plugins are registered in layout.tsx, but we must ensure they are
    // available here for the get() method to work.
    gsap.registerPlugin(ScrollSmoother);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const smoother = ScrollSmoother.get();
    if (smoother && href.includes('#')) {
      const id = href.substring(href.indexOf('#'));
      smoother.scrollTo(id, true);
    }
    setIsMenuOpen(false);
  };
  
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
        e.preventDefault();
        const smoother = ScrollSmoother.get();
        smoother?.scrollTo('#home', true);
        setIsMenuOpen(false);
    }
  }

  return (
    <>
      <header id="app-header" className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-screen-md -translate-x-1/2">
        <div className="flex h-16 items-center justify-between rounded-full border border-border/40 bg-card px-4 shadow-lg backdrop-blur-lg supports-[backdrop-filter]:bg-card md:px-6">
          <Link 
            href="/#home" 
            className="flex items-center space-x-2 font-headline font-bold text-foreground hover:text-accent transition-colors"
            onClick={handleLogoClick}
          >
            <Code2 className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
            <span className="text-base sm:text-lg">Ankit Kumar</span>
          </Link>
          <div className="flex items-center space-x-1 md:space-x-2">
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button key={item.href} variant="ghost" asChild
                  className="text-sm font-medium transition-colors text-foreground/70"
                >
                  <Link href={item.href} onClick={(e) => handleNavClick(e, item.href)}>{item.label}</Link>
                </Button>
              ))}
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => toggleTheme(e)}
              aria-label="Toggle theme"
              className="text-foreground/70 transition-colors"
            >
              {currentTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className="text-foreground/70 transition-transform duration-200 hover:scale-110"
              >
                <div className="relative h-6 w-6">
                   <Menu className={cn("absolute inset-0 m-auto h-6 w-6 transition-all duration-300", isMenuOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")} />
                   <X className={cn("absolute inset-0 m-auto h-6 w-6 transition-all duration-300", isMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-lg transition-opacity duration-300 ease-in-out md:hidden",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "animated-underline text-2xl font-semibold text-foreground transition-all duration-300 hover:text-accent",
                isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
              )}
              style={{ transitionDelay: isMenuOpen ? `${100 + index * 50}ms` : '0ms' }}
              onClick={(e) => {
                e.stopPropagation();
                handleNavClick(e, item.href);
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
