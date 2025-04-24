import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertChatHistorySchema, insertChatMessageSchema } from "@shared/schema";

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
        // Get the gemini-1.5-flash model - using more recent version
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // System prompt for general AI assistant
        const systemPrompt = `
          You are a helpful AI assistant.
          Provide accurate, educational information and helpful answers.
          Format your responses in a clear and organized manner.
          Keep responses concise, informative, and conversational.
        `;

        // Generate content with the Gemini API using system prompt + user prompt
        const chatSession = model.startChat({
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
          },
        });
        
        const result = await chatSession.sendMessage(`${systemPrompt}\n\nUser question: ${userPrompt}`);
        botResponse = result.response.text();
      } catch (apiError) {
        console.error("Gemini API error:", apiError);
        
        // Fallback responses based on keywords in the user's prompt
        const lowerPrompt = userPrompt.toLowerCase();
        if (lowerPrompt.includes("flu") || lowerPrompt.includes("cold") || lowerPrompt.includes("symptoms")) {
          botResponse = `Common flu symptoms include fever, cough, sore throat, body aches, and fatigue. For most people, the flu resolves on its own with rest and hydration.

Medication Recommendations:
- Acetaminophen (Tylenol): Helps reduce fever and relieve pain. Take as directed on the package, typically every 4-6 hours with food or milk to reduce stomach upset. Avoid exceeding the maximum daily dose.
- Ibuprofen (Advil, Motrin): Reduces inflammation, pain, and fever. Take with food to minimize stomach irritation. Best taken with a full glass of water.
- Decongestants: Help relieve nasal congestion. Take as directed, usually every 4-6 hours. Avoid taking before bedtime as they may cause insomnia.
- Cough suppressants with dextromethorphan: Help control coughing. Take as directed, typically every 6-8 hours.

Always consult with a healthcare professional before starting any medication, especially if you have underlying health conditions or take other medications. This information is educational and not a substitute for medical advice.`;
        } 
        else if (lowerPrompt.includes("covid") || lowerPrompt.includes("coronavirus")) {
          botResponse = `COVID-19 symptoms may include fever, cough, fatigue, loss of taste or smell, and difficulty breathing. If you're experiencing symptoms or have been exposed, consider getting tested and follow local health guidelines.

Medication Recommendations:
- Acetaminophen (Tylenol): Can help manage fever and pain. Take as directed on packaging, typically every 4-6 hours with food. Do not exceed the maximum daily dose.
- Over-the-counter cough medications: May help manage cough symptoms. Follow package directions for dosing.
- Throat lozenges: Can soothe sore throat. Use as needed according to package instructions.
- Electrolyte solutions: Help maintain hydration during fever or illness. Consume as needed throughout the day.

Antiviral medications may be prescribed by a healthcare provider for certain individuals. For specific medical advice and treatment options, please consult with a healthcare professional. This information is provided for educational purposes only.`;
        }
        else if (lowerPrompt.includes("headache") || lowerPrompt.includes("migraine")) {
          botResponse = `Headaches can be caused by various factors including stress, dehydration, lack of sleep, or underlying health conditions. For occasional headaches, rest and over-the-counter pain relievers may help.

Medication Recommendations:
- Ibuprofen (Advil, Motrin): Reduces inflammation and pain. Take with food to minimize stomach irritation, typically every
6-8 hours. Best taken with a full glass of water.
- Acetaminophen (Tylenol): Relieves pain without anti-inflammatory effects. Take as directed, usually every 4-6 hours with food. Avoid alcohol while taking.
- Aspirin: Relieves pain and reduces inflammation. Take with food to minimize stomach irritation. Not recommended for children under 18.
- For migraines: Over-the-counter migraine-specific medications containing caffeine, aspirin, and acetaminophen may help if taken at the first sign of symptoms.

If you experience severe, persistent, or unusual headaches, please consult with a healthcare provider. This information is educational and not a substitute for professional medical advice.`;
        }
        else if (lowerPrompt.includes("allergy") || lowerPrompt.includes("allergies") || lowerPrompt.includes("hay fever")) {
          botResponse = `Allergies occur when your immune system reacts to foreign substances like pollen, pet dander, or certain foods. Symptoms may include sneezing, itchy eyes, runny nose, skin rash, or in severe cases, difficulty breathing.

Medication Recommendations:
- Antihistamines (Cetirizine/Zyrtec, Loratadine/Claritin): Block histamine release to reduce allergy symptoms. Take once daily, typically in the morning. Newer versions cause less drowsiness.
- Nasal corticosteroids (Fluticasone/Flonase): Reduce inflammation in nasal passages. Use daily for best results, typically 1-2 sprays per nostril once daily.
- Decongestants: Reduce nasal congestion temporarily. Take as directed, usually every 4-6 hours and avoid before bedtime.
- Eye drops: Relieve itchy, watery eyes. Apply as directed, typically 1-2 drops in affected eyes up to four times daily.

For severe allergies or if symptoms don't improve, please consult with a healthcare provider. This information is for educational purposes only.`;
        }
        else if (lowerPrompt.includes("stomach") || lowerPrompt.includes("digest") || lowerPrompt.includes("diarrhea") || lowerPrompt.includes("constipation")) {
          botResponse = `Digestive issues like upset stomach, diarrhea, or constipation can be caused by various factors including diet, stress, infections, or medications.

Medication Recommendations:
- For acid reflux/heartburn: Antacids (Tums, Rolaids) neutralize stomach acid quickly and can be taken as needed with meals. H2 blockers (Pepcid) reduce acid production and can be taken once or twice daily, usually before meals.
- For diarrhea: Loperamide (Imodium) slows intestinal movements. Take after each loose stool, not exceeding the maximum daily dose. Avoid if you have fever or blood in stool.
- For constipation: Fiber supplements (Metamucil) should be taken with plenty of water. Stool softeners (Colace) can be taken once or twice daily with water. Osmotic laxatives work more quickly and can be taken as needed.
- For gas/bloating: Simethicone (Gas-X) breaks up gas bubbles and can be taken after meals and at bedtime.

If symptoms persist for more than a few days or are severe, please consult with a healthcare provider. This information is educational and not a substitute for medical advice.`;
        }
        else if (lowerPrompt.includes("anxiety") || lowerPrompt.includes("stress") || lowerPrompt.includes("depression")) {
          botResponse = `Mental health conditions like anxiety and depression are common and treatable. Strategies that may help manage symptoms include regular exercise, adequate sleep, mindfulness practices, and connecting with supportive people.

Medication Considerations:
- Over-the-counter options are limited for mental health conditions, as most effective treatments require prescription.
- Some herbal supplements like valerian root or L-theanine may help with mild anxiety symptoms. Take as directed on the package, typically once or twice daily.
- Melatonin may help with sleep issues related to anxiety. Take 30 minutes before bedtime.

For effective treatment of clinical anxiety or depression, prescription medications prescribed by a healthcare provider are typically necessary. If you're struggling with mental health concerns, I strongly encourage you to reach out to a mental health professional. This information is educational and not a substitute for professional care.`;
        }
        else if (lowerPrompt.includes("sleep") || lowerPrompt.includes("insomnia")) {
          botResponse = `Good sleep hygiene practices include maintaining a regular sleep schedule, creating a restful environment, limiting screen time before bed, and avoiding caffeine and alcohol close to bedtime.

Medication Recommendations:
- Melatonin: A hormone that helps regulate sleep cycles. Take 30 minutes to 1 hour before bedtime, typically 1-5mg. Start with the lowest effective dose.
- Diphenhydramine (Benadryl, ZzzQuil): An antihistamine with sedating effects. Take 30 minutes before bedtime. May cause morning grogginess and isn't recommended for long-term use.
- Doxylamine (Unisom SleepTabs): Another antihistamine that promotes drowsiness. Take 30 minutes before bedtime. Not recommended for extended use.
- Herbal supplements: Valerian root and chamomile tea may promote relaxation. Follow package directions for dosing.

These should be used occasionally rather than regularly. If you're experiencing persistent sleep difficulties, consider discussing this with a healthcare provider. This information is provided for educational purposes and is not a substitute for medical advice.`;
        }
        else {
          botResponse = `I understand you're asking about a health-related topic. While I'd like to provide specific information including medication recommendations, I'm currently operating in fallback mode due to technical limitations.

For health conditions, common medications often include:
- Pain/fever: Acetaminophen (Tylenol) or ibuprofen (Advil)
- Allergies: Antihistamines like cetirizine (Zyrtec) or loratadine (Claritin)
- Colds/congestion: Decongestants and cough suppressants
- Digestive issues: Antacids, anti-diarrheals, or laxatives depending on symptoms

However, proper medication selection, dosing, and timing depend on your specific condition, medical history, and other medications you may be taking.

For reliable health information and appropriate medication guidance, please consult healthcare resources like the CDC or WHO websites, or speak with a healthcare professional. Remember that online information should complement, not replace, professional medical advice.`;
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

  // Chat history endpoints
  app.get("/api/chat-histories", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const histories = await storage.getChatHistories(req.user.id);
      res.json(histories);
    } catch (error) {
      console.error("Error fetching chat histories:", error);
      res.status(500).json({ error: "Failed to fetch chat histories" });
    }
  });

  app.post("/api/chat-histories", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      // Create chat history with user ID and title
      const newHistory = await storage.createChatHistory({
        userId: req.user.id,
        title: req.body.title || "New Conversation"
      });
      
      // Add welcome message
      await storage.addChatMessage({
        chatId: newHistory.id,
        role: "assistant",
        content: "Hello! How can I assist you today?"
      });
      
      res.status(201).json(newHistory);
    } catch (error) {
      console.error("Error creating chat history:", error);
      res.status(500).json({ error: "Failed to create chat history" });
    }
  });

  app.get("/api/chat-histories/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const history = await storage.getChatHistory(parseInt(req.params.id));
      
      if (!history) {
        return res.status(404).json({ error: "Chat history not found" });
      }
      
      if (history.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const messages = await storage.getChatMessages(history.id);
      
      res.json({ history, messages });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  app.patch("/api/chat-histories/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const history = await storage.getChatHistory(parseInt(req.params.id));
      
      if (!history) {
        return res.status(404).json({ error: "Chat history not found" });
      }
      
      if (history.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const { title } = req.body;
      
      if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Title is required" });
      }
      
      const updatedHistory = await storage.updateChatHistoryTitle(history.id, title);
      res.json(updatedHistory);
    } catch (error) {
      console.error("Error updating chat history:", error);
      res.status(500).json({ error: "Failed to update chat history" });
    }
  });

  app.delete("/api/chat-histories/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const history = await storage.getChatHistory(parseInt(req.params.id));
      
      if (!history) {
        return res.status(404).json({ error: "Chat history not found" });
      }
      
      if (history.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      await storage.deleteChatHistory(history.id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting chat history:", error);
      res.status(500).json({ error: "Failed to delete chat history" });
    }
  });

  app.post("/api/chat-histories/:id/messages", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const history = await storage.getChatHistory(parseInt(req.params.id));
      
      if (!history) {
        return res.status(404).json({ error: "Chat history not found" });
      }
      
      if (history.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Add user message
      const userMessage = await storage.addChatMessage({
        chatId: history.id,
        role: "user",
        content: message
      });
      
      // Get AI response
      let aiResponse = "";
      
      try {
        // Get the gemini-1.5-flash model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // System prompt for general AI assistant
        const systemPrompt = `
          You are a helpful AI assistant.
          Provide accurate, educational information and helpful answers.
          Format your responses in a clear and organized manner.
          Keep responses concise, informative, and conversational.
        `;
        
        // Generate content with the Gemini API
        const chatSession = model.startChat({
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
          },
        });
        
        const result = await chatSession.sendMessage(`${systemPrompt}\n\nUser question: ${message}`);
        aiResponse = result.response.text();
      } catch (apiError) {
        console.error("Gemini API error in chat history:", apiError);
        aiResponse = "I'm sorry, but I'm having trouble processing your request at the moment. Please try again later.";
      }
      
      // Add AI response
      const assistantMessage = await storage.addChatMessage({
        chatId: history.id,
        role: "assistant",
        content: aiResponse
      });
      
      res.json({
        userMessage,
        assistantMessage
      });
    } catch (error) {
      console.error("Error adding message to chat:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
