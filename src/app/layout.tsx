
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
    const textElement = document.getElementById('preloader-text') as HTMLElement;
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;

    if (!preloader || !textElement || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    document.body.style.overflow = 'hidden';

    class Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      life: number;

      constructor(x: number, y: number, color: string) {
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.life = 1;
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.vy += 0.05; // gravity
        this.life -= 0.01;
        if (this.life < 0) this.life = 0;
      }

      explode() {
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15;
      }
    }

    function initParticles() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const computedStyle = window.getComputedStyle(textElement!);
      const font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
      ctx!.font = font;
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      
      const text = textElement!.innerText;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      ctx!.fillStyle = '#fff';
      ctx!.fillText(text, centerX, centerY);

      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      particles = [];
      const density = 4;

      for (let y = 0; y < canvas.height; y += density) {
        for (let x = 0; x < canvas.width; x += density) {
          const index = (y * canvas.width + x) * 4;
          if (data[index + 3] > 128) {
            const red = data[index];
            const green = data[index + 1];
            const blue = data[index + 2];
            const color = `rgb(${red},${green},${blue})`;
            particles.push(new Particle(x, y, color));
          }
        }
      }
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
      }
    }
    
    let animationFrameId: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillAlive = false;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life > 0) {
          stillAlive = true;
        }
      }
      if (stillAlive) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    let isFinished = false;
    const finishLoading = () => {
      if (isFinished) return;
      isFinished = true;
      textElement.style.display = 'none';
      particles.forEach(p => p.explode());
      animate();

      gsap.to(preloader, {
        opacity: 0,
        duration: 1,
        delay: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = 'auto';
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
        }
      });
    };
    
    const startAnimation = async () => {
      await document.fonts.ready;
      initParticles();
      window.addEventListener('load', finishLoading);
      const fallbackTimeout = setTimeout(finishLoading, 5000);

      const handleResize = () => {
        initParticles();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('load', finishLoading);
        window.removeEventListener('resize', handleResize);
        clearTimeout(fallbackTimeout);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      }
    }
    
    const cleanupPromise = startAnimation();

    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup());
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
