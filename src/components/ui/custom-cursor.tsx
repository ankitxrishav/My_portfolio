
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const NUM_TRAIL_DOTS = 8;
const LERP_FACTOR = 0.2; // How quickly the main dot follows the mouse
const TRAIL_LERP_FACTOR = 0.3; // How quickly trail dots follow the one in front

interface Position {
  x: number;
  y: number;
}

interface TrailDot extends Position {
  opacity: number;
  scale: number;
}

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [cursorDotPosition, setCursorDotPosition] = useState<Position>({ x: -100, y: -100 }); // Start off-screen
  const [trailDots, setTrailDots] = useState<TrailDot[]>(
    Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ x: -100, y: -100, opacity: 1, scale: 1 }))
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
      // Animate main cursor dot
      setCursorDotPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * LERP_FACTOR,
        y: prev.y + (mousePosition.y - prev.y) * LERP_FACTOR,
      }));

      // Animate trail dots
      setTrailDots((prevTrailDots) => {
        const newTrailDots = [...prevTrailDots];
        newTrailDots.forEach((dot, index) => {
          let targetX: number;
          let targetY: number;

          if (index === 0) {
            targetX = cursorDotPosition.x;
            targetY = cursorDotPosition.y;
          } else {
            targetX = newTrailDots[index - 1].x;
            targetY = newTrailDots[index - 1].y;
          }
          
          dot.x += (targetX - dot.x) * (TRAIL_LERP_FACTOR + index * 0.02); // Vary lerp for staggered effect
          dot.y += (targetY - dot.y) * (TRAIL_LERP_FACTOR + index * 0.02);
          
          // Decrease opacity and scale for dots further down the trail
          dot.opacity = 1 - (index / NUM_TRAIL_DOTS) * 0.7; // Fade more gently
          dot.scale = 1 - (index / NUM_TRAIL_DOTS) * 0.6;   // Shrink more gently
        });
        return newTrailDots;
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      // Initialize dot positions to current mouse position when first made visible
      // to avoid jumping from (-100, -100)
      if (cursorDotPosition.x === -100 && cursorDotPosition.y === -100) {
        setCursorDotPosition({ x: mousePosition.x, y: mousePosition.y });
        setTrailDots( Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ 
            x: mousePosition.x, 
            y: mousePosition.y, 
            opacity: 1, 
            scale: 1 
        })));
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } else {
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
        }
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [mousePosition, cursorDotPosition, isVisible]); // isVisible added here

  if (!isVisible) {
    return null; // Don't render anything until the first mouse move
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Trail Dots */}
      {trailDots.map((dot, index) => (
        <div
          key={index}
          className="absolute bg-accent rounded-full"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${8 * dot.scale}px`, // Base size for trail dots
            height: `${8 * dot.scale}px`,
            opacity: dot.opacity,
            transform: `translate(-50%, -50%) scale(${dot.scale})`,
            transition: 'opacity 0.05s linear, transform 0.05s linear', // Smoother visual updates
          }}
        />
      ))}
      {/* Main Cursor Dot */}
      <div
        className="absolute bg-accent rounded-full shadow-lg"
        style={{
          left: `${cursorDotPosition.x}px`,
          top: `${cursorDotPosition.y}px`,
          width: '10px', // Main dot size
          height: '10px',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
