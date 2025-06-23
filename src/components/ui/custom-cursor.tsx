"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const MAIN_DOT_DEFAULT_SIZE = 10;
const TRAIL_DOT_DEFAULT_SIZE = 8; 
const NUM_TRAIL_DOTS = 15;
const LERP_FACTOR_CURSOR = 0.6;
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
    backgroundColor: 'hsl(var(--accent) / 0.7)',
    borderRadius: '50%',
  });
  const [trailDots, setTrailDots] = useState<TrailDot[]>(
    Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ x: -100, y: -100, opacity: 0, scale: 1 }))
  );
  const [isVisible, setIsVisible] = useState(false);

  const animationFrameIdRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    setMousePosition({ x: event.clientX, y: event.clientY });
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
        const targetX = mousePosition.x;
        const targetY = mousePosition.y;

        return {
          ...prevStyle,
          x: lerp(prevStyle.x, targetX - prevStyle.width / 2, LERP_FACTOR_CURSOR),
          y: lerp(prevStyle.y, targetY - prevStyle.height / 2, LERP_FACTOR_CURSOR),
          width: lerp(prevStyle.width, MAIN_DOT_DEFAULT_SIZE, LERP_FACTOR_CURSOR * 1.5),
          height: lerp(prevStyle.height, MAIN_DOT_DEFAULT_SIZE, LERP_FACTOR_CURSOR * 1.5),
          opacity: lerp(prevStyle.opacity, isVisible ? 1 : 0, 0.2),
          backgroundColor: 'hsl(var(--accent) / 0.7)', 
          borderRadius: '50%', 
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
          
          dot.opacity = lerp(dot.opacity, isVisible ? baseOpacity : 0, 0.2);
          dot.scale = lerp(dot.scale, baseScale, 0.2);
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
  }, [isVisible, mousePosition, mainCursorStyle.opacity, mainCursorStyle.width, mainCursorStyle.height]);


  if (!isVisible && mainCursorStyle.opacity < 0.01 && trailDots.every(d => d.opacity < 0.01)) {
    return null;
  }
  
  const rootCursorClasses = cn(
    "fixed inset-0 pointer-events-none z-[9999]"
  );

  return (
    <div className={rootCursorClasses} aria-hidden="true">
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
          transition: 'width 0.2s ease-out, height 0.2s ease-out, background-color 0.2s ease-out, border-radius 0.2s ease-out, opacity 0.2s ease-out',
          boxSizing: 'border-box',
        }}
      />
      {trailDots.map((dot, index) => (
        (isVisible || dot.opacity > 0.01) && 
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
