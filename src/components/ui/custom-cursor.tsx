
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const MAIN_DOT_DEFAULT_SIZE = 10;
// const MAIN_DOT_HERO_HOVER_SIZE = 90; // No longer needed for hero text specific interaction
const TRAIL_DOT_DEFAULT_SIZE = 8;
const NUM_TRAIL_DOTS = 8;
const LERP_FACTOR_CURSOR = 0.15;
const TRAIL_LERP_FACTOR = 0.25;

interface Position {
  x: number;
  y: number;
}

interface HoveredElementInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: string;
}

interface MainCursorStyle extends Position {
  width: number;
  height: number;
  opacity: number;
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius: string;
  isHoveringInteractive: boolean;
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
    isHoveringInteractive: false,
  });
  const [trailDots, setTrailDots] = useState<TrailDot[]>(
    Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ x: -100, y: -100, opacity: 0, scale: 1 }))
  );
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredElementInfo, setHoveredElementInfo] = useState<HoveredElementInfo | null>(null);

  const animationFrameIdRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    setMousePosition({ x: event.clientX, y: event.clientY });

    const target = event.target as HTMLElement;
    const interactiveElement = target.closest('a, button, [data-cursor-interactive="true"]') as HTMLElement | null;

    if (interactiveElement) {
      const rect = interactiveElement.getBoundingClientRect();
      setHoveredElementInfo({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        radius: window.getComputedStyle(interactiveElement).borderRadius || '0px',
      });
    } else {
      setHoveredElementInfo(null);
    }
  }, [isVisible]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.body.style.cursor = 'none'; // Ensure system cursor is hidden

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto'; // Restore system cursor on unmount
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
        let targetBackgroundColor = 'hsl(var(--accent) / 0.7)';
        let targetBorderColor: string | undefined = undefined;
        let targetBorderWidth: string | undefined = undefined;
        let newIsHoveringInteractive = false;

        if (hoveredElementInfo) {
          targetX = hoveredElementInfo.x;
          targetY = hoveredElementInfo.y;
          targetWidth = hoveredElementInfo.width + 10; // Add some padding
          targetHeight = hoveredElementInfo.height + 10; // Add some padding
          targetBorderRadius = hoveredElementInfo.radius;
          targetBackgroundColor = 'transparent';
          targetBorderColor = 'hsl(var(--accent))';
          targetBorderWidth = '2px';
          newIsHoveringInteractive = true;
        }

        return {
          ...prevStyle,
          x: lerp(prevStyle.x, targetX - (prevStyle.isHoveringInteractive ? targetWidth / 2 : MAIN_DOT_DEFAULT_SIZE / 2), LERP_FACTOR_CURSOR),
          y: lerp(prevStyle.y, targetY - (prevStyle.isHoveringInteractive ? targetHeight / 2 : MAIN_DOT_DEFAULT_SIZE / 2), LERP_FACTOR_CURSOR),
          width: lerp(prevStyle.width, targetWidth, LERP_FACTOR_CURSOR * 1.5),
          height: lerp(prevStyle.height, targetHeight, LERP_FACTOR_CURSOR * 1.5),
          opacity: lerp(prevStyle.opacity, isVisible ? 1 : 0, 0.2),
          backgroundColor: targetBackgroundColor,
          borderColor: targetBorderColor,
          borderWidth: targetBorderWidth,
          borderRadius: targetBorderRadius,
          isHoveringInteractive: newIsHoveringInteractive,
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
          
          const opacityMultiplier = mainCursorStyle.isHoveringInteractive ? 0.1 : 1;
          const scaleMultiplier = mainCursorStyle.isHoveringInteractive ? 0.2 : 1;

          dot.opacity = lerp(dot.opacity, baseOpacity * opacityMultiplier, 0.2);
          dot.scale = lerp(dot.scale, baseScale * scaleMultiplier, 0.2);
        });
        return newTrailDots;
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      if (mainCursorStyle.opacity < 0.1 && trailDots.every(d => d.x === -100 && d.y === -100)) {
        // Initialize trail dots positions if cursor just became visible and they are at default off-screen
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
        // Fade out main cursor if not visible
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        setMainCursorStyle(prev => ({
            ...prev,
            opacity: lerp(prev.opacity, 0, 0.2),
            width: lerp(prev.width, MAIN_DOT_DEFAULT_SIZE, 0.2),
            height: lerp(prev.height, MAIN_DOT_DEFAULT_SIZE, 0.2),
            backgroundColor: 'hsl(var(--accent) / 0.7)', // Revert to default fill
            borderColor: undefined,
            borderWidth: undefined,
            borderRadius: '50%',
            isHoveringInteractive: false, 
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
  }, [isVisible, mousePosition, hoveredElementInfo, mainCursorStyle.x, mainCursorStyle.y, mainCursorStyle.width, mainCursorStyle.height, mainCursorStyle.opacity, mainCursorStyle.isHoveringInteractive]); 

  if (!isVisible && mainCursorStyle.opacity < 0.01 && trailDots.every(d => d.opacity < 0.01)) {
    return null;
  }
  
  const rootCursorClasses = cn(
    "fixed inset-0 pointer-events-none z-[9999]"
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
          border: mainCursorStyle.borderWidth ? `${mainCursorStyle.borderWidth} solid ${mainCursorStyle.borderColor}` : 'none',
          borderRadius: mainCursorStyle.borderRadius,
          transition: 'width 0.2s ease-out, height 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out, border-radius 0.2s ease-out, opacity 0.2s ease-out',
          boxSizing: 'border-box',
          transform: mainCursorStyle.isHoveringInteractive ? 'translate(-50%, -50%)' : 'none', // Center if magnetic
        }}
      />
      {/* Trail Dots */}
      {trailDots.map((dot, index) => (
        dot.opacity > 0.01 && (isVisible || dot.opacity > 0.1) && 
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
