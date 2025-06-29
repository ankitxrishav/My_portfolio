"use client";

import { useState, useEffect, useLayoutEffect } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer';
import ThreeCanvas from '@/components/three-canvas';
import CustomCursor from '@/components/ui/custom-cursor';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';


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

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
    });

    return () => {
      // Cleanup GSAP context
      if (smoother) smoother.kill();
    };
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
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
      <body className="font-body antialiased bg-background text-foreground">
        <CustomCursor />
        <ThreeCanvas /> 
        <AppHeader currentTheme={theme} toggleTheme={toggleTheme} />
        
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <main className="flex-grow relative z-10">
              {children}
            </main>
            <AppFooter />
          </div>
        </div>
        
        <Toaster />
      </body>
    </html>
  );
}
