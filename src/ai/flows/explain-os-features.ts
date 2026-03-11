'use server';
/**
 * @fileOverview This file provides an AI tool to explain technical OS features.
 *
 * - explainOsFeature - A function that provides a concise, easy-to-understand explanation for a given OS feature.
 * - ExplainOsFeaturesInput - The input type for the explainOsFeature function.
 * - ExplainOsFeaturesOutput - The return type for the explainOsFeature function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainOsFeaturesInputSchema = z.string().describe('The technical feature of the OS to be explained.');
export type ExplainOsFeaturesInput = z.infer<typeof ExplainOsFeaturesInputSchema>;

const ExplainOsFeaturesOutputSchema = z.string().describe('A concise, easy-to-understand explanation of the OS feature.');
export type ExplainOsFeaturesOutput = z.infer<typeof ExplainOsFeaturesOutputSchema>;

const explainOsFeaturesPrompt = ai.definePrompt({
  name: 'explainOsFeaturesPrompt',
  input: {schema: ExplainOsFeaturesInputSchema},
  output: {schema: ExplainOsFeaturesOutputSchema},
  prompt: `You are an AI assistant for the CrucibleOS Pulse landing page. Your task is to provide concise and easy-to-understand explanations for technical features of an Open Source Operating System, aimed at potential users who want to quickly grasp its value.

Explain the following feature:
{{{input}}}`
});

const explainOsFeaturesFlow = ai.defineFlow(
  {
    name: 'explainOsFeaturesFlow',
    inputSchema: ExplainOsFeaturesInputSchema,
    outputSchema: ExplainOsFeaturesOutputSchema,
  },
  async (input) => {
    const {output} = await explainOsFeaturesPrompt(input);
    return output!;
  }
);

export async function explainOsFeature(input: ExplainOsFeaturesInput): Promise<ExplainOsFeaturesOutput> {
  return explainOsFeaturesFlow(input);
}
