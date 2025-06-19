
"use server";

import { profileContentCreator, type ProfileContentCreatorInput } from "@/ai/flows/profile-content-creator";
import { z } from "zod";

const schema = z.object({
  linkedinProfileUrl: z.string().url("Please enter a valid LinkedIn URL."),
  githubProfileUrl: z.string().url("Please enter a valid GitHub URL."),
});

export interface FetchProfileContentState {
  data?: {
    aboutMeSection: string;
    journeyTimeline: string;
  };
  error?: string;
  message?: string;
}

export async function fetchProfileContentAction(
  prevState: FetchProfileContentState,
  formData: FormData
): Promise<FetchProfileContentState> {
  const validatedFields = schema.safeParse({
    linkedinProfileUrl: formData.get("linkedinProfileUrl"),
    githubProfileUrl: formData.get("githubProfileUrl"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.linkedinProfileUrl?.[0] || validatedFields.error.flatten().fieldErrors.githubProfileUrl?.[0] || "Invalid input.",
    };
  }

  const input: ProfileContentCreatorInput = validatedFields.data;

  try {
    // Simulate network delay and AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // const result = await profileContentCreator(input);
    // Using mock data for now as actual scraping may be complex/restricted
    const result = {
        aboutMeSection: `Ankit Kumar is a results-oriented Machine Learning Engineer with a strong foundation in developing and deploying scalable AI solutions. (Mock data from ${input.linkedinProfileUrl} and ${input.githubProfileUrl})`,
        journeyTimeline: `Started journey in tech, specialized in ML... (Mock data from ${input.linkedinProfileUrl} and ${input.githubProfileUrl})`
    }
    
    return { data: result, message: "Profile content generated successfully!" };
  } catch (e) {
    console.error("Error in fetchProfileContentAction:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { error: `AI content generation failed: ${errorMessage}` };
  }
}
