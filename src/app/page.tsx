
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/ui/section-wrapper';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

import AboutContent from '@/components/about/about-content';
import ProjectList from '@/components/projects/project-list';
import TimelineDisplay from '@/components/journey/timeline-display';
import StaticContactInfo from '@/components/contact/static-contact-info';

interface HeroTextLineProps {
  text: string;
  className?: string;
  isInteractive?: boolean;
}

const HeroTextLine = ({ text, className, isInteractive = false }: HeroTextLineProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [charTransforms, setCharTransforms] = useState<string[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCharTransforms(Array(text.length).fill('scale(1)'));
  }, [text]);

  const handleMouseMoveChars = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive || !lineRef.current) return;

    const lineRect = lineRef.current.getBoundingClientRect();
    const mouseX = event.clientX - lineRect.left;
    const mouseY = event.clientY - lineRect.top;

    const newTransforms = Array.from(text).map((_char, charIndex) => {
      const charSpan = lineRef.current?.children[0]?.children[charIndex] as HTMLElement;
      if (!charSpan) return 'scale(1)';

      const charRect = charSpan.getBoundingClientRect();
      const charCenterX = (charRect.left - lineRect.left) + charRect.width / 2;
      const charCenterY = (charRect.top - lineRect.top) + charRect.height / 2;

      const distanceX = mouseX - charCenterX;
      const distanceY = mouseY - charCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const influenceRadius = 50; // pixels for scaling effect
      let scale = 1;
      if (distance < influenceRadius) {
        scale = 1 + (1 - distance / influenceRadius) * 0.2; // Max scale 1.2
      }
      return `scale(${Math.max(1, Math.min(scale, 1.2))})`;
    });
    setCharTransforms(newTransforms);
  }, [text, isInteractive]);

  const handleMouseLeaveChars = useCallback(() => {
    if (!isInteractive) return;
    setCharTransforms(Array(text.length).fill('scale(1)'));
  }, [text, isInteractive]);


  return (
    <div
      ref={lineRef}
      className={cn(
        "hero-text-line-wrapper",
        className
      )}
      onMouseEnter={() => {
        if (isInteractive) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (isInteractive) {
          setIsHovered(false);
          handleMouseLeaveChars();
        }
      }}
      onMouseMove={handleMouseMoveChars}
      style={{
        transition: 'transform 0.3s ease-out', // For overall line scale (if any was intended)
        // transform: isHovered ? 'scale(1.05)' : 'scale(1)', // Removed line scale for char scale
        position: isHovered ? 'relative' : 'static', // Crucial for z-index
        zIndex: isHovered ? 20 : 'auto', // Ensures text is above lowered cursor
      }}
      data-cursor-hero-text={isInteractive ? "true" : undefined}
    >
      <span
        className={cn(
          "transition-colors duration-200",
          isHovered ? "text-accent-foreground dark:text-accent-foreground" : "inherit"
        )}
      >
        {Array.from(text).map((char, index) => (
          <span
            key={index}
            className="hero-char" // Ensure .hero-char has transition: transform in globals.css
            style={{
              transform: charTransforms[index],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </div>
  );
};


export default function HomePage() {
  const [heroScrollY, setHeroScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHeroScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center py-16 relative z-10 overflow-hidden">
        <div
          className="relative z-10" 
          style={{ transform: `translateY(${heroScrollY * 0.2}px)` }}
        >
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-foreground">
            <HeroTextLine text="Hi, I'm Ankit Kumar" isInteractive={true} />
            <HeroTextLine text="ML Engineer" className="text-accent dark:text-accent" isInteractive={true} />
            <HeroTextLine text="Creative Technologist, Builder" className="text-accent dark:text-accent" isInteractive={true}/>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            A passionate Machine Learning engineer, creative technologist, and builder at heart.
          </p>
          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90 hover:text-foreground shadow-lg transform hover:scale-105 transition-transform duration-200"
              data-cursor-interactive="true"
            >
              <Link href="/#projects">
                View My Work <Eye className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-accent text-foreground hover:bg-accent/10 hover:text-foreground shadow-lg transform hover:scale-105 transition-transform duration-200"
              data-cursor-interactive="true"
            >
              <Link href="/#contact">
                Get In Touch <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <SectionWrapper
        id="about"
        title="About Me"
        subtitle="Discover more about my background, skills, and passion for machine learning."
        aria-labelledby="about-heading"
        className="relative z-10"
      >
        <AboutContent />
      </SectionWrapper>

      {/* Projects Section */}
      <SectionWrapper
        id="projects"
        title="My Projects"
        subtitle={<>Here’s a curated list of some of my best work, available on my GitHub: <a href='https://github.com/ankitxrishav' target='_blank' rel='noopener noreferrer' className='text-accent hover:underline' data-cursor-interactive="true">github.com/ankitxrishav</a></>}
        aria-labelledby="projects-heading"
        className="relative z-10"
      >
        <ProjectList />
      </SectionWrapper>

      {/* Journey and Contact Sections - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 lg:gap-12">
        <SectionWrapper
          id="journey"
          title="My Journey"
          subtitle="Follow my professional path, key milestones, and educational background."
          aria-labelledby="journey-heading"
          className="relative z-10 md:col-span-1"
        >
          <TimelineDisplay />
        </SectionWrapper>

        <SectionWrapper
          id="contact"
          title="Contact Me"
          subtitle="I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions."
          aria-labelledby="contact-heading"
          className="relative z-10 md:col-span-1 flex flex-col justify-center"
        >
          <StaticContactInfo />
        </SectionWrapper>
      </div>
    </div>
  );
}
