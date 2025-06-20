
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
    // This div is a direct child of .horizontal-scroll-container
    // It uses flex to lay out its children (sections) horizontally.
    <div className="flex flex-row">
      {/* Hero Section - Becomes a horizontal slide */}
      <section 
        id="home" 
        className="w-screen h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 relative z-10 overflow-hidden flex-shrink-0"
      >
        <div className="relative z-10">
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
              {/* Note: These links will require JS for horizontal scroll later */}
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

      {/* About Section - Becomes a horizontal slide */}
      {/* Outer div for 100vw/100vh and flex centering */}
      <div id="about-section-container" className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative z-10">
        <SectionWrapper
          id="about"
          title="About Me"
          subtitle="Discover more about my background, skills, and passion for machine learning."
          aria-labelledby="about-heading"
          className="w-full h-full flex flex-col" // SectionWrapper manages its internal padding and content centering
        >
          {/* Max-width container for the actual content if needed, or let AboutContent manage it */}
          <div className="flex-grow flex items-center justify-center">
            <AboutContent />
          </div>
        </SectionWrapper>
      </div>
      
      {/* Projects Section - Becomes a horizontal slide */}
      <div id="projects-section-container" className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative z-10">
        <SectionWrapper
          id="projects"
          title="My Projects"
          subtitle={<>Here’s a curated list of some of my best work, available on my GitHub: <a href='https://github.com/ankitxrishav' target='_blank' rel='noopener noreferrer' className='text-accent hover:underline' data-cursor-interactive="true">github.com/ankitxrishav</a></>}
          aria-labelledby="projects-heading"
          className="w-full h-full flex flex-col"
        >
          <div className="flex-grow flex items-center justify-center w-full"> {/* Ensure ProjectList can use width */}
             <ProjectList />
          </div>
        </SectionWrapper>
      </div>

      {/* Journey Section - Becomes a horizontal slide */}
       <div id="journey-section-container" className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative z-10">
        <SectionWrapper
          id="journey"
          title="My Journey"
          subtitle="Follow my professional path, key milestones, and educational background."
          aria-labelledby="journey-heading"
          className="w-full h-full flex flex-col"
        >
          <div className="flex-grow flex items-center justify-center">
            <TimelineDisplay />
          </div>
        </SectionWrapper>
      </div>

      {/* Contact Section - Becomes a horizontal slide */}
      <div id="contact-section-container" className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative z-10">
        <SectionWrapper
          id="contact"
          title="Contact Me"
          subtitle="I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions."
          aria-labelledby="contact-heading"
          className="w-full h-full flex flex-col"
        >
           <div className="flex-grow flex items-center justify-center">
            <StaticContactInfo />
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
}
