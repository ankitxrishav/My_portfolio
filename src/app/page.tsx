
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/ui/section-wrapper';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';

import AboutContent from '@/components/about/about-content';
import ProjectList from '@/components/projects/project-list';
import TimelineDisplay from '@/components/journey/timeline-display';
import StaticContactInfo from '@/components/contact/static-contact-info';


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
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-foreground animate-float">
            <span className="block">Hi, I&apos;m Ankit Kumar</span>
            <span className="block text-accent dark:text-accent">
              ML Engineer <br />
              Creative Technologist, Builder
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            A passionate Machine Learning engineer, creative technologist, and builder at heart.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="bg-accent text-accent-foreground hover:bg-accent/90 hover:text-foreground shadow-lg transform hover:scale-105 transition-transform duration-200"
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
        subtitle="Here’s a curated list of some of my best work, available on my GitHub: github.com/ankitxrishav"
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
