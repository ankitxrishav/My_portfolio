
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const NUM_TRAIL_DOTS = 8;
const MAIN_DOT_DEFAULT_SIZE = 10; // px
const TRAIL_DOT_DEFAULT_SIZE = 8; // px

const LERP_FACTOR_CURSOR = 0.2; 
const TRAIL_LERP_FACTOR = 0.3; 

interface Position {
  x: number;
  y: number;
}

interface MainCursorStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: string;
  opacity: number;
}

interface TrailDot extends Position {
  opacity: number;
  scale: number;
}

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [mainCursorStyle, setMainCursorStyle] = useState<MainCursorStyle>({
    x: -MAIN_DOT_DEFAULT_SIZE, 
    y: -MAIN_DOT_DEFAULT_SIZE,
    width: MAIN_DOT_DEFAULT_SIZE,
    height: MAIN_DOT_DEFAULT_SIZE,
    radius: '50%',
    opacity: 0,
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

    // Ensure interactive elements also hide system cursor
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-interactive="true"]');
    interactiveElements.forEach(elem => {
      (elem as HTMLElement).style.cursor = 'none';
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
      interactiveElements.forEach(elem => {
        (elem as HTMLElement).style.cursor = 'auto';
      });
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleMouseMove]);

  useEffect(() => {
    const animate = () => {
      setMainCursorStyle(prev => {
        const currentOpacity = isVisible ? 1 : 0;
        
        const targetX = mousePosition.x - MAIN_DOT_DEFAULT_SIZE / 2;
        const targetY = mousePosition.y - MAIN_DOT_DEFAULT_SIZE / 2;
        const targetWidth = MAIN_DOT_DEFAULT_SIZE;
        const targetHeight = MAIN_DOT_DEFAULT_SIZE;
        const targetRadius = '50%';
        
        if (prev.opacity === 0 && currentOpacity === 1) {
            return {
                x: targetX,
                y: targetY,
                width: targetWidth,
                height: targetHeight,
                radius: targetRadius,
                opacity: currentOpacity,
            };
        }
        
        return {
          x: lerp(prev.x, targetX, LERP_FACTOR_CURSOR),
          y: lerp(prev.y, targetY, LERP_FACTOR_CURSOR),
          width: lerp(prev.width, targetWidth, LERP_FACTOR_CURSOR), // Lerp size for smooth appearance
          height: lerp(prev.height, targetHeight, LERP_FACTOR_CURSOR),
          radius: targetRadius, // Radius can change instantly or be animated via CSS
          opacity: lerp(prev.opacity, currentOpacity, 0.2),
        };
      });

      setTrailDots(prevTrailDots => {
        const newTrailDots = [...prevTrailDots];
        const mainCursorCenterX = mainCursorStyle.x + mainCursorStyle.width / 2;
        const mainCursorCenterY = mainCursorStyle.y + mainCursorStyle.height / 2;

        newTrailDots.forEach((dot, index) => {
          let targetX: number;
          let targetY: number;

          if (index === 0) {
            targetX = mainCursorCenterX;
            targetY = mainCursorCenterY;
          } else {
            targetX = newTrailDots[index - 1].x;
            targetY = newTrailDots[index - 1].y;
          }
          
          dot.x = lerp(dot.x, targetX, TRAIL_LERP_FACTOR + index * 0.02);
          dot.y = lerp(dot.y, targetY, TRAIL_LERP_FACTOR + index * 0.02);
          
          dot.opacity = lerp(dot.opacity, 1 - (index / NUM_TRAIL_DOTS) * 0.7, 0.15);
          dot.scale = lerp(dot.scale, 1 - (index / NUM_TRAIL_DOTS) * 0.6, 0.15);
        });
        return newTrailDots;
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      if (mainCursorStyle.opacity < 0.1 && trailDots.some(d => d.x === -100)) {
           setTrailDots(Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ 
                x: mousePosition.x, 
                y: mousePosition.y, 
                opacity: 0, 
                scale: 1 
            })));
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } else {
        setMainCursorStyle(prev => ({...prev, opacity: lerp(prev.opacity, 0, 0.2)}));
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
        }
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isVisible, mousePosition, mainCursorStyle.opacity, mainCursorStyle.x, mainCursorStyle.y, mainCursorStyle.width, mainCursorStyle.height]);


  if (!isVisible && mainCursorStyle.opacity < 0.01) { 
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      <div
        className="absolute shadow-lg bg-accent/70 backdrop-blur-sm"
        style={{
          left: `${mainCursorStyle.x}px`,
          top: `${mainCursorStyle.y}px`,
          width: `${mainCursorStyle.width}px`,
          height: `${mainCursorStyle.height}px`,
          borderRadius: mainCursorStyle.radius,
          opacity: mainCursorStyle.opacity,
          transition: 'border-radius 0.1s ease-out', // Keep radius transition for smoothness if needed
          boxSizing: 'border-box',
        }}
      />
      {trailDots.map((dot, index) => (
        dot.opacity > 0.01 && 
        <div
          key={index}
          className="absolute bg-accent/50 rounded-full backdrop-blur-xs" 
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${TRAIL_DOT_DEFAULT_SIZE * dot.scale}px`,
            height: `${TRAIL_DOT_DEFAULT_SIZE * dot.scale}px`,
            opacity: dot.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
