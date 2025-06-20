
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  createdAt: number;
  color: string; // Added color property
}

const MAX_PARTICLES = 35; // Increased for a longer tail
const PARTICLE_LIFESPAN = 1000; // Increased for a longer tail (milliseconds)
const PARTICLE_INITIAL_SIZE = 8; // px

// Array of bright colors for the particles
const BRIGHT_COLORS = [
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#39FF14', // Neon Green
  '#FFD700', // Gold
  '#FF69B4', // Hot Pink
  '#7FFF00', // Chartreuse
];

export default function CustomCursor() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef<number>();
  const lastParticleTimeRef = useRef<number>(0);
  const particleIdCounterRef = useRef<number>(0);

  const createParticle = useCallback((x: number, y: number) => {
    const colorIndex = particleIdCounterRef.current % BRIGHT_COLORS.length;
    const newParticle: Particle = {
      id: particleIdCounterRef.current++,
      x: x - PARTICLE_INITIAL_SIZE / 2,
      y: y - PARTICLE_INITIAL_SIZE / 2,
      size: PARTICLE_INITIAL_SIZE,
      opacity: 1,
      createdAt: performance.now(),
      color: BRIGHT_COLORS[colorIndex], // Assign color
    };

    setParticles(prev => {
      const updatedParticles = [newParticle, ...prev];
      if (updatedParticles.length > MAX_PARTICLES) {
        return updatedParticles.slice(0, MAX_PARTICLES);
      }
      return updatedParticles;
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const now = performance.now();
      setMousePosition({ x: event.clientX, y: event.clientY });
      if (!isVisible) setIsVisible(true);

      if (now - lastParticleTimeRef.current > 30) { 
        createParticle(event.clientX, event.clientY);
        lastParticleTimeRef.current = now;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.body.style.cursor = 'none';
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-interactive="true"]');
    interactiveElements.forEach(el => (el as HTMLElement).style.cursor = 'none');

    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles
          .map(p => {
            const age = performance.now() - p.createdAt;
            if (age > PARTICLE_LIFESPAN) {
              return null; 
            }
            const progress = age / PARTICLE_LIFESPAN;
            return {
              ...p,
              opacity: 1 - progress,
              size: PARTICLE_INITIAL_SIZE * (1 - progress * 0.75),
            };
          })
          .filter(p => p !== null) as Particle[]
      );
      requestRef.current = requestAnimationFrame(animateParticles);
    };

    requestRef.current = requestAnimationFrame(animateParticles);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      document.body.style.cursor = '';
      interactiveElements.forEach(el => (el as HTMLElement).style.cursor = '');
    };
  }, [isVisible, createParticle]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed rounded-full pointer-events-none z-[9999]"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${Math.max(0, particle.size)}px`,
            height: `${Math.max(0, particle.size)}px`,
            opacity: particle.opacity,
            backgroundColor: particle.color, // Use dynamic particle color
            transform: `translate(-50%, -50%) scale(${Math.max(0, particle.size / PARTICLE_INITIAL_SIZE)})`,
            transition: 'opacity 0.05s ease-out, transform 0.05s ease-out',
          }}
        />
      ))}
      <div
        className="fixed w-1.5 h-1.5 rounded-full bg-accent pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[9999]"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />
    </>
  );
}
