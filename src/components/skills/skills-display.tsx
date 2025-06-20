
"use client";

import { skillsData } from '@/data/skills';
import type { Skill } from '@/data/skills';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
            <ul className="space-y-3">
              {category.skills.map((skill: Skill) => (
                <li key={skill.name} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                    <skill.icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {skill.name}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
