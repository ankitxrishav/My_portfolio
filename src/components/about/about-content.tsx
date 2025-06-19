
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Linkedin, Github } from 'lucide-react';

export default function AboutContent() {
  const [aboutMeText] = useState( 
    "I’m currently in my third year pursuing a B.Tech in Artificial Intelligence and Machine Learning at MITS, Gwalior. I thrive at the intersection of intelligent systems and creative interaction.\n\nWhether it’s transforming gesture motion into sitar music, forecasting electricity demand, or developing privacy-first communication apps — I aim to turn complex problems into elegant, impactful solutions. I believe that great tech doesn’t just work — it resonates.\n\nOutside of coding, I’m deeply curious about human-centered design, immersive UI, and experimental digital tools that make tech feel alive."
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <Card className="md:col-span-1 bg-card shadow-lg">
        <CardHeader className="items-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent mb-4">
            <Image 
              src="/images/ankit-kumar-profile.jpg" 
              alt="Ankit Kumar" 
              layout="fill" 
              objectFit="cover"
            />
          </div>
          <CardTitle className="font-headline text-2xl text-foreground">Ankit Kumar</CardTitle>
          <CardDescription className="text-accent">ML Engineer</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Crafting the future with data and algorithms. Based in Gwalior, India.
          </p>
          <div className="mt-4 flex justify-center space-x-3">
            <Button variant="outline" size="icon" asChild>
              <a href="https://www.linkedin.com/in/ankitkx" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="https://github.com/ankitxrishav" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        <Card className="bg-card shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-2">
            <UserCircle className="h-6 w-6 text-accent"/>
            <CardTitle className="font-headline text-xl text-foreground">My Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{aboutMeText}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
