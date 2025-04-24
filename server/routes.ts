import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Initialize Google Generative AI client
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "your-api-key");

  // Healthcare chatbot endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      if (!req.body.prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const userPrompt = req.body.prompt;
      let botResponse = "";

      try {
        // Get the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // System prompt to ensure healthcare focus
        const systemPrompt = `
          You are HealthAssist AI, a helpful healthcare assistant. 
          Provide accurate, educational information about health topics.
          Always clarify that you're not providing medical advice and users should consult healthcare professionals for diagnosis and treatment.
          If asked about non-health topics, gently redirect to health-related information.
          Keep responses concise, informative, and conversational.
        `;

        // Generate content with the Gemini API using system prompt + user prompt
        const result = await model.generateContent(`${systemPrompt}\n\nUser question: ${userPrompt}`);
        const response = await result.response;
        botResponse = response.text();
      } catch (apiError) {
        console.error("Gemini API error:", apiError);
        
        // Fallback responses based on keywords in the user's prompt
        const lowerPrompt = userPrompt.toLowerCase();
        if (lowerPrompt.includes("flu") || lowerPrompt.includes("cold") || lowerPrompt.includes("symptoms")) {
          botResponse = "Common flu symptoms include fever, cough, sore throat, body aches, and fatigue. For most people, the flu resolves on its own with rest and hydration. However, if symptoms are severe or persistent, it's important to consult with a healthcare professional. Remember that this information is educational and not a substitute for medical advice.";
        } 
        else if (lowerPrompt.includes("covid") || lowerPrompt.includes("coronavirus")) {
          botResponse = "COVID-19 symptoms may include fever, cough, fatigue, loss of taste or smell, and difficulty breathing. If you're experiencing symptoms or have been exposed, consider getting tested and follow local health guidelines. For specific medical advice, please consult with a healthcare professional. This information is provided for educational purposes only.";
        }
        else if (lowerPrompt.includes("headache") || lowerPrompt.includes("migraine")) {
          botResponse = "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or underlying health conditions. For occasional headaches, rest and over-the-counter pain relievers may help. If you experience severe, persistent, or unusual headaches, please consult with a healthcare provider. This information is educational and not a substitute for professional medical advice.";
        }
        else if (lowerPrompt.includes("diet") || lowerPrompt.includes("nutrition") || lowerPrompt.includes("food")) {
          botResponse = "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Proper nutrition is important for overall health and may help prevent various chronic diseases. For personalized dietary advice, consider consulting with a registered dietitian. Remember that this information is educational and not a substitute for professional guidance.";
        }
        else if (lowerPrompt.includes("exercise") || lowerPrompt.includes("workout") || lowerPrompt.includes("fitness")) {
          botResponse = "Regular physical activity offers numerous health benefits, including improved cardiovascular health, stronger muscles and bones, and better mental health. The general recommendation is at least 150 minutes of moderate-intensity exercise per week. Before starting a new exercise routine, especially if you have health concerns, consider consulting with a healthcare provider. This information is provided for educational purposes only.";
        }
        else if (lowerPrompt.includes("anxiety") || lowerPrompt.includes("stress") || lowerPrompt.includes("depression")) {
          botResponse = "Mental health conditions like anxiety and depression are common and treatable. Strategies that may help manage symptoms include regular exercise, adequate sleep, mindfulness practices, and connecting with supportive people. If you're struggling with mental health concerns, I encourage you to reach out to a mental health professional. This information is educational and not a substitute for professional care.";
        }
        else if (lowerPrompt.includes("sleep") || lowerPrompt.includes("insomnia")) {
          botResponse = "Good sleep hygiene practices include maintaining a regular sleep schedule, creating a restful environment, limiting screen time before bed, and avoiding caffeine and alcohol close to bedtime. If you're experiencing persistent sleep difficulties, consider discussing this with a healthcare provider. This information is provided for educational purposes and is not a substitute for medical advice.";
        }
        else {
          botResponse = "I understand you're asking about a health-related topic. While I'd like to provide specific information, I'm currently operating in fallback mode due to technical limitations. For reliable health information, consider consulting healthcare resources like the CDC or WHO websites, or speaking with a healthcare professional. Remember that online information should complement, not replace, professional medical advice.";
        }
      }

      res.json({ response: botResponse });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({
        message: "Error generating response",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
