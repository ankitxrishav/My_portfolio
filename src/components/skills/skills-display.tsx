
"use client";

import { useState, useEffect } from 'react';
import { skillsData } from '@/data/skills';
import type { Skill } from '@/data/skills';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // Import Progress component

export default function SkillsDisplay() {
  const [animatedLevels, setAnimatedLevels] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const newLevels: Record<string, number> = {};
      skillsData.forEach(category => {
        category.skills.forEach(skill => {
          newLevels[skill.name] = skill.level;
        });
      });
      setAnimatedLevels(newLevels);
    }, 100); // Start animation shortly after mount

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {skillsData.map((category) => (
        <Card key={category.name} className="bg-card shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3 pb-4 pt-5">
            <category.categoryIcon className="h-7 w-7 text-accent" />
            <CardTitle className="font-headline text-xl text-foreground">{category.name}</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="space-y-4">
              {category.skills.map((skill: Skill) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                    <skill.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-sm font-medium text-foreground">
                        {skill.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {animatedLevels[skill.name] || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={animatedLevels[skill.name] || 0} 
                      className="h-2 [&>div]:bg-accent" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
