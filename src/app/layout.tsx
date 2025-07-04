
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
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

    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    const letters = document.querySelectorAll('#preloader-text span');
    const percentageEl = document.getElementById('preloader-percentage');

    if (!preloader || !preloaderText || letters.length === 0 || !percentageEl) return;

    document.body.style.overflow = 'hidden';
    
    gsap.set(letters, {
      x: () => Math.random() * window.innerWidth - window.innerWidth / 2,
      y: () => Math.random() * window.innerHeight - window.innerHeight / 2,
      rotation: () => Math.random() * 360 - 180,
      opacity: 1,
    });

    const loadingProgress = { value: 0 };
    const loadingTween = gsap.to(loadingProgress, {
      value: 99,
      duration: 4,
      ease: 'power1.in',
      onUpdate: () => {
        percentageEl.textContent = `${Math.floor(loadingProgress.value)}%`;
      }
    });

    let isFinished = false;
    const finishLoading = () => {
      if (isFinished) return;
      isFinished = true;

      loadingTween.kill();
      percentageEl.textContent = '100%';

      const tl = gsap.timeline();

      tl.to(letters, {
        x: 0,
        y: 0,
        rotation: 0,
        ease: 'power3.inOut',
        duration: 1.2,
        stagger: {
          amount: 0.8,
          from: "random",
        }
      })
      .to(letters, {
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        stagger: 0.1,
      }, "-=0.5")
      .to(percentageEl, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, "+=0.3")
      .to(preloaderText, {
        scale: 1.5,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
      }, "<")
      .to(preloader, {
        opacity: 0,
        duration: 1.0,
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      }, "-=0.5");
    };

    window.addEventListener('load', finishLoading);
    const fallbackTimeout = setTimeout(finishLoading, 5000); 

    return () => {
      window.removeEventListener('load', finishLoading);
      clearTimeout(fallbackTimeout);
      document.body.style.overflow = 'auto';
    };
  }, []);

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
        <Preloader />
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
