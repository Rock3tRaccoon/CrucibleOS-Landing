
'use server';

import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function subscribeToNotifications(formData: FormData) {
  const email = formData.get('email');
  
  const result = schema.safeParse({ email });
  
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  // Mocking database storage
  console.log(`Subscribed: ${result.data.email}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { success: true };
}
