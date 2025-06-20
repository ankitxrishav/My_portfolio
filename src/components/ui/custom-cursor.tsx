
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const MAIN_DOT_DEFAULT_SIZE = 10; // px
const MAIN_DOT_HOVER_SIZE = 40; // px, size when hovering interactive element
const TRAIL_DOT_DEFAULT_SIZE = 8; // px, for the trailing dots
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

// Helper to lerp HSL colors (basic, assumes HSL format)
// This is a simplified lerp for colors; a more robust one would handle HSL components individually.
const lerpColor = (startColor: string, endColor: string, t: number): string => {
    if (startColor === endColor) return startColor;
    // For simplicity, just snap to endColor if t is high enough, or start if low.
    if (t > 0.5) return endColor;
    return startColor;
};


export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: -1000, y: -1000 }); // Initialize off-screen
  const [mainCursorStyle, setMainCursorStyle] = useState<MainCursorStyle>({
    x: -MAIN_DOT_DEFAULT_SIZE,
    y: -MAIN_DOT_DEFAULT_SIZE,
    width: MAIN_DOT_DEFAULT_SIZE,
    height: MAIN_DOT_DEFAULT_SIZE,
    radius: '50%',
    opacity: 0,
    isInteracting: false,
    backgroundColor: 'hsl(var(--accent))',
    borderColor: 'hsl(var(--accent))',
    borderWidth: 0,
  });
  const [trailDots, setTrailDots] = useState<TrailDot[]>(
    Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ x: -100, y: -100, opacity: 0, scale: 1 }))
  );
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredElementInfo, setHoveredElementInfo] = useState<HoveredElementInfo | null>(null);

  const animationFrameIdRef = useRef<number | null>(null);
  const mainCursorRef = useRef<HTMLDivElement>(null);

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
      const style = window.getComputedStyle(elem);
      const radius = style.borderTopLeftRadius;
      setHoveredElementInfo({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width + parseInt(style.paddingLeft) + parseInt(style.paddingRight), // Include padding for better fit
        height: rect.height + parseInt(style.paddingTop) + parseInt(style.paddingBottom), // Include padding
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
  }, [handleMouseMove]); // isVisible is implicitly handled by handleMouseMove's own dependency

  useEffect(() => {
    const animate = () => {
      setMainCursorStyle(prev => {
        const isInteractingWithElement = !!hoveredElementInfo;
        let targetX = mousePosition.x;
        let targetY = mousePosition.y;
        let targetWidth = MAIN_DOT_DEFAULT_SIZE;
        let targetHeight = MAIN_DOT_DEFAULT_SIZE;
        let targetRadius = '50%';
        let targetBgColor = 'hsl(var(--accent))';
        let targetBorderColor = 'transparent';
        let targetBorderWidth = 0;

        if (isInteractingWithElement && hoveredElementInfo) {
          targetX = hoveredElementInfo.x; // Center of element
          targetY = hoveredElementInfo.y; // Center of element
          targetWidth = hoveredElementInfo.width; // Element's width
          targetHeight = hoveredElementInfo.height; // Element's height
          targetRadius = hoveredElementInfo.radius;
          targetBgColor = 'transparent'; // Outline effect
          targetBorderColor = 'hsl(var(--accent))';
          targetBorderWidth = 2;
        }
        
        const newX = lerp(prev.x, targetX - targetWidth / 2, LERP_FACTOR_CURSOR);
        const newY = lerp(prev.y, targetY - targetHeight / 2, LERP_FACTOR_CURSOR);
        const newOpacity = isVisible ? 1 : 0;
        
        return {
          x: newX,
          y: newY,
          width: lerp(prev.width, targetWidth, LERP_FACTOR_CURSOR * 1.5), // Faster size change
          height: lerp(prev.height, targetHeight, LERP_FACTOR_CURSOR * 1.5),
          radius: targetRadius, 
          opacity: lerp(prev.opacity, newOpacity, 0.2),
          isInteracting: isInteractingWithElement,
          backgroundColor: isInteractingWithElement ? targetBgColor : lerpColor(prev.backgroundColor, 'hsl(var(--accent))', LERP_FACTOR_CURSOR * 2),
          borderColor: isInteractingWithElement ? targetBorderColor : lerpColor(prev.borderColor, 'transparent', LERP_FACTOR_CURSOR*2),
          borderWidth: lerp(prev.borderWidth, targetBorderWidth, LERP_FACTOR_CURSOR*2)
        };
      });

      setTrailDots(prevTrailDots => {
        const newTrailDots = [...prevTrailDots];
        // Read directly from mainCursorStyle state for current interaction status for trail
        const isMainCurrentlyInteracting = mainCursorStyle.isInteracting; 
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
          
          const baseOpacity = 1 - (index / NUM_TRAIL_DOTS) * 0.7;
          const baseScale = 1 - (index / NUM_TRAIL_DOTS) * 0.6;
          
          dot.opacity = lerp(dot.opacity, isMainCurrentlyInteracting ? baseOpacity * 0.3 : baseOpacity, 0.2);
          dot.scale = lerp(dot.scale, isMainCurrentlyInteracting ? baseScale * 0.5 : baseScale, 0.2);
        });
        return newTrailDots;
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      // Initialize trail dots when cursor becomes visible and if they are in their initial off-screen state
      // This uses functional update for setTrailDots to avoid needing trailDots in dependency array here.
      setTrailDots(currentTrailDots => {
        if (currentTrailDots.some(d => d.x === -100 && d.y === -100)) {
          return Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ 
            x: mousePosition.x, 
            y: mousePosition.y, 
            opacity: 0, 
            scale: 1 
          }));
        }
        return currentTrailDots;
      });
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } else { // isVisible is false
        // Ensure any active animation from the 'isVisible = true' path is cancelled.
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }

        // Update styles to fade out. These setState calls will trigger re-renders.
        // The useEffect will run again. If isVisible is still false, this logic repeats.
        setMainCursorStyle(prev => ({
            ...prev,
            opacity: lerp(prev.opacity, 0, 0.2),
            isInteracting: false,
            backgroundColor: 'hsl(var(--accent))',
            borderColor: 'transparent',
            borderWidth: 0,
            width: lerp(prev.width, MAIN_DOT_DEFAULT_SIZE, 0.2),
            height: lerp(prev.height, MAIN_DOT_DEFAULT_SIZE, 0.2),
            radius: '50%',
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
        animationFrameIdRef.current = null;
      }
    };
  }, [isVisible, mousePosition, hoveredElementInfo]); // Refined dependency array

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
          transition: 'border-radius 0.1s ease-out', // Keep radius transition, others handled by lerp
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

