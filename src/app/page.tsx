
"use client";

import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/ui/section-wrapper';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

import AboutContent from '@/components/about/about-content';
import ProjectList from '@/components/projects/project-list';
import TimelineDisplay from '@/components/journey/timeline-display';
import SkillsDisplay from '@/components/skills/skills-display';
import StaticContactInfo from '@/components/contact/static-contact-info';
import HeroTextLine from '@/components/ui/hero-text-line';


export default function HomePage() {

  return (
    <div>
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 relative"
      >
        <div className="relative z-10">
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-foreground">
            <HeroTextLine text="Hi, I'm Ankit Kumar" className="animate-float" />
            <HeroTextLine
              text="AIML Enthusiast & Builder"
              className="text-accent dark:text-accent animate-float text-4xl md:text-5xl"
              delay="0.2s"
            />
            <HeroTextLine
              text="I play with code and fun tech ideas."
              className="text-2xl md:text-4xl text-accent dark:text-accent animate-float"
              delay="0.4s"
            />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            A passionate AIML Enthusiast & Builder, creative technologist, and builder at heart.
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

      <SectionWrapper
        id="about"
        title="About Me"
        subtitle="Discover more about my background, skills, and passion for machine learning."
        aria-labelledby="about-heading"
      >
        <AboutContent />
      </SectionWrapper>

      <SectionWrapper
        id="projects"
        title="My Projects"
        subtitle={<>Here’s a curated list of some of my best work, available on my GitHub: <a href='https://github.com/ankitxrishav' target='_blank' rel='noopener noreferrer' className='text-accent hover:underline' data-cursor-interactive="true">github.com/ankitxrishav</a></>}
        aria-labelledby="projects-heading"
      >
           <ProjectList />
      </SectionWrapper>

      <SectionWrapper
        id="journey-skills"
        title="Journey & Expertise"
        subtitle="Exploring my professional path and the skills I've honed along the way."
        aria-labelledby="journey-skills-heading"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 items-start">
          <div>
            <Card className="relative overflow-visible mb-8 p-4 text-center">
              <h3 className="font-headline text-2xl font-bold text-foreground">My Journey</h3>
              <div 
                className="absolute left-1/2 bottom-0 w-3 h-3 bg-card transform -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r border-border"
              ></div>
            </Card>
            <TimelineDisplay />
          </div>
          <div>
            <Card className="relative overflow-visible mb-8 p-4 text-center">
              <h3 className="font-headline text-2xl font-bold text-foreground">My Skillset</h3>
              <div 
                className="absolute left-1/2 bottom-0 w-3 h-3 bg-card transform -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r border-border"
              ></div>
            </Card>
            <SkillsDisplay />
          </div>
        </div>
      </SectionWrapper>

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
