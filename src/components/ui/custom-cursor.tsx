
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const NUM_TRAIL_DOTS = 8;
const MAIN_DOT_DEFAULT_SIZE = 10; // px
const TRAIL_DOT_DEFAULT_SIZE = 8; // px

const LERP_FACTOR_CURSOR = 0.2; // How quickly the main dot follows the mouse (unhovered)
const LERP_FACTOR_HOVER = 0.18; // How quickly main dot snaps to hovered element (for both pos and size)
const TRAIL_LERP_FACTOR = 0.3; // How quickly trail dots follow

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

interface HoveredElementInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: string;
}

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [mainCursorStyle, setMainCursorStyle] = useState<MainCursorStyle>({
    x: -MAIN_DOT_DEFAULT_SIZE, // Start off-screen
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
  const [hoveredElementInfo, setHoveredElementInfo] = useState<HoveredElementInfo | null>(null);

  const animationFrameIdRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, [isVisible]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    // Ensure system cursor is hidden on body, will be re-applied by globals.css
    // but explicit here helps if globals.css is slow or fails.
    document.body.style.cursor = 'none'; 

    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-interactive="true"]');

    const onMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const radius = window.getComputedStyle(target).borderRadius;
      setHoveredElementInfo({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        radius: radius,
      });
    };

    const onMouseLeave = () => {
      setHoveredElementInfo(null);
    };

    interactiveElements.forEach(elem => {
      elem.addEventListener('mouseenter', onMouseEnter);
      elem.addEventListener('mouseleave', onMouseLeave);
      // Ensure these elements also hide the system cursor
      (elem as HTMLElement).style.cursor = 'none';
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
      interactiveElements.forEach(elem => {
        elem.removeEventListener('mouseenter', onMouseEnter);
        elem.removeEventListener('mouseleave', onMouseLeave);
        (elem as HTMLElement).style.cursor = 'auto';
      });
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleMouseMove]); // isVisible is implicitly handled by its effect on animation loop

  useEffect(() => {
    const animate = () => {
      setMainCursorStyle(prev => {
        let targetX: number, targetY: number, targetWidth: number, targetHeight: number, targetRadius: string;
        const currentOpacity = isVisible ? 1 : 0;

        if (hoveredElementInfo) {
          targetX = hoveredElementInfo.x;
          targetY = hoveredElementInfo.y;
          targetWidth = hoveredElementInfo.width;
          targetHeight = hoveredElementInfo.height;
          targetRadius = hoveredElementInfo.radius;
        } else {
          targetX = mousePosition.x - prev.width / 2; // Target center for default dot
          targetY = mousePosition.y - prev.height / 2;
          targetWidth = MAIN_DOT_DEFAULT_SIZE;
          targetHeight = MAIN_DOT_DEFAULT_SIZE;
          targetRadius = '50%';
        }
        
        // If becoming visible from an invisible state, snap position and size
        if (prev.opacity === 0 && currentOpacity === 1) {
            return {
                x: hoveredElementInfo ? targetX : mousePosition.x - MAIN_DOT_DEFAULT_SIZE / 2,
                y: hoveredElementInfo ? targetY : mousePosition.y - MAIN_DOT_DEFAULT_SIZE / 2,
                width: targetWidth,
                height: targetHeight,
                radius: targetRadius,
                opacity: currentOpacity,
            };
        }
        
        return {
          x: lerp(prev.x, targetX, hoveredElementInfo ? LERP_FACTOR_HOVER : LERP_FACTOR_CURSOR),
          y: lerp(prev.y, targetY, hoveredElementInfo ? LERP_FACTOR_HOVER : LERP_FACTOR_CURSOR),
          width: lerp(prev.width, targetWidth, LERP_FACTOR_HOVER), // Always use hover factor for size change
          height: lerp(prev.height, targetHeight, LERP_FACTOR_HOVER),
          radius: targetRadius, // Radius snaps for now, CSS transition handles smoothness
          opacity: lerp(prev.opacity, currentOpacity, 0.2), // Smooth opacity transition
        };
      });

      setTrailDots(prevTrailDots => {
        const newTrailDots = [...prevTrailDots];
        // Trail should follow the center of the main cursor dot
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
          
          if (hoveredElementInfo) {
            dot.opacity = lerp(dot.opacity, 0, 0.25); // Fade out trail quickly
            dot.scale = lerp(dot.scale, 0.3, 0.25); // Shrink trail quickly
          } else {
            // Restore opacity and scale if not hovering, ensuring smooth transition back
             dot.opacity = lerp(dot.opacity, 1 - (index / NUM_TRAIL_DOTS) * 0.7, 0.15);
             dot.scale = lerp(dot.scale, 1 - (index / NUM_TRAIL_DOTS) * 0.6, 0.15);
          }
        });
        return newTrailDots;
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
       // Snap trail dots to initial position when cursor first becomes visible
      if (mainCursorStyle.opacity < 0.1 && trailDots.some(d => d.x === -100)) {
           setTrailDots(Array(NUM_TRAIL_DOTS).fill(null).map(() => ({ 
                x: mousePosition.x, 
                y: mousePosition.y, 
                opacity: 0, // Start trail dots invisible, they will fade in
                scale: 1 
            })));
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } else {
        // If not visible, ensure main cursor opacity lerps to 0
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
  }, [isVisible, mousePosition, hoveredElementInfo, mainCursorStyle.opacity, mainCursorStyle.x, mainCursorStyle.y, mainCursorStyle.width, mainCursorStyle.height]); // Include mainCursorStyle properties used by trail


  // Only render if opacity is high enough to be seen, prevents flash of off-screen element
  if (!isVisible && mainCursorStyle.opacity < 0.01) { 
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      {/* Main Cursor Dot */}
      <div
        className="absolute bg-accent/70 shadow-lg backdrop-blur-sm" // Added some transparency and blur
        style={{
          left: `${mainCursorStyle.x}px`,
          top: `${mainCursorStyle.y}px`,
          width: `${mainCursorStyle.width}px`,
          height: `${mainCursorStyle.height}px`,
          borderRadius: mainCursorStyle.radius,
          opacity: mainCursorStyle.opacity,
          // CSS transitions for properties not lerped in JS or for smoother visual snap
          transition: 'border-radius 0.15s ease-out', 
        }}
      />
      {/* Trail Dots */}
      {trailDots.map((dot, index) => (
        dot.opacity > 0.01 && // Only render if somewhat visible
        <div
          key={index}
          className="absolute bg-accent/50 rounded-full backdrop-blur-xs" // Added some transparency and blur
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${TRAIL_DOT_DEFAULT_SIZE * dot.scale}px`,
            height: `${TRAIL_DOT_DEFAULT_SIZE * dot.scale}px`,
            opacity: dot.opacity,
            transform: 'translate(-50%, -50%)',
            // transition for trail dots opacity and scale for smoother fade in/out
            // transition: 'opacity 0.1s linear, transform 0.1s linear', 
          }}
        />
      ))}
    </div>
  );
}

