import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import ThreeDBackground from "@/components/ui/3d-background";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  History,
  PlusCircle,
  Trash2,
  Edit,
  ChevronRight,
  MessageSquare,
  Save
} from "lucide-react";

interface ChatHistory {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChatHistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [titleInput, setTitleInput] = useState("");

  // Fetch chat histories
  const { data: chatHistories = [], isLoading } = useQuery<ChatHistory[]>({
    queryKey: ['/api/chat-histories'],
    enabled: !!user,
  });

  // Create new chat history
  const createChatMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/chat-histories", { title });
      return res.json();
    },
    onSuccess: (newChat: ChatHistory) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat-histories'] });
      navigate(`/chatbot?chat=${newChat.id}`);
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
      setEditingId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update title",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateChat = () => {
    createChatMutation.mutate("New Conversation");
  };

  const handleDeleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      deleteChatMutation.mutate(chatId);
    }
  };

  const handleEditClick = (chatId: number, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingId(chatId);
    setTitleInput(currentTitle);
  };

  const handleSaveTitle = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (titleInput.trim()) {
      updateTitleMutation.mutate({ chatId, title: titleInput });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!user) {
    return (
      <>
        <ThreeDBackground />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Chat History</h1>
            <Card className="glass p-8">
              <p className="mb-4">Please log in to view your chat history.</p>
              <Link href="/auth">
                <Button>Log In</Button>
              </Link>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ThreeDBackground />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Chat History</h1>
            <Button 
              onClick={handleCreateChat}
              disabled={createChatMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          <Card className="glass p-6 overflow-hidden shadow-xl border-none">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : chatHistories && chatHistories.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {chatHistories.map((chat: ChatHistory) => (
                  <Link key={chat.id} href={`/chatbot?chat=${chat.id}`}>
                    <div className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-md cursor-pointer transition-colors group">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingId === chat.id ? (
                            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                              <Input
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                className="bg-gray-800 border-gray-700"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => handleSaveTitle(chat.id, e)}
                                disabled={updateTitleMutation.isPending}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <h3 className="font-semibold truncate">{chat.title}</h3>
                              <p className="text-sm text-gray-400 truncate">
                                Updated: {formatDate(chat.updatedAt)}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {editingId !== chat.id && (
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleEditClick(chat.id, chat.title, e)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                            className="h-8 w-8 text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold mb-2">No chat history yet</h3>
                <p className="text-gray-400 mb-6">
                  Start a new conversation to begin using the AI assistant
                </p>
                <Button 
                  onClick={handleCreateChat}
                  disabled={createChatMutation.isPending}
                >
                  Start a New Chat
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}