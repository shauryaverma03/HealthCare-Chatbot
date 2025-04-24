import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { 
  Bot, 
  User, 
  Send,
  Info
} from "lucide-react";
import ThreeDBackground from "@/components/ui/3d-background";
import { getChatResponse } from "@/lib/openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm your HealthAssist AI. How can I help you with your health questions today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      role: "user",
      content: input
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Get response from AI
      const response = await getChatResponse(input);
      
      // Add AI response to the chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response }
      ]);
    } catch (error) {
      console.error("Error getting chat response:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "I'm sorry, I encountered an error while processing your request. Please try again later." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExampleClick = (query: string) => {
    setInput(query);
  };

  return (
    <>
      <ThreeDBackground />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Healthcare Assistant</h1>
          
          {/* Medical disclaimer */}
          <div className="bg-gray-800 border-l-4 border-primary p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-300">
                  This AI assistant provides information for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers with questions about medical conditions.
                </p>
              </div>
            </div>
          </div>
          
          {/* Chatbot interface */}
          <Card className="glass overflow-hidden mb-8 shadow-xl border-none">
            {/* Chat messages area */}
            <div className="message-container p-4" ref={messageContainerRef}>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex mb-4 ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`
                      flex-1 p-3 rounded-lg
                      ${message.role === "user" 
                        ? "bg-primary rounded-tr-none text-white max-w-[80%]" 
                        : "glass rounded-tl-none"
                      }
                    `}
                  >
                    <p className={message.role === "user" ? "text-white" : "text-gray-200"}>
                      {message.content}
                    </p>
                  </div>
                  
                  {message.role === "user" && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isLoading && (
                <div className="flex mb-4">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 glass rounded-lg p-3 rounded-tl-none">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input area */}
            <div className="border-t border-gray-700 p-4">
              <form onSubmit={handleSubmit} className="flex items-center">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your health question..."
                  className="flex-1 bg-gray-800 border-gray-700 rounded-r-none focus:ring-primary"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="rounded-l-none"
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="mt-2 text-xs text-gray-400">
                <span>Examples:</span>
                <button 
                  onClick={() => handleExampleClick("What are symptoms of the flu?")} 
                  className="ml-2 text-primary hover:underline"
                >
                  What are symptoms of the flu?
                </button> |
                <button 
                  onClick={() => handleExampleClick("How can I manage my anxiety?")} 
                  className="ml-2 text-primary hover:underline"
                >
                  How can I manage my anxiety?
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
