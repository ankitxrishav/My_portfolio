
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2, Sun, Moon, Menu, X } from 'lucide-react'; 
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/#home', label: 'Home' },
  { href: '/#about', label: 'About Me' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#journey-skills', label: 'Journey' },
  { href: '/#contact', label: 'Contact' },
];

interface AppHeaderProps {
  currentTheme: string;
  toggleTheme: () => void;
}

export default function AppHeader({ currentTheme, toggleTheme }: AppHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link 
            href="/#home" 
            className="flex items-center space-x-2 font-headline text-xl font-bold text-foreground hover:text-accent transition-colors ml-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <Code2 className="h-6 w-6 text-accent" />
            <span>Ankit Kumar</span>
          </Link>
          <div className="flex items-center space-x-2">
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button key={item.href} variant="ghost" asChild
                  className="text-sm font-medium transition-colors text-foreground/70"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-foreground/70 transition-colors"
            >
              {currentTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className="text-foreground/70"
              >
                <div className="relative h-6 w-6">
                   <Menu className={cn("absolute transition-all duration-300", isMenuOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")} />
                   <X className={cn("absolute transition-all duration-300", isMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")} />
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
                "text-2xl font-semibold text-foreground transition-all duration-300 hover:text-accent",
                isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              )}
              style={{ transitionDelay: isMenuOpen ? `${100 + index * 50}ms` : '0ms' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
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
