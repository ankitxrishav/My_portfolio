
import type { Project } from '@/data/projects';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col h-full overflow-hidden bg-card shadow-lg hover:shadow-accent/20 transition-all duration-300 transform hover:scale-[1.01] rounded-lg">
      <div className="relative w-full h-48">
        <Image
          src={project.imageUrl}
          alt={project.name}
          layout="fill"
          objectFit="cover" // Changed back from "contain" to "cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl text-foreground">{project.name}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">{project.year}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground/80 text-sm mb-4 leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs bg-secondary/70 text-secondary-foreground hover:bg-secondary transition-colors">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-4 border-t border-border/40">
        <div className="flex w-full justify-between items-center gap-2">
          <Button variant="outline" size="sm" asChild className="hover:border-accent transition-colors">
            <Link href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> Source
            </Link>
          </Button>
          {project.liveDemoUrl && (
            <Button variant="default" size="sm" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 hover:text-foreground transition-colors">
              <Link href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Demo
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
