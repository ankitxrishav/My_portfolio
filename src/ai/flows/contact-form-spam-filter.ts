// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI-powered spam filter for contact form submissions.
 *
 * - filterSpam - A function that filters spam from contact form submissions.
 * - ContactFormInput - The input type for the filterSpam function.
 * - ContactFormOutput - The return type for the filterSpam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContactFormInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the form.'),
  email: z.string().email().describe('The email address of the person submitting the form.'),
  message: z.string().describe('The message content from the contact form.'),
  topic: z.string().optional().describe('The topic of the message, if specified.'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

const ContactFormOutputSchema = z.object({
  isSpam: z.boolean().describe('Whether the message is likely to be spam.'),
  spamReason: z
    .string()
    .optional()
    .describe('The reason why the message is classified as spam.'),
});
export type ContactFormOutput = z.infer<typeof ContactFormOutputSchema>;

export async function filterSpam(input: ContactFormInput): Promise<ContactFormOutput> {
  return contactFormSpamFilterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contactFormSpamFilterPrompt',
  input: {schema: ContactFormInputSchema},
  output: {schema: ContactFormOutputSchema},
  prompt: `You are an AI assistant tasked with filtering spam messages from a contact form.

  Analyze the following message and determine if it is spam.

  Name: {{{name}}}
  Email: {{{email}}}
  Message: {{{message}}}
  Topic: {{topic}}

  Consider factors such as the message content, sender information, and topic (if available).

  Return a JSON object with the following properties:
  - isSpam: true if the message is spam, false otherwise.
  - spamReason: A brief explanation of why the message is considered spam (if isSpam is true). Leave blank if not spam.

  Example:
  {
    "isSpam": true,
    "spamReason": "Message contains promotional content and irrelevant links."
  }

  {
    "isSpam": false,
    "spamReason": ""
  }`,
});

const contactFormSpamFilterFlow = ai.defineFlow(
  {
    name: 'contactFormSpamFilterFlow',
    inputSchema: ContactFormInputSchema,
    outputSchema: ContactFormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
