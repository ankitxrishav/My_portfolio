
"use client";

import { timelineData, type TimelineEvent } from '@/data/timeline';
import TimelineItem from './timeline-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { fetchProfileContentAction, type FetchProfileContentState } from '@/app/about/actions'; // Reusing action for journey
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const initialState: FetchProfileContentState = {};

function SubmitButtonJourney() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Generate Journey with AI
    </Button>
  );
}


export default function TimelineDisplay() {
  const [currentTimelineData, setCurrentTimelineData] = useState<TimelineEvent[]>(timelineData);
  const [state, formAction] = useFormState(fetchProfileContentAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
    if (state.message) {
      toast({ title: "Success", description: state.message });
    }
    if (state.data?.journeyTimeline) {
      // This is a simplified approach. A real implementation would parse the string into TimelineEvent[]
      const newJourneyEvent: TimelineEvent = {
        id: String(currentTimelineData.length + 1),
        date: "AI Generated",
        title: "AI Generated Journey Segment",
        description: state.data.journeyTimeline,
        type: 'milestone', // Or determine type from content
      };
      setCurrentTimelineData(prevData => [newJourneyEvent, ...prevData]); // Prepend AI content
      toast({ title: "Journey Updated", description: "AI generated content has been added to your timeline." });
    }
  }, [state, toast]);


  return (
    <div>
      <Card className="mb-8 bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center text-primary-foreground">
            <Wand2 className="mr-2 h-5 w-5 text-accent" /> AI-Powered Journey Generation
          </CardTitle>
          <CardDescription>
            Generate a summary of your professional journey by providing your LinkedIn and GitHub profile URLs.
            The AI will attempt to create timeline entries. (Note: Currently adds a single summary entry).
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="linkedinProfileUrlJourney" className="text-foreground/80">LinkedIn Profile URL</Label>
              <Input
                id="linkedinProfileUrlJourney"
                name="linkedinProfileUrl" // Name must match action's expected formData key
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                required
                className="bg-input border-border focus:ring-accent"
              />
            </div>
            <div>
              <Label htmlFor="githubProfileUrlJourney" className="text-foreground/80">GitHub Profile URL</Label>
              <Input
                id="githubProfileUrlJourney"
                name="githubProfileUrl" // Name must match action's expected formData key
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
            <SubmitButtonJourney />
          </CardFooter>
        </form>
      </Card>

      {currentTimelineData.length > 0 ? (
        <div className="space-y-2">
          {currentTimelineData.map((event, index) => (
            <TimelineItem key={event.id} event={event} isLast={index === currentTimelineData.length - 1} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">
          No journey information available. Try generating it with AI or add entries manually.
        </p>
      )}
    </div>
  );
}
