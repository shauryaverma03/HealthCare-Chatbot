import { toast } from "@/hooks/use-toast";

// Function to interact with the AI healthcare chatbot
// This is a frontend wrapper around the backend API
export async function getChatResponse(prompt: string): Promise<string> {
  try {
    // In a real implementation, this should call the backend API endpoint
    // that handles the OpenAI integration
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get response from AI");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error in getChatResponse:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to communicate with the AI assistant",
      variant: "destructive",
    });
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
}
