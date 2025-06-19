
"use client";

import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer';
import ThreeCanvas from '@/components/three-canvas';
import CustomCursor from '@/components/ui/custom-cursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState('light'); // Default to light theme initially

  useEffect(() => {
    // This effect runs once on mount to check stored preferences or system settings
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
    // If no stored theme and no dark preference, it remains 'light' as per initial state
  }, []); 

  useEffect(() => {
    // This effect applies the theme to the document and updates localStorage
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <html lang="en"> 
      <head>
        <title>Ankit Kumar - ML Engineer Portfolio</title>
        <meta name="description" content="Portfolio of Ankit Kumar, a Machine Learning Engineer." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <CustomCursor />
        <ThreeCanvas />
        <AppHeader currentTheme={theme} toggleTheme={toggleTheme} />
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          {children}
        </main>
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
