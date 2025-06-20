
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
                    // Base styling like text-xs, font-semibold, transition-colors, border-transparent
                    // will come from the variant="default" or variant="secondary".
                    // We only override/specify colors and hover states here.
                    skill.highlight && "bg-accent text-accent-foreground hover:bg-accent/90",
                    !skill.highlight && "bg-secondary/70 text-secondary-foreground hover:bg-secondary"
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

