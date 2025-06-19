
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Github, FileText } from 'lucide-react';

export default function StaticContactInfo() {
  return (
    <Card className="max-w-xl mx-auto bg-card shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center text-primary-foreground">
          <Mail className="mr-3 h-7 w-7 text-accent"/> Let&apos;s Connect
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <p className="text-foreground/80">
          Feel free to reach out via email or connect with me on social platforms. I&apos;m excited to discuss new opportunities and collaborations!
        </p>
        
        <div className="space-y-3">
          <Button variant="outline" asChild className="w-full sm:w-auto sm:mr-2 hover:border-accent hover:text-accent">
            <a href="mailto:ankit.kumar.ml@example.com">
              <Mail className="mr-2 h-5 w-5" /> Email Me
            </a>
          </Button>
          {/* <Button variant="link" asChild className="text-accent hover:text-accent/80">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-5 w-5" /> Download Resume
            </a>
          </Button> */}
        </div>

        <div className="flex justify-center space-x-4 pt-4">
          <Button variant="outline" size="icon" asChild className="hover:border-accent hover:text-accent">
            <a href="https://linkedin.com/in/ankitkumar-ml" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
              <Linkedin className="h-6 w-6" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild className="hover:border-accent hover:text-accent">
            <a href="https://github.com/ankitkumar" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
              <Github className="h-6 w-6" />
            </a>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground pt-4">
          ankit.kumar.ml@example.com
        </p>
      </CardContent>
    </Card>
  );
}
