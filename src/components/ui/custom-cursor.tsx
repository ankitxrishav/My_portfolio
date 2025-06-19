
"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false); 
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorOuterPosition, setCursorOuterPosition] = useState({ x: -100, y: -100 });

  const lerp = (start: number, end: number, amount: number) => {
    return (1 - amount) * start + amount * end;
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
      if (!isVisible) setIsVisible(true); 
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const handleMouseOverInteractive = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a, button, [data-cursor-interactive="true"]')) {
        setIsPointer(true);
      }
    };

    const handleMouseOutInteractive = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
       if (target.closest('a, button, [data-cursor-interactive="true"]')) {
        setIsPointer(false);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOverInteractive);
    document.addEventListener('mouseout', handleMouseOutInteractive);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-interactive="true"]');
    interactiveElements.forEach(el => (el as HTMLElement).style.cursor = 'none');


    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        setCursorOuterPosition(prevPos => ({
          x: lerp(prevPos.x, mousePosition.x, 0.15),
          y: lerp(prevPos.y, mousePosition.y, 0.15),
        }));
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOverInteractive);
      document.removeEventListener('mouseout', handleMouseOutInteractive);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      document.body.style.cursor = ''; // Restore default cursor
      interactiveElements.forEach(el => (el as HTMLElement).style.cursor = '');
    };
  }, [mousePosition.x, mousePosition.y, isVisible]);


  if (!isVisible) {
    return null; // Don't render if mouse hasn't moved yet
  }

  return (
    <>
      <div
        ref={cursorOuterRef}
        className={cn(
          'custom-cursor-outer fixed w-8 h-8 rounded-full border-2 border-primary pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out z-[9999]',
          {
            'scale-150 border-accent': isPointer,
            'scale-125 opacity-50': isPressed && isPointer,
            'opacity-75': isPressed && !isPointer,
          }
        )}
        style={{
          left: `${cursorOuterPosition.x}px`,
          top: `${cursorOuterPosition.y}px`,
        }}
      />
      <div
        ref={cursorInnerRef}
        className={cn(
          'custom-cursor-inner fixed w-2 h-2 rounded-full bg-primary pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[9999]',
           {
            'bg-accent': isPointer,
            'scale-150': isPressed,
          }
        )}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />
    </>
  );
}
