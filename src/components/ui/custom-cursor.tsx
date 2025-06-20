
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const MAIN_DOT_DEFAULT_SIZE = 10;
const MAIN_DOT_HERO_HOVER_SIZE = 90; // Size when hovering hero text
const TRAIL_DOT_DEFAULT_SIZE = 8;
const NUM_TRAIL_DOTS = 8;
const LERP_FACTOR_CURSOR = 0.15;
const TRAIL_LERP_FACTOR = 0.25;

interface Position {
  x: number;
  y: number;
}

interface MainCursorStyle extends Position {
  width: number;
  height: number;
  opacity: number;
  backgroundColor: string;
  borderRadius: string;
  isHoveringHeroText: boolean;
}

interface TrailDot extends Position {
  opacity: number;
  scale: number;
}

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: -1000, y: -1000 });
  const [mainCursorStyle, setMainCursorStyle] = useState<MainCursorStyle>({
    x: -MAIN_DOT_DEFAULT_SIZE,
    y: -MAIN_DOT_DEFAULT_SIZE,
    width: MAIN_DOT_DEFAULT_SIZE,
    height: MAIN_DOT_DEFAULT_SIZE,
    opacity: 0,
    backgroundColor: 'hsl(var(--accent))',
    borderRadius: '50%',
    isHoveringHeroText: false,
  });
  const [trailDots, setTrailDots] = useState<TrailDot[]>(
    Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ x: -100, y: -100, opacity: 0, scale: 1 }))
  );
  const [isVisible, setIsVisible] = useState(false);
  // No longer need hoveredElementInfo for general magnetic effect

  const animationFrameIdRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    setMousePosition({ x: event.clientX, y: event.clientY });

    const target = event.target as HTMLElement;
    const isHeroTextHover = !!target.closest('[data-cursor-hero-text="true"]');
    
    setMainCursorStyle(prev => ({
      ...prev,
      isHoveringHeroText: isHeroTextHover,
    }));

  }, [isVisible]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleMouseMove]);

  useEffect(() => {
    const animate = () => {
      setMainCursorStyle(prevStyle => {
        let targetX = mousePosition.x;
        let targetY = mousePosition.y;
        let targetWidth = MAIN_DOT_DEFAULT_SIZE;
        let targetHeight = MAIN_DOT_DEFAULT_SIZE;
        let targetBorderRadius = '50%';
        let targetBackgroundColor = 'hsl(var(--accent) / 0.7)'; // Default filled look
        
        if (prevStyle.isHoveringHeroText) {
          targetWidth = MAIN_DOT_HERO_HOVER_SIZE;
          targetHeight = MAIN_DOT_HERO_HOVER_SIZE;
          targetBackgroundColor = 'hsl(var(--accent))'; // Solid accent for hero text background
        }

        return {
          ...prevStyle,
          x: lerp(prevStyle.x, targetX - targetWidth / 2, LERP_FACTOR_CURSOR),
          y: lerp(prevStyle.y, targetY - targetHeight / 2, LERP_FACTOR_CURSOR),
          width: lerp(prevStyle.width, targetWidth, LERP_FACTOR_CURSOR * 1.5),
          height: lerp(prevStyle.height, targetHeight, LERP_FACTOR_CURSOR * 1.5),
          opacity: lerp(prevStyle.opacity, isVisible ? 1 : 0, 0.2),
          backgroundColor: targetBackgroundColor,
          borderRadius: targetBorderRadius, // Lerp if you want smooth radius changes
        };
      });

      setTrailDots(prevTrailDots => {
        const newTrailDots = [...prevTrailDots];
        const mainDotCenterX = mainCursorStyle.x + mainCursorStyle.width / 2;
        const mainDotCenterY = mainCursorStyle.y + mainCursorStyle.height / 2;

        newTrailDots.forEach((dot, index) => {
          const targetX = index === 0 ? mainDotCenterX : newTrailDots[index - 1].x;
          const targetY = index === 0 ? mainDotCenterY : newTrailDots[index - 1].y;

          dot.x = lerp(dot.x, targetX, TRAIL_LERP_FACTOR + index * 0.02);
          dot.y = lerp(dot.y, targetY, TRAIL_LERP_FACTOR + index * 0.02);
          
          const baseOpacity = 1 - (index / NUM_TRAIL_DOTS) * 0.7;
          const baseScale = 1 - (index / NUM_TRAIL_DOTS) * 0.6;
          
          // Fade out trail more if hovering hero text
          const opacityMultiplier = mainCursorStyle.isHoveringHeroText ? 0.1 : 1;
          const scaleMultiplier = mainCursorStyle.isHoveringHeroText ? 0.2 : 1;

          dot.opacity = lerp(dot.opacity, baseOpacity * opacityMultiplier, 0.2);
          dot.scale = lerp(dot.scale, baseScale * scaleMultiplier, 0.2);
        });
        return newTrailDots;
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      if (mainCursorStyle.opacity < 0.1 && trailDots.some(d => d.x === -100 && d.y === -100)) {
        setTrailDots(
          Array(NUM_TRAIL_DOTS).fill(null).map(() => ({
            x: mousePosition.x,
            y: mousePosition.y,
            opacity: 0,
            scale: 1
          }))
        );
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } else {
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        setMainCursorStyle(prev => ({
            ...prev,
            opacity: lerp(prev.opacity, 0, 0.2),
            width: lerp(prev.width, MAIN_DOT_DEFAULT_SIZE, 0.2),
            height: lerp(prev.height, MAIN_DOT_DEFAULT_SIZE, 0.2),
            backgroundColor: 'hsl(var(--accent) / 0.7)',
            borderRadius: '50%',
            isHoveringHeroText: false, 
        }));
        setTrailDots(prevTrailDots => prevTrailDots.map(dot => ({
            ...dot,
            opacity: lerp(dot.opacity, 0, 0.2),
            scale: lerp(dot.scale, 0, 0.2)
        })));
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isVisible, mousePosition, mainCursorStyle.isHoveringHeroText]); // Corrected dependency array

  if (!isVisible && mainCursorStyle.opacity < 0.01 && trailDots.every(d => d.opacity < 0.01)) {
    return null;
  }
  
  const rootCursorClasses = cn(
    "fixed inset-0 pointer-events-none",
    mainCursorStyle.isHoveringHeroText ? "z-[5]" : "z-[9999]" 
  );

  return (
    <div className={rootCursorClasses} aria-hidden="true">
      {/* Main Cursor Dot */}
      <div
        style={{
          position: 'absolute',
          left: `${mainCursorStyle.x}px`,
          top: `${mainCursorStyle.y}px`,
          width: `${mainCursorStyle.width}px`,
          height: `${mainCursorStyle.height}px`,
          opacity: mainCursorStyle.opacity,
          backgroundColor: mainCursorStyle.backgroundColor,
          borderRadius: mainCursorStyle.borderRadius,
          transition: 'width 0.2s ease-out, height 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out, border-radius 0.2s ease-out, opacity 0.2s ease-out',
          boxSizing: 'border-box',
        }}
      />
      {/* Trail Dots */}
      {trailDots.map((dot, index) => (
        dot.opacity > 0.01 && (isVisible || dot.opacity > 0.1) && // Ensure dots fade out even if cursor quickly disappears
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${TRAIL_DOT_DEFAULT_SIZE * dot.scale}px`,
            height: `${TRAIL_DOT_DEFAULT_SIZE * dot.scale}px`,
            opacity: dot.opacity,
            backgroundColor: 'hsl(var(--accent) / 0.5)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
