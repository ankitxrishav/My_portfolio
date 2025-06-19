
"use server";

import { z } from "zod";
import { filterSpam, type ContactFormInput } from "@/ai/flows/contact-form-spam-filter";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  topic: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export interface ContactFormState {
  message?: string;
  error?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    message?: string[];
    topic?: string[];
  };
  isSpam?: boolean;
}

export async function submitContactFormAction(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please check the fields.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const contactInput: ContactFormInput = validatedFields.data;

  try {
    const spamCheckResult = await filterSpam(contactInput);

    if (spamCheckResult.isSpam) {
      return {
        error: `Message identified as spam. Reason: ${spamCheckResult.spamReason || 'Not provided'}. Please revise your message.`,
        isSpam: true,
      };
    }

    // If not spam, proceed to "send email" (mocked)
    console.log("Form data is valid and not spam. Sending email (mocked):", contactInput);
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { message: "Thank you for your message! I'll get back to you soon." };

  } catch (e) {
    console.error("Error in submitContactFormAction:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during spam check or email sending.";
    return { error: `Submission failed: ${errorMessage}` };
  }
}
