
'use server';

import { z } from "zod";
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function subscribeToNotifications(formData: FormData) {
  const email = formData.get('email');
  
  const result = schema.safeParse({ email });
  
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  try {
    await db.collection('subscribers').doc(result.data.email).set({
      subscribedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Subscribed: ${result.data.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error subscribing:', error);
    return { error: 'Something went wrong. Please try again later.' };
  }
}

export async function explainOsFeature(input: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:3400/explainFlow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: input }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from flow server: ${response.status} ${errorText}`);
      return `An error occurred while explaining the feature: ${errorText}`;
    }

    const result = await response.json();

    return result.result;

  } catch (error) {
    console.error('Error fetching from flow server:', error);
    return 'An error occurred while explaining the feature.';
  }
}
