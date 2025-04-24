import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "your-api-key",
  });

  // Healthcare chatbot endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      if (!req.body.prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const userPrompt = req.body.prompt;

      // Create the system message to ensure healthcare focus
      const systemMessage = `
        You are HealthAssist AI, a helpful healthcare assistant. 
        Provide accurate, educational information about health topics.
        Always clarify that you're not providing medical advice and users should consult healthcare professionals for diagnosis and treatment.
        If asked about non-health topics, gently redirect to health-related information.
        Keep responses concise, informative, and conversational.
      `;

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // Extract and send the response
      const botResponse = response.choices[0].message.content;
      res.json({ response: botResponse });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({
        message: "Error generating response",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
