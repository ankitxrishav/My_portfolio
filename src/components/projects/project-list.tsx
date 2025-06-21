
"use client";

import type { Project } from '@/data/projects';
import { projectsData } from '@/data/projects';
import ProjectCard from './project-card';

export default function ProjectList() {
  const currentProjects: Project[] = projectsData;

  return (
    <div>
      {currentProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {currentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">No projects available at this time.</p>
      )}
    </div>
  );
}
