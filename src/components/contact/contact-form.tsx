
"use client";

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitContactFormAction, type ContactFormState } from '@/app/contact/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, MailQuestion } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialState: ContactFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Send Message
    </Button>
  );
}

const topics = [
  "General Inquiry",
  "Project Collaboration",
  "Job Opportunity",
  "Feedback",
  "Other"
];

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactFormAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({ variant: "destructive", title: "Submission Error", description: state.error });
    }
    if (state.message) {
      toast({ title: "Message Sent!", description: state.message });
      // Optionally reset form fields here if useForm was used, or manually clear if needed.
    }
  }, [state, toast]);

  return (
    <Card className="max-w-xl mx-auto bg-card shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center text-primary-foreground">
            <MailQuestion className="mr-3 h-7 w-7 text-accent"/> Get In Touch
        </CardTitle>
        <CardDescription>
          Have a question or want to work together? Fill out the form below.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
              <Input id="name" name="name" placeholder="Ankit Kumar" required className="bg-input border-border focus:ring-accent"/>
              {state.fieldErrors?.name && <p className="text-sm text-destructive">{state.fieldErrors.name.join(', ')}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-input border-border focus:ring-accent"/>
              {state.fieldErrors?.email && <p className="text-sm text-destructive">{state.fieldErrors.email.join(', ')}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="topic" className="text-foreground/80">Topic (Optional)</Label>
            <Select name="topic">
              <SelectTrigger id="topic" className="w-full bg-input border-border focus:ring-accent">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {topics.map(topic => (
                  <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.fieldErrors?.topic && <p className="text-sm text-destructive">{state.fieldErrors.topic.join(', ')}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-foreground/80">Message</Label>
            <Textarea id="message" name="message" placeholder="Your message..." rows={5} required className="bg-input border-border focus:ring-accent"/>
            {state.fieldErrors?.message && <p className="text-sm text-destructive">{state.fieldErrors.message.join(', ')}</p>}
          </div>
          {state.error && !state.fieldErrors && (
            <Alert variant={state.isSpam ? "destructive" : "default"}>
              <AlertTitle>{state.isSpam ? "Spam Detected" : "Error"}</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
           {state.message && (
            <Alert variant="default" className="bg-primary/10 border-primary/30">
              <AlertTitle className="text-primary-foreground">Success</AlertTitle>
              <AlertDescription className="text-primary-foreground/80">{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
