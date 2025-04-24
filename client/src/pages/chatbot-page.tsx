import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { 
  Bot, 
  User, 
  Send,
  Info,
  PlusCircle,
  History,
  Trash2,
  Edit,
  ListRestart,
  Settings,
  Save
} from "lucide-react";
import ThreeDBackground from "@/components/ui/3d-background";
import { getChatResponse } from "@/lib/openai";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Message {
  id?: number;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatHistory {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatHistoryWithMessages {
  history: ChatHistory;
  messages: Message[];
}

export default function ChatbotPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm your AI assistant. How can I help you today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("New Conversation");
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch chat histories
  const { data: chatHistories = [], isLoading: isLoadingHistories } = useQuery<ChatHistory[]>({
    queryKey: ['/api/chat-histories'],
    enabled: !!user,
  });

  // Fetch specific chat history with messages
  const { data: currentChat, isLoading: isLoadingCurrentChat } = useQuery<ChatHistoryWithMessages>({
    queryKey: ['/api/chat-histories', currentChatId],
    enabled: !!currentChatId,
  });

  // Create new chat history
  const createChatMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/chat-histories", { title });
      return res.json();
    },
    onSuccess: (newChat: ChatHistory) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat-histories'] });
      setCurrentChatId(newChat.id);
      setTitleInput(newChat.title);
      setMessages([{ role: "assistant", content: "Hello! How can I assist you today?" }]);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create new chat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete chat history
  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: number) => {
      await apiRequest("DELETE", `/api/chat-histories/${chatId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat-histories'] });
      if (currentChatId) {
        setCurrentChatId(null);
        setMessages([{ role: "assistant", content: "Hello! How can I assist you today?" }]);
        setTitleInput("New Conversation");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete chat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update chat title
  const updateTitleMutation = useMutation({
    mutationFn: async ({ chatId, title }: { chatId: number; title: string }) => {
      const res = await apiRequest("PATCH", `/api/chat-histories/${chatId}`, { title });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat-histories'] });
      setEditingTitle(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update title",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add message to chat
  const addMessageMutation = useMutation({
    mutationFn: async ({ chatId, message }: { chatId: number; message: string }) => {
      const res = await apiRequest("POST", `/api/chat-histories/${chatId}/messages`, { message });
      return res.json();
    },
    onSuccess: (data: { userMessage: Message; assistantMessage: Message }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat-histories', currentChatId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  // Update messages when current chat changes
  useEffect(() => {
    if (currentChat && currentChat.history && currentChat.messages) {
      setMessages(currentChat.messages);
      setTitleInput(currentChat.history.title);
    }
  }, [currentChat]);

  // Focus title input when editing
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingTitle]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCreateNewChat = () => {
    createChatMutation.mutate("New Conversation");
  };

  const handleSelectChat = (chatId: number) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
    if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      deleteChatMutation.mutate(chatId);
    }
  };

  const handleEditTitle = () => {
    setEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (currentChatId && titleInput.trim()) {
      updateTitleMutation.mutate({ chatId: currentChatId, title: titleInput });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: "user",
      content: input
    };
    
    // Create a new chat if none exists
    if (!currentChatId) {
      // First add the message to the UI
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      
      // Create a new chat
      const res = await apiRequest("POST", "/api/chat-histories", { 
        title: input.length > 30 ? `${input.substring(0, 30)}...` : input 
      });
      const newChat = await res.json();
      
      // Set the current chat ID
      setCurrentChatId(newChat.id);
      setTitleInput(newChat.title);
      
      // Add the message to the chat
      try {
        await addMessageMutation.mutateAsync({
          chatId: newChat.id,
          message: input
        });
        // The assistant response will be added through the mutation success
      } catch (error) {
        // Error handling is done in the mutation
      } finally {
        setIsLoading(false);
      }
      
      return;
    }
    
    // If we have a current chat, add message to it
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      await addMessageMutation.mutateAsync({
        chatId: currentChatId,
        message: input
      });
    } catch (error) {
      // Error handling is done in the mutation
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">AI Assistant</h1>
          
          {/* Main chatbot interface with sidebar */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Chat history sidebar (only visible when logged in) */}
            {user && (
              <div className="lg:w-64 w-full">
                <Card className="glass overflow-hidden shadow-xl border-none h-[600px] flex flex-col">
                  <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium">Chat History</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleCreateNewChat}
                            disabled={createChatMutation.isPending}
                          >
                            <PlusCircle className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>New Conversation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {isLoadingHistories ? (
                      // Show skeletons while loading
                      <div className="p-3 space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex flex-col space-y-1">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        ))}
                      </div>
                    ) : chatHistories && chatHistories.length > 0 ? (
                      // Show chat histories
                      <div className="p-2">
                        {chatHistories.map((chat: ChatHistory) => (
                          <div 
                            key={chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            className={`p-2 rounded-md cursor-pointer flex justify-between items-center group hover:bg-gray-800/50 ${
                              currentChatId === chat.id ? 'bg-gray-800/70' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-2 overflow-hidden flex-1">
                              <History className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{chat.title}</span>
                            </div>
                            
                            {currentChatId === chat.id && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => handleDeleteChat(chat.id, e)}
                                  className="h-6 w-6"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Show no histories message
                      <div className="p-4 text-center text-gray-400">
                        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No chat history yet</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={handleCreateNewChat}
                        >
                          Start new chat
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
            
            {/* Main chat area */}
            <div className="flex-1">
              <Card className="glass overflow-hidden shadow-xl border-none">
                {/* Chat title */}
                {user && (
                  <div className="border-b border-gray-700 p-3 flex items-center justify-between">
                    {editingTitle ? (
                      <div className="flex w-full">
                        <Input
                          ref={titleInputRef}
                          type="text"
                          value={titleInput}
                          onChange={(e) => setTitleInput(e.target.value)}
                          className="bg-gray-800/50 border-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveTitle();
                            }
                          }}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleSaveTitle}
                          disabled={updateTitleMutation.isPending}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <h3 className="font-medium truncate">
                          {currentChatId && currentChat 
                            ? currentChat.history.title 
                            : "New Conversation"}
                        </h3>
                        {currentChatId && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleEditTitle}
                            className="ml-1"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Chat messages area */}
                <div 
                  className="message-container p-4 max-h-[500px] overflow-y-auto" 
                  ref={messageContainerRef}
                >
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
                          p-3 rounded-lg max-w-[80%]
                          ${message.role === "user" 
                            ? "bg-primary rounded-tr-none text-white" 
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
                      <div className="glass rounded-lg p-3 rounded-tl-none max-w-[80%]">
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
                      placeholder="Type your message..."
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
                      onClick={() => handleExampleClick("What are the tallest mountains in the world?")} 
                      className="ml-2 text-primary hover:underline"
                    >
                      What are the tallest mountains in the world?
                    </button> |
                    <button 
                      onClick={() => handleExampleClick("Write a short poem about technology")} 
                      className="ml-2 text-primary hover:underline"
                    >
                      Write a short poem about technology
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
