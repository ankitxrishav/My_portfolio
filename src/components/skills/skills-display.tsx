
"use client";

import { skillsData } from '@/data/skills';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
              {category.skills.map((skill) => (
                <Badge 
                  key={skill.name} 
                  variant="secondary" 
                  className="flex items-center gap-2 py-1.5 px-3 text-sm bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors"
                  data-cursor-interactive="true"
                >
                  <skill.icon className="h-4 w-4" />
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
