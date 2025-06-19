
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useFormState, useFormStatus } from 'react-dom';
import { fetchProfileContentAction, type FetchProfileContentState } from '@/app/about/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Edit3, UserCircle, Linkedin, Github } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialState: FetchProfileContentState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Generate with AI
    </Button>
  );
}

export default function AboutContent() {
  const [state, formAction] = useFormState(fetchProfileContentAction, initialState);
  const { toast } = useToast();

  const [aboutMeText, setAboutMeText] = useState(
    "Ankit Kumar is a dedicated Machine Learning Engineer with a passion for creating intelligent systems that drive innovation. With a strong background in computer science and extensive experience in developing and deploying machine learning models, Ankit excels at transforming complex data into actionable insights. His expertise spans natural language processing, computer vision, and predictive analytics. Ankit is committed to continuous learning and applying cutting-edge technologies to solve real-world challenges."
  );
  const [activeTab, setActiveTab] = useState("display"); // 'display' or 'editAI' or 'editManual'

  useEffect(() => {
    if (state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
    if (state.message) {
      toast({ title: "Success", description: state.message });
    }
    if (state.data?.aboutMeSection) {
      setAboutMeText(state.data.aboutMeSection);
      setActiveTab("editAI"); // Switch to AI edit tab after generation
    }
  }, [state, toast]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <Card className="md:col-span-1 bg-card shadow-lg">
        <CardHeader className="items-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent mb-4">
            <Image 
              src="https://placehold.co/300x300.png" // Placeholder headshot
              alt="Ankit Kumar" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="professional portrait"
            />
          </div>
          <CardTitle className="font-headline text-2xl text-primary-foreground">Ankit Kumar</CardTitle>
          <CardDescription className="text-accent">ML Engineer</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Crafting the future with data and algorithms. Based in [Your City/Region].
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-input">
            <TabsTrigger value="display" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <UserCircle className="mr-2 h-4 w-4"/> View Bio
            </TabsTrigger>
            <TabsTrigger value="editManual" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Edit3 className="mr-2 h-4 w-4"/> Edit Bio
            </TabsTrigger>
            {/* Hidden tab for AI generated content, activated programmatically */}
             {state.data?.aboutMeSection && (
              <TabsTrigger value="editAI" className="hidden">AI Generated</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="display">
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary-foreground">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{aboutMeText}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editAI">
             <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary-foreground">Edit AI Generated Bio</CardTitle>
                <CardDescription>Review and refine the AI-generated content.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={aboutMeText}
                  onChange={(e) => setAboutMeText(e.target.value)}
                  rows={10}
                  className="bg-input border-border focus:ring-accent"
                  placeholder="AI generated content will appear here..."
                />
              </CardContent>
              <CardFooter>
                 <Button onClick={() => setActiveTab('display')} className="w-full">Save and View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="editManual">
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary-foreground">Edit Your Bio Manually</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={aboutMeText}
                  onChange={(e) => setAboutMeText(e.target.value)}
                  rows={10}
                  className="bg-input border-border focus:ring-accent"
                  placeholder="Tell us about yourself..."
                />
              </CardContent>
              <CardFooter>
                 <Button onClick={() => setActiveTab('display')} className="w-full">Save and View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6 bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center text-primary-foreground">
              <Wand2 className="mr-2 h-5 w-5 text-accent" /> AI Content Generation
            </CardTitle>
            <CardDescription>
              Provide your LinkedIn and GitHub profile URLs to generate an "About Me" section and "Journey Timeline" using AI.
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedinProfileUrl" className="text-foreground/80">LinkedIn Profile URL</Label>
                <Input
                  id="linkedinProfileUrl"
                  name="linkedinProfileUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  required
                  className="bg-input border-border focus:ring-accent"
                />
              </div>
              <div>
                <Label htmlFor="githubProfileUrl" className="text-foreground/80">GitHub Profile URL</Label>
                <Input
                  id="githubProfileUrl"
                  name="githubProfileUrl"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  required
                  className="bg-input border-border focus:ring-accent"
                />
              </div>
              {state?.error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
