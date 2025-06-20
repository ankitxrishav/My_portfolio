
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const MAIN_DOT_DEFAULT_SIZE = 10;
const MAIN_DOT_HERO_HOVER_SIZE = 90; // Increased size for hero text hover
const TRAIL_DOT_DEFAULT_SIZE = 8;
const NUM_TRAIL_DOTS = 8; // Number of trail dots
const LERP_FACTOR_CURSOR = 0.15; // How smoothly the main dot follows
const TRAIL_LERP_FACTOR = 0.25; // How smoothly trail dots follow

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
    backgroundColor: 'hsl(var(--accent))',
    borderRadius: '50%',
  });
  const [trailDots, setTrailDots] = useState<TrailDot[]>(
    Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ x: -100, y: -100, opacity: 0, scale: 1 }))
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringHeroText, setIsHoveringHeroText] = useState(false);

  const animationFrameIdRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    setMousePosition({ x: event.clientX, y: event.clientY });

    const target = event.target as HTMLElement;
    if (target.closest('[data-cursor-hero-text="true"]')) {
      setIsHoveringHeroText(true);
    } else {
      setIsHoveringHeroText(false);
    }
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
      // Main cursor animation
      setMainCursorStyle(prev => {
        const targetX = mousePosition.x;
        const targetY = mousePosition.y;
        let targetWidth = MAIN_DOT_DEFAULT_SIZE;
        let targetHeight = MAIN_DOT_DEFAULT_SIZE;
        let targetBgColor = 'hsl(var(--accent))'; // Default accent color

        if (isHoveringHeroText) {
          targetWidth = MAIN_DOT_HERO_HOVER_SIZE;
          targetHeight = MAIN_DOT_HERO_HOVER_SIZE;
          // Keep accent color for hero hover, text color will contrast
        }

        const newX = lerp(prev.x, targetX - targetWidth / 2, LERP_FACTOR_CURSOR);
        const newY = lerp(prev.y, targetY - targetHeight / 2, LERP_FACTOR_CURSOR);

        return {
          x: newX,
          y: newY,
          width: lerp(prev.width, targetWidth, LERP_FACTOR_CURSOR * 1.5),
          height: lerp(prev.height, targetHeight, LERP_FACTOR_CURSOR * 1.5),
          opacity: lerp(prev.opacity, isVisible ? 1 : 0, 0.2),
          backgroundColor: targetBgColor,
          borderRadius: '50%', // Always circular
        };
      });

      // Trail dots animation
      setTrailDots(prevTrailDots => {
        const newTrailDots = [...prevTrailDots];
        const mainCursorCenterX = mainCursorStyle.x + mainCursorStyle.width / 2;
        const mainCursorCenterY = mainCursorStyle.y + mainCursorStyle.height / 2;

        newTrailDots.forEach((dot, index) => {
          const targetX = index === 0 ? mainCursorCenterX : newTrailDots[index - 1].x;
          const targetY = index === 0 ? mainCursorCenterY : newTrailDots[index - 1].y;

          dot.x = lerp(dot.x, targetX, TRAIL_LERP_FACTOR + index * 0.02);
          dot.y = lerp(dot.y, targetY, TRAIL_LERP_FACTOR + index * 0.02);

          const baseOpacity = 1 - (index / NUM_TRAIL_DOTS) * 0.7;
          const baseScale = 1 - (index / NUM_TRAIL_DOTS) * 0.6;
          
          // Fade out trail more if hovering hero text
          const opacityMultiplier = isHoveringHeroText ? 0.1 : 1;
          const scaleMultiplier = isHoveringHeroText ? 0.2 : 1;

          dot.opacity = lerp(dot.opacity, baseOpacity * opacityMultiplier, 0.2);
          dot.scale = lerp(dot.scale, baseScale * scaleMultiplier, 0.2);
        });
        return newTrailDots;
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      // Initialize trail dots if they are at the initial off-screen position
      // and main cursor is becoming visible
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
    } else { // When isVisible is false
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        setMainCursorStyle(prev => ({
            ...prev,
            opacity: lerp(prev.opacity, 0, 0.2),
            width: lerp(prev.width, MAIN_DOT_DEFAULT_SIZE, 0.2),
            height: lerp(prev.height, MAIN_DOT_DEFAULT_SIZE, 0.2),
            backgroundColor: 'hsl(var(--accent))', // Revert to default for main dot
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
  }, [isVisible, mousePosition, isHoveringHeroText]); // Corrected dependency array

  // Only render if the cursor or trail is meant to be somewhat visible
  if (!isVisible && mainCursorStyle.opacity < 0.01 && trailDots.every(d => d.opacity < 0.01)) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
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
          transition: 'background-color 0.2s ease-out, border-color 0.2s ease-out',
        }}
      />
      {/* Trail Dots */}
      {trailDots.map((dot, index) => (
        dot.opacity > 0.01 &&
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${TRAIL_DOT_DEFAULT_SIZE * dot.scale}px`,
            height: `${TRAIL_DOT_DEFAULT_SIZE * dot.scale}px`,
            opacity: dot.opacity,
            backgroundColor: 'hsl(var(--accent) / 0.5)', // Trail dots are semi-transparent accent
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)', // Center the trail dots
          }}
        />
      ))}
    </div>
  );
}

