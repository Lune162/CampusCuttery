import { genkit, z } from "genkit";
import { vertexAI } from "@genkit-ai/vertexai";
import { gemini15Flash } from "@genkit-ai/vertexai";
import { firebaseAuth } from "@genkit-ai/firebase/auth";
import { onFlow } from "@genkit-ai/firebase/functions";
import { UserRecord } from 'firebase-admin/auth';  // Import Firebase user type
import * as logger from "firebase-functions/logger";  // Import logger for logging errors

const ai = genkit({
  plugins: [
    vertexAI({ location: "us-central1" }),  // Optionally specify project ID
  ],
});

export const menuSuggestionFlow = onFlow(
  ai,
  {
    name: "menuSuggestionFlow",
    inputSchema: z.string(),
    outputSchema: z.string(),
    authPolicy: firebaseAuth((user: UserRecord) => {
      // Example: Check if the user email is verified
      if (!user.emailVerified) {  // Fixed typo from email_verified to emailVerified
        throw new Error("Verified email required to run flow");
      }
    }),
  },
  async (subject: string) => {  // Specify type for subject
    try {
      const prompt = `Suggest an item for the menu of a ${subject} themed restaurant`;
      const llmResponse = await ai.generate({
        model: gemini15Flash,
        prompt: prompt,
        config: {
          temperature: 1,
        },
      });

      return llmResponse.text;
    } catch (error) {
      logger.error("Error generating response", error);  // Now logger is defined
      throw new Error("Failed to generate response");
    }
  }
);
