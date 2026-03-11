
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainOsFeaturesInputSchema = z.string().describe('The technical feature of the OS to be explained.');
const ExplainOsFeaturesOutputSchema = z.string().describe('A concise, easy-to-understand explanation of the OS feature.');

const explainOsFeaturesPrompt = ai.definePrompt({
  name: 'explainOsFeaturesPrompt',
  input: {schema: ExplainOsFeaturesInputSchema},
  output: {schema: ExplainOsFeaturesOutputSchema},
  prompt: `You are an AI assistant for the CrucibleOS landing page. Your task is to provide concise and easy-to-understand explanations for technical features of an Open Source Operating System, aimed at potential users who want to quickly grasp its value.\n\nExplain the following feature:\n{{{input}}}`
});

export const explainOsFeaturesFlow = ai.defineFlow(
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
