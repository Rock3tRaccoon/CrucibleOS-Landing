
import { configureGenkit } from '@genkit-ai/core';
import { googleAI, geminiPro } from '@genkit-ai/google-genai';
import { defineFlow, startFlowServer } from '@genkit-ai/flow';
import { generate } from '@genkit-ai/ai';
import { z } from 'zod';

configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const explainFlow = defineFlow(
  {
    name: 'explainFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (feature) => {
    const prompt = `You are an AI assistant for the CrucibleOS landing page. Your task is to provide concise and easy-to-understand explanations for technical features of an Open Source Operating System, aimed at potential users who want to quickly grasp its value.\n\nExplain the following feature: ${feature}`;

    const llmResponse = await generate({
        model: geminiPro,
        prompt: prompt,
    });

    return llmResponse.text();
  }
);

startFlowServer();
