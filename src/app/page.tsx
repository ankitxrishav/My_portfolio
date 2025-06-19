
import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/ui/section-wrapper';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';

import AboutContent from '@/components/about/about-content';
import ProjectList from '@/components/projects/project-list';
import TimelineDisplay from '@/components/journey/timeline-display';
import StaticContactInfo from '@/components/contact/static-contact-info';


export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center py-16 relative z-10">
        {/* Content from original page.tsx, adapted */}
        <div className="relative z-10"> {/* Ensure hero content is above canvas if it were here, now it's global */}
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">
            <span className="block">Hi, I&apos;m Ankit Kumar</span>
            <span className="block text-accent">ML Engineer & Innovator</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Passionate about leveraging machine learning to solve complex problems and build intelligent systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Link href="/#projects">
                View My Work <Eye className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-accent hover:bg-accent/10 shadow-lg transform hover:scale-105 transition-transform duration-200">
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
        subtitle="A selection of projects I've worked on, showcasing my skills in machine learning and software development."
        aria-labelledby="projects-heading"
        className="relative z-10"
      >
        <ProjectList />
      </SectionWrapper>

      {/* Journey Section */}
      <SectionWrapper
        id="journey"
        title="My Journey"
        subtitle="Follow my professional path, key milestones, and educational background."
        aria-labelledby="journey-heading"
        className="relative z-10"
      >
        <TimelineDisplay />
      </SectionWrapper>

      {/* Contact Section */}
      <SectionWrapper
        id="contact"
        title="Contact Me"
        subtitle="I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions."
        aria-labelledby="contact-heading"
        className="relative z-10"
      >
        <StaticContactInfo />
      </SectionWrapper>
    </div>
  );
}
