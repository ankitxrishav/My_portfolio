
import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/ui/section-wrapper';
import ThreeCanvas from '@/components/three-canvas';
import Link from 'next/link';
import { ArrowRight, Download, Eye } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center overflow-hidden">
      <ThreeCanvas />
      <SectionWrapper className="relative z-10 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">
          <span className="block">Hi, I&apos;m Ankit Kumar</span>
          <span className="block text-accent">ML Engineer & Innovator</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Passionate about leveraging machine learning to solve complex problems and build intelligent systems.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-200">
            <Link href="/projects">
              View My Work <Eye className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="text-accent-foreground border-accent hover:bg-accent/10 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <Link href="/contact">
              Get In Touch <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        {/* Placeholder for resume download or other CTAs */}
        {/* <Button variant="link" className="mt-8 text-accent hover:text-accent/80">
          Download My Resume <Download className="ml-2 h-4 w-4" />
        </Button> */}
      </SectionWrapper>
    </div>
  );
}
