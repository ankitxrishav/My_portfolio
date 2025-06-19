
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
  const [theme, setTheme] = useState('dark'); // Default to dark theme initially

  useEffect(() => {
    // This effect runs once on mount to check if a light theme was explicitly set by user
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setTheme('light');
    } else {
      // For any other case (no stored theme, or stored theme is dark), ensure dark theme.
      setTheme('dark'); 
      // Optionally, you might want to clear or set localStorage to 'dark' here if consistency is desired
      // localStorage.setItem('theme', 'dark'); 
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
