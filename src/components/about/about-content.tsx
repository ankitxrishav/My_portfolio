
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Linkedin, Github } from 'lucide-react';

export default function AboutContent() {
  const [aboutMeText] = useState(
    "I’m in my third year of B.Tech in AI & Machine Learning at MITS, Gwalior. I like to think of tech as something more than just lines of code or complex models , to me, it’s a way of thinking, exploring, and sometimes even creating a little magic.\n\nI care about how things feel just as much as how they function. Whether I’m working on a problem or designing something new, I try to keep it thoughtful, clear, and maybe even a bit unexpected. I like building things that make sense, make people curious, or just make things a little better.\n\nI’m always drawn to the mix of logic and creativity, and I enjoy the process of turning an idea into something real , not perfect, but intentional. At the end of the day, I just love making things that feel honest, useful, and a little bit personal."
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
              priority
            />
          </div>
          <CardTitle className="font-headline text-2xl text-foreground">Ankit Kumar</CardTitle>
          <CardDescription className="text-accent">AIML Enthusiast & Builder</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            I work with data and algorithms to build stuff that solves real problems. Living in Gwalior right now, but Bihar will always be home.
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
