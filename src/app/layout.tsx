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
  const [theme, setTheme] = useState('dark');

  // This effect runs once on the client to set the initial theme from storage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, []); 

  // This effect synchronizes the theme state with the DOM and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    // @ts-ignore
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }
    
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.style.setProperty('--reveal-x', `${x}px`);
    document.documentElement.style.setProperty('--reveal-y', `${y}px`);
    document.documentElement.style.setProperty('--reveal-radius', `${endRadius}px`);

    // @ts-ignore
    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  return (
    <html lang="en"> 
      <head>
        <title>Ankit Kumar Portfolio</title>
        <meta name="description" content="Portfolio of Ankit Kumar, an AIML Enthusiast & Builder." />
        <link rel="icon" href="data:image/x-icon;base64,=" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#222222" media="(prefers-color-scheme: dark)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <CustomCursor />
        <ThreeCanvas /> 
        <AppHeader currentTheme={theme} toggleTheme={toggleTheme} />
        
        <main className="flex-grow relative z-10">
          {children}
        </main>
        
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
