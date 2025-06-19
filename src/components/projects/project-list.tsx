
"use client";

import { useState } from 'react';
import type { Project, Technology } from '@/data/projects';
import { projectsData, allTechnologies } from '@/data/projects';
import ProjectCard from './project-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { Filter, ListRestart } from 'lucide-react';

export default function ProjectList() {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [selectedTech, setSelectedTech] = useState<Technology | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const handleTechFilter = (tech: Technology | 'all') => {
    setSelectedTech(tech);
    if (tech === 'all') {
      setFilteredProjects(sortProjects(projectsData, sortOrder));
    } else {
      const filtered = projectsData.filter(p => p.technologies.includes(tech));
      setFilteredProjects(sortProjects(filtered, sortOrder));
    }
  };

  const handleSortChange = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
    setFilteredProjects(sortProjects([...filteredProjects], order));
  };
  
  const sortProjects = (projects: Project[], order: 'newest' | 'oldest') => {
    return projects.sort((a, b) => {
      if (order === 'newest') return b.year - a.year;
      return a.year - b.year;
    });
  };

  const resetFilters = () => {
    setSelectedTech('all');
    setSortOrder('newest');
    setFilteredProjects(sortProjects(projectsData, 'newest'));
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-accent" />
          <Select value={selectedTech} onValueChange={(value) => handleTechFilter(value as Technology | 'all')}>
            <SelectTrigger className="w-full sm:w-[180px] bg-input border-border focus:ring-accent">
              <SelectValue placeholder="Filter by Technology" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Technologies</SelectItem>
              {allTechnologies.map(tech => (
                <SelectItem key={tech} value={tech}>{tech}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
           <Select value={sortOrder} onValueChange={(value) => handleSortChange(value as 'newest' | 'oldest')}>
            <SelectTrigger className="w-full sm:w-[150px] bg-input border-border focus:ring-accent">
              <SelectValue placeholder="Sort by Year" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" onClick={resetFilters} className="hover:border-accent hover:text-accent">
          <ListRestart className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">No projects found matching your criteria.</p>
      )}
    </div>
  );
}
