
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const MAIN_DOT_DEFAULT_SIZE = 10; // px
const MAIN_DOT_HOVER_SIZE = 40; // px, size when hovering interactive element
const TRAIL_DOT_DEFAULT_SIZE = 8; // px, for the trailing dots
const NUM_TRAIL_DOTS = 8;
const LERP_FACTOR_CURSOR = 0.15; // Adjusted for a slightly smoother follow
const TRAIL_LERP_FACTOR = 0.25;

interface Position {
  x: number;
  y: number;
}

interface MainCursorStyle extends Position {
  width: number;
  height: number;
  radius: string;
  opacity: number;
  isInteracting: boolean;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

interface TrailDot extends Position {
  opacity: number;
  scale: number;
}

interface HoveredElementInfo {
  x: number; // Center X
  y: number; // Center Y
  width: number;
  height: number;
  radius: string;
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
    isInteracting: false,
    backgroundColor: 'hsl(var(--accent))',
    borderColor: 'transparent',
    borderWidth: 0,
  });
  const [trailDots, setTrailDots] = useState<TrailDot[]>(
    Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ x: -100, y: -100, opacity: 0, scale: 1 }))
  );
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredElementInfo, setHoveredElementInfo] = useState<HoveredElementInfo | null>(null);

  const animationFrameIdRef = useRef<number | null>(null);
  const mainCursorRef = useRef<HTMLDivElement>(null); // Ref for the main cursor dot

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, [isVisible]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.body.style.cursor = 'none';

    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-interactive="true"]');
    
    const handleMouseEnter = (event: MouseEvent) => {
      const elem = event.currentTarget as HTMLElement;
      const rect = elem.getBoundingClientRect();
      const radius = window.getComputedStyle(elem).borderTopLeftRadius;
      setHoveredElementInfo({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        radius: radius,
      });
    };

    const handleMouseLeave = () => {
      setHoveredElementInfo(null);
    };

    interactiveElements.forEach(elem => {
      (elem as HTMLElement).style.cursor = 'none';
      elem.addEventListener('mouseenter', handleMouseEnter);
      elem.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
      interactiveElements.forEach(elem => {
        (elem as HTMLElement).style.cursor = 'auto';
        elem.removeEventListener('mouseenter', handleMouseEnter);
        elem.removeEventListener('mouseleave', handleMouseLeave);
      });
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleMouseMove]);

  useEffect(() => {
    const animate = () => {
      setMainCursorStyle(prev => {
        const isInteracting = !!hoveredElementInfo;
        let targetX = mousePosition.x;
        let targetY = mousePosition.y;
        let targetWidth = MAIN_DOT_DEFAULT_SIZE;
        let targetHeight = MAIN_DOT_DEFAULT_SIZE;
        let targetRadius = '50%';
        let targetBgColor = 'hsl(var(--accent))';
        let targetBorderColor = 'transparent';
        let targetBorderWidth = 0;

        if (isInteracting && hoveredElementInfo) {
          targetX = hoveredElementInfo.x;
          targetY = hoveredElementInfo.y;
          targetWidth = MAIN_DOT_HOVER_SIZE;
          targetHeight = MAIN_DOT_HOVER_SIZE;
          targetRadius = '50%'; // Keep the magnetic blob circular
          targetBgColor = 'transparent';
          targetBorderColor = 'hsl(var(--accent))';
          targetBorderWidth = 2;
        }
        
        const newX = lerp(prev.x, targetX - targetWidth / 2, LERP_FACTOR_CURSOR);
        const newY = lerp(prev.y, targetY - targetHeight / 2, LERP_FACTOR_CURSOR);

        // Instantly update color/border for interacting state, or lerp opacity
        const newOpacity = isVisible ? 1 : 0;
        const finalOpacity = (prev.opacity === 0 && newOpacity === 1 && !isVisible) ? newOpacity : lerp(prev.opacity, newOpacity, 0.2);


        return {
          x: newX,
          y: newY,
          width: lerp(prev.width, targetWidth, LERP_FACTOR_CURSOR),
          height: lerp(prev.height, targetHeight, LERP_FACTOR_CURSOR),
          radius: targetRadius, // Can lerp if desired, but instant change for shape is fine
          opacity: finalOpacity,
          isInteracting: isInteracting,
          backgroundColor: isInteracting ? targetBgColor : lerpColor(prev.backgroundColor, targetBgColor, LERP_FACTOR_CURSOR*2),
          borderColor: isInteracting ? targetBorderColor : lerpColor(prev.borderColor, targetBorderColor, LERP_FACTOR_CURSOR*2),
          borderWidth: lerp(prev.borderWidth, targetBorderWidth, LERP_FACTOR_CURSOR*2)
        };
      });

      setTrailDots(prevTrailDots => {
        const newTrailDots = [...prevTrailDots];
        const mainCursorCenterX = mainCursorStyle.x + mainCursorStyle.width / 2;
        const mainCursorCenterY = mainCursorStyle.y + mainCursorStyle.height / 2;
        const isMainInteracting = mainCursorStyle.isInteracting;

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
          
          // Trail fades faster and shrinks if main cursor is interacting
          const baseOpacity = 1 - (index / NUM_TRAIL_DOTS) * 0.7;
          const baseScale = 1 - (index / NUM_TRAIL_DOTS) * 0.6;
          
          dot.opacity = lerp(dot.opacity, isMainInteracting ? baseOpacity * 0.3 : baseOpacity, 0.2);
          dot.scale = lerp(dot.scale, isMainInteracting ? baseScale * 0.5 : baseScale, 0.2);
        });
        return newTrailDots;
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // Helper to lerp HSL colors (basic, assumes HSL format)
    // This is a simplified lerp for colors; a more robust one would handle HSL components individually.
    const lerpColor = (startColor: string, endColor: string, t: number): string => {
        if (startColor === endColor) return startColor;
        // For simplicity, just snap to endColor if t is high enough, or start if low.
        // A real color lerp is more complex.
        if (t > 0.5) return endColor;
        return startColor; // Or implement a proper HSL component lerp
    };


    if (isVisible) {
      // Initialize trail dots if they are far off or cursor just became visible
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
        // Fade out main cursor if not visible
        setMainCursorStyle(prev => ({
            ...prev, 
            opacity: lerp(prev.opacity, 0, 0.2),
            // Reset interaction style if not visible
            isInteracting: false,
            backgroundColor: 'hsl(var(--accent))',
            borderColor: 'transparent',
            borderWidth: 0,
        }));
        // Fade out trail dots
        setTrailDots(prevTrailDots => prevTrailDots.map(dot => ({
            ...dot,
            opacity: lerp(dot.opacity, 0, 0.2),
            scale: lerp(dot.scale, 0, 0.2)
        })));

        if (animationFrameIdRef.current && mainCursorStyle.opacity < 0.01) {
            cancelAnimationFrame(animationFrameIdRef.current);
        } else if (animationFrameIdRef.current) {
            // continue fading out if not fully transparent
            animationFrameIdRef.current = requestAnimationFrame(animate);
        }
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isVisible, mousePosition, mainCursorStyle.opacity, mainCursorStyle.x, mainCursorStyle.y, mainCursorStyle.width, mainCursorStyle.height, mainCursorStyle.isInteracting, hoveredElementInfo, trailDots]); // Added trailDots to dependency array


  if (!isVisible && mainCursorStyle.opacity < 0.01 && trailDots.every(d => d.opacity < 0.01)) { 
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      <div
        ref={mainCursorRef}
        className="absolute shadow-lg" 
        style={{
          left: `${mainCursorStyle.x}px`,
          top: `${mainCursorStyle.y}px`,
          width: `${mainCursorStyle.width}px`,
          height: `${mainCursorStyle.height}px`,
          borderRadius: mainCursorStyle.radius,
          opacity: mainCursorStyle.opacity,
          backgroundColor: mainCursorStyle.backgroundColor,
          border: `${mainCursorStyle.borderWidth}px solid ${mainCursorStyle.borderColor}`,
          boxSizing: 'border-box',
          transition: 'background-color 0.1s ease-out, border-color 0.1s ease-out, border-width 0.1s ease-out, width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
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
            transform: 'translate(-50%, -50%)', // Center the trail dots
          }}
        />
      ))}
    </div>
  );
}
