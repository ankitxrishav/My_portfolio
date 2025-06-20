
"use client";

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
}

const HeroTextLine = ({ text, className }: HeroTextLineProps) => {
  return (
    <div className={cn("hero-text-line", className)}>
      {text}
    </div>
  );
};


export default function HomePage() {

  return (
    // Sections will now stack vertically
    <div>
      {/* Hero Section */}
      <section 
        id="home" 
        className="min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 relative" // Removed w-screen, h-screen fixed sizes, kept relative for z-index context if needed
      >
        <div className="relative z-10"> {/* Ensure content is above potential fixed background elements */}
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-foreground">
            <HeroTextLine text="Hi, I'm Ankit Kumar" className="animate-float" />
            <HeroTextLine text="ML Engineer" className="text-accent dark:text-accent animate-float [animation-delay:0.2s]" />
            <HeroTextLine text="Creative Technologist, Builder" className="text-accent dark:text-accent animate-float [animation-delay:0.4s]" />
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
              <Link href="#projects"> 
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
              <Link href="#contact">
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
        // Removed w-full h-full, relying on SectionWrapper's default padding and natural content height
      >
        <AboutContent />
      </SectionWrapper>
      
      {/* Projects Section */}
      <SectionWrapper
        id="projects"
        title="My Projects"
        subtitle={<>Here’s a curated list of some of my best work, available on my GitHub: <a href='https://github.com/ankitxrishav' target='_blank' rel='noopener noreferrer' className='text-accent hover:underline' data-cursor-interactive="true">github.com/ankitxrishav</a></>}
        aria-labelledby="projects-heading"
      >
           <ProjectList />
      </SectionWrapper>

      {/* Journey Section */}
      <SectionWrapper
        id="journey"
        title="My Journey"
        subtitle="Follow my professional path, key milestones, and educational background."
        aria-labelledby="journey-heading"
      >
        <TimelineDisplay />
      </SectionWrapper>

      {/* Contact Section */}
      <SectionWrapper
        id="contact"
        title="Contact Me"
        subtitle="I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions."
        aria-labelledby="contact-heading"
      >
        <StaticContactInfo />
      </SectionWrapper>
    </div>
  );
}
