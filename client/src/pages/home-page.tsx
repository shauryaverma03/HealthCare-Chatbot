import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ShieldHalf, 
  Lock, 
  Clock, 
  Star,
  Bot,
} from "lucide-react";
import ThreeDBackground from "@/components/ui/3d-background";
import RobotAnimation from "@/components/ui/robot-animation";

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
                Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AI-Powered</span> Healthcare Companion
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Get instant medical information, personalized health advice, and symptom evaluation from our advanced healthcare chatbot.
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
              <div className="relative">
                <div className="glass rounded-xl p-1 shadow-2xl overflow-hidden flex items-center justify-center">
                  <RobotAnimation />
                  <div className="absolute -bottom-4 -right-4 bg-secondary text-white p-3 rounded-full shadow-lg">
                    <Bot className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose HealthAssist AI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass transition-all hover:translate-y-[-4px] border-none">
                <div className="p-6">
                  <div className="bg-primary/90 text-white p-3 rounded-lg inline-block mb-4">
                    <ShieldHalf className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Medical Knowledge</h3>
                  <p className="text-gray-300">
                    Trained on trusted medical resources to provide accurate health information and guidance.
                  </p>
                </div>
              </Card>
              <Card className="glass transition-all hover:translate-y-[-4px] border-none">
                <div className="p-6">
                  <div className="bg-secondary/90 text-white p-3 rounded-lg inline-block mb-4">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Privacy Focused</h3>
                  <p className="text-gray-300">
                    Your health data is encrypted and secure. We prioritize your privacy and confidentiality.
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
                    Get health support anytime, anywhere - our AI assistant is always ready to help.
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
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" 
                      alt="User Avatar" 
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
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
                    "The HealthAssist AI helped me understand my symptoms when I was too busy to visit a doctor. It provided helpful advice that led me to seek proper treatment."
                  </p>
                </div>
              </Card>
              <Card className="glass border-none">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" 
                      alt="User Avatar" 
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
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
                    "As someone with chronic health issues, having access to reliable health information at any time is invaluable. This chatbot has become an essential tool for managing my health."
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
