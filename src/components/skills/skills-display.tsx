
"use client";

import { skillsData } from '@/data/skills';
import type { Skill } from '@/data/skills';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function SkillsDisplay() {
  return (
    <div className="space-y-6">
      {skillsData.map((category) => (
        <Card key={category.name} className="bg-card shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3 pb-4 pt-5">
            <category.categoryIcon className="h-7 w-7 text-accent" />
            <CardTitle className="font-headline text-xl text-foreground">{category.name}</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill: Skill) => (
                <Badge 
                  key={skill.name} 
                  variant={skill.highlight ? "default" : "secondary"}
                  className={cn(
                    "text-xs transition-colors",
                    !skill.highlight && "bg-secondary/70 text-secondary-foreground hover:bg-secondary",
                    skill.highlight && "hover:bg-primary/90" // Ensures highlighted badges also have a hover effect consistent with default variant
                  )}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
