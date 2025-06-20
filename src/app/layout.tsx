
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
  const [theme, setTheme] = useState('dark'); // Default to dark theme

  useEffect(() => {
    // This effect runs once on mount
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setTheme('light');
    } else {
      // Default to dark if no theme stored or if stored theme is 'dark'
      setTheme('dark'); 
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', 'dark');
      }
    }
  }, []); 

  useEffect(() => {
    // This effect applies the theme to the document and updates localStorage
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Only save to localStorage if window is defined (client-side)
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
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-a.png" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#222222" media="(prefers-color-scheme: dark)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      {/* Ensure body takes full height and manages overall page structure */}
      <body className="font-body antialiased bg-background text-foreground h-screen flex flex-col overflow-hidden">
        <CustomCursor />
        {/* ThreeCanvas is fixed, so it's outside the main flow */}
        <ThreeCanvas /> 
        <AppHeader currentTheme={theme} toggleTheme={toggleTheme} />
        
        {/* Horizontal scroll container takes remaining space and handles content scrolling */}
        <div className="horizontal-scroll-container flex-grow">
          {children}
        </div>
        
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
