
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Linkedin, Github } from 'lucide-react';

export default function AboutContent() {
  const [aboutMeText] = useState( 
    "Ankit Kumar is a dedicated Machine Learning Engineer with a passion for creating intelligent systems that drive innovation. With a strong background in computer science and extensive experience in developing and deploying machine learning models, Ankit excels at transforming complex data into actionable insights. His expertise spans natural language processing, computer vision, and predictive analytics. Ankit is committed to continuous learning and applying cutting-edge technologies to solve real-world challenges."
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <Card className="md:col-span-1 bg-card shadow-lg">
        <CardHeader className="items-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent mb-4">
            <Image 
              src="https://placehold.co/300x300.png" 
              alt="Ankit Kumar" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="professional portrait"
            />
          </div>
          <CardTitle className="font-headline text-2xl text-foreground">Ankit Kumar</CardTitle>
          <CardDescription className="text-accent">ML Engineer</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Crafting the future with data and algorithms. Based in San Francisco, CA.
          </p>
          <div className="mt-4 flex justify-center space-x-3">
            <Button variant="outline" size="icon" asChild className="hover:border-accent hover:text-accent">
              <a href="https://linkedin.com/in/ankitkumar-ml" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild className="hover:border-accent hover:text-accent">
              <a href="https://github.com/ankitkumar" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
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
            <CardTitle className="font-headline text-xl text-foreground">About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{aboutMeText}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
