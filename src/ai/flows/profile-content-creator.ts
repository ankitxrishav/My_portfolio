'use server';

/**
 * @fileOverview A profile content creation AI agent.
 *
 * - profileContentCreator - A function that handles the profile content creation process.
 * - ProfileContentCreatorInput - The input type for the profileContentCreator function.
 * - ProfileContentCreatorOutput - The return type for the profileContentCreator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileContentCreatorInputSchema = z.object({
  linkedinProfileUrl: z
    .string()
    .describe('The URL of the LinkedIn profile to scrape.'),
  githubProfileUrl: z
    .string()
    .describe('The URL of the GitHub profile to scrape.'),
});
export type ProfileContentCreatorInput = z.infer<
  typeof ProfileContentCreatorInputSchema
>;

const ProfileContentCreatorOutputSchema = z.object({
  aboutMeSection: z.string().describe('The content for the About Me section.'),
  journeyTimeline: z.string().describe('The content for the Journey Timeline.'),
});
export type ProfileContentCreatorOutput = z.infer<
  typeof ProfileContentCreatorOutputSchema
>;

export async function profileContentCreator(
  input: ProfileContentCreatorInput
): Promise<ProfileContentCreatorOutput> {
  return profileContentCreatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'profileContentCreatorPrompt',
  input: {schema: ProfileContentCreatorInputSchema},
  output: {schema: ProfileContentCreatorOutputSchema},
  prompt: `You are an AI assistant that helps create portfolio content for users.

You will receive links to the user's LinkedIn and GitHub profiles. You will scrape these profiles and create content for the About Me section and Journey Timeline of the user's portfolio.

LinkedIn Profile URL: {{{linkedinProfileUrl}}}
GitHub Profile URL: {{{githubProfileUrl}}}

About Me Section:
{{#if aboutMeSection}}{{{aboutMeSection}}}{{else}}No About Me section available{{/if}}

Journey Timeline:
{{#if journeyTimeline}}{{{journeyTimeline}}}{{else}}No Journey Timeline available{{/if}}`,
});

const profileContentCreatorFlow = ai.defineFlow(
  {
    name: 'profileContentCreatorFlow',
    inputSchema: ProfileContentCreatorInputSchema,
    outputSchema: ProfileContentCreatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
