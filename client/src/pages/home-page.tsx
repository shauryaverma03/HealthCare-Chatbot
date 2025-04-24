import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ShieldHalf, 
  Lock, 
  Clock, 
  Star,
  Bot,
  BrainCircuit,
  MessageSquare
} from "lucide-react";
import ThreeDBackground from "@/components/ui/3d-background";

export default function HomePage() {
  return (
    <>
      <ThreeDBackground />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-20">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AI-Powered</span> Assistant
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Get instant answers to your questions with our advanced AI chatbot. Smart, responsive, and always learning.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/chatbot">
                  <Button size="lg" className="w-full sm:w-auto px-6 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white font-medium transition shadow-lg">
                    Try Chatbot Now
                  </Button>
                </Link>

                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-6 font-medium">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="glass rounded-xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">AI Assistant Features</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Advanced AI Technology</h3>
                      <p className="text-gray-300 text-sm">
                        Powered by state-of-the-art language models for accurate, natural conversations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-secondary/20 p-3 rounded-full mr-4">
                      <MessageSquare className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Conversation History</h3>
                      <p className="text-gray-300 text-sm">
                        Save your chat history for future reference and continue conversations seamlessly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-500/20 p-3 rounded-full mr-4">
                      <Lock className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Private & Secure</h3>
                      <p className="text-gray-300 text-sm">
                        Your conversations remain private with end-to-end encryption and secure data handling
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our AI Assistant?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass transition-all hover:translate-y-[-4px] border-none">
                <div className="p-6">
                  <div className="bg-primary/90 text-white p-3 rounded-lg inline-block mb-4">
                    <Bot className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Intelligent Responses</h3>
                  <p className="text-gray-300">
                    Get thoughtful answers to your questions with our context-aware AI assistant.
                  </p>
                </div>
              </Card>
              <Card className="glass transition-all hover:translate-y-[-4px] border-none">
                <div className="p-6">
                  <div className="bg-secondary/90 text-white p-3 rounded-lg inline-block mb-4">
                    <ShieldHalf className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Privacy Focused</h3>
                  <p className="text-gray-300">
                    Your conversations are encrypted and secure. We prioritize your privacy and confidentiality.
                  </p>
                </div>
              </Card>
              <Card className="glass transition-all hover:translate-y-[-4px] border-none">
                <div className="p-6">
                  <div className="bg-indigo-600 text-white p-3 rounded-lg inline-block mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">24/7 Availability</h3>
                  <p className="text-gray-300">
                    Get assistance anytime, anywhere - our AI assistant is always ready to help.
                  </p>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass border-none">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg mr-4">
                      SJ
                    </div>
                    <div>
                      <h4 className="font-semibold">Sarah Johnson</h4>
                      <div className="text-yellow-400 flex">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "This AI assistant has been incredibly helpful for quickly getting the information I need. The conversation history feature makes it easy to reference previous discussions."
                  </p>
                </div>
              </Card>
              <Card className="glass border-none">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                      DM
                    </div>
                    <div>
                      <h4 className="font-semibold">David Martinez</h4>
                      <div className="text-yellow-400 flex">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current stroke-current" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "I love having access to such a powerful AI tool that remembers our previous conversations. It makes complex topics much easier to understand over time."
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
