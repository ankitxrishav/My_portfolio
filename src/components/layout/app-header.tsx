
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2, Sun, Moon } from 'lucide-react'; 
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
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link 
          href="/#home" 
          className="flex items-center space-x-2 font-headline text-xl font-bold text-foreground hover:text-accent transition-colors ml-2"
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
        </div>
      </div>
    </header>
  );
}
