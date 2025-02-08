import { onRequest } from "firebase-functions/v2/https"; // HTTP function
import * as logger from "firebase-functions/logger"; // Logger for debugging

// Import the menu suggestion flow function from genkit-sample.ts
import { menuSuggestionFlow } from './genkit-sample';  // Adjust the path if necessary

// Example HTTP function that handles requests to a specific endpoint
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello from Firebase Function!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// You don't need to do anything else; menuSuggestionFlow will be deployed automatically as part of Firebase functions.
