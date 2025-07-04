
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
import Preloader from '@/components/layout/preloader';
import PreloaderShimmer from '@/components/layout/preloader-shimmer';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState('dark');
  const [preloaderVariant, setPreloaderVariant] = useState<'stroke' | 'shimmer' | null>(null);

  useEffect(() => {
    // Randomly select preloader on client mount to avoid hydration errors
    setPreloaderVariant(Math.random() < 0.5 ? 'stroke' : 'shimmer');

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, []); 

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
    
    if (!preloaderVariant) return;

    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    document.body.style.overflow = 'hidden';

    let tl: gsap.core.Timeline;

    const onComplete = () => {
      if (preloader) {
        preloader.style.display = 'none';
      }
      document.body.style.overflow = 'auto';
    };

    if (preloaderVariant === 'stroke') {
        const letters = document.querySelectorAll<HTMLElement>('.preloader-letter');
        if (letters.length === 0) {
            onComplete();
            return;
        };

        tl = gsap.timeline({ onComplete });
        
        tl.to(letters, {
            color: 'white',
            stagger: 0.1,
            ease: 'power1.inOut',
            duration: 0.5,
        })
        .to(preloader, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
        }, '+=0.5');

    } else if (preloaderVariant === 'shimmer') {
        const textElement = document.getElementById('preloader-text');
        if (!textElement) {
            onComplete();
            return;
        }

        textElement.classList.add('shimmer-effect');

        tl = gsap.timeline({ onComplete });

        tl.to(preloader, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            delay: 6 // Wait for 3 shimmer cycles (2s each)
        });
    }

    return () => {
      if (tl) tl.kill();
      document.body.style.overflow = 'auto';
    };
  }, [preloaderVariant]);

  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
    });

    return () => {
      if (smoother) smoother.kill();
    };
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

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

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      document.documentElement.style.removeProperty('--reveal-x');
      document.documentElement.style.removeProperty('--reveal-y');
      document.documentElement.style.removeProperty('--reveal-radius');
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
      <body className="font-body antialiased bg-background text-foreground">
        {preloaderVariant && (
            <>
              {preloaderVariant === 'stroke' && <Preloader />}
              {preloaderVariant === 'shimmer' && <PreloaderShimmer />}
            </>
        )}
        {!preloaderVariant && <div id="preloader" className="fixed inset-0 z-[99999] bg-black"></div>}
        
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
