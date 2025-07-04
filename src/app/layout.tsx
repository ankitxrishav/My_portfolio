
"use client";

import { useState, useEffect, useLayoutEffect } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Preloader from '@/components/layout/preloader';
import PreloaderShimmer from '@/components/layout/preloader-shimmer';
import PreloaderTypewriter from '@/components/layout/preloader-typewriter';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const ThreeCanvas = dynamic(() => import('@/components/three-canvas'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/ui/custom-cursor'), { ssr: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState('dark');
  const [preloaderVariant, setPreloaderVariant] = useState<'stroke' | 'shimmer' | 'typewriter' | null>(null);

  useEffect(() => {
    const variants: Array<'stroke' | 'shimmer' | 'typewriter'> = ['stroke', 'shimmer', 'typewriter'];
    const lastIndexStr = localStorage.getItem('preloaderIndex');
    const lastIndex = lastIndexStr ? parseInt(lastIndexStr, 10) : -1;
    const nextIndex = (lastIndex + 1) % variants.length;
    localStorage.setItem('preloaderIndex', nextIndex.toString());
    setPreloaderVariant(variants[nextIndex]);

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
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            preloader.style.display = 'none';
            document.body.style.overflow = 'auto';
          }
        });
      } else {
        document.body.style.overflow = 'auto';
      }
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
        .to({}, {duration: 0.5});

    } else if (preloaderVariant === 'shimmer') {
        const textElement = document.getElementById('preloader-text');
        if (!textElement) {
            onComplete();
            return;
        }

        textElement.classList.add('shimmer-effect');
        tl = gsap.timeline();
        tl.to({}, {delay: 6, onComplete}); // Wait for CSS animation (2s * 3 iterations)
    } else if (preloaderVariant === 'typewriter') {
        const letters = document.querySelectorAll<HTMLElement>('.preloader-letter');
        const cursor = document.getElementById('cursor');
        if (letters.length === 0 || !cursor) {
            onComplete();
            return;
        }

        // Initially hide all letters so they don't take up space, and ensure cursor is visible and blinking
        gsap.set(letters, { display: 'none' });
        gsap.set(cursor, { opacity: 1, display: 'inline-block' });
        if(cursor) cursor.style.animation = 'blink 1s step-end infinite';


        tl = gsap.timeline({ onComplete });
        
        const typeSpeed = 0.1;

        // Animate each letter appearing, which pushes the cursor to the right
        letters.forEach((letter) => {
            tl.set(letter, { display: 'inline-block' }, `+=${typeSpeed}`);
        });

        // After typing, stop the CSS blink and make it blink with GSAP, then fade out
        tl.call(() => {
            if (cursor) cursor.style.animation = 'none';
        })
        .to(cursor, {
            opacity: 0,
            ease: 'power1.inOut',
            duration: 0.5,
            repeat: 2, // blink
            yoyo: true
        }, '+=0.5')
        .to({}, {duration: 0.5});
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}> 
      <head>
        <title>Ankit Kumar Portfolio</title>
        <meta name="description" content="Portfolio of Ankit Kumar, an AIML Enthusiast & Builder." />
        <link rel="icon" href="data:image/x-icon;base64,=" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#222222" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {preloaderVariant && (
            <>
              {preloaderVariant === 'stroke' && <Preloader />}
              {preloaderVariant === 'shimmer' && <PreloaderShimmer />}
              {preloaderVariant === 'typewriter' && <PreloaderTypewriter />}
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
