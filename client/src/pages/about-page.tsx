import { Card } from "@/components/ui/card";
import { 
  Brain, 
  UserRound
} from "lucide-react";
import ThreeDBackground from "@/components/ui/3d-background";

export default function AboutPage() {
  return (
    <>
      <ThreeDBackground />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About HealthAssist AI</h1>
          
          <Card className="glass p-8 mb-10 border-none">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              At HealthAssist AI, we're committed to making healthcare information more accessible to everyone. Our AI-powered 
              chatbot is designed to provide reliable health guidance, symptom assessment, and medical information to 
              help users make better healthcare decisions.
            </p>
            <p className="text-gray-300">
              We believe that technology can bridge the gap in healthcare access and provide support to those who need 
              immediate health guidance. However, we always encourage users to consult with healthcare professionals 
              for proper diagnosis and treatment.
            </p>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="glass p-6 border-none">
              <div className="bg-primary/90 text-white p-3 rounded-lg inline-block mb-4">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced AI Technology</h3>
              <p className="text-gray-300">
                Our chatbot utilizes state-of-the-art natural language processing and machine learning algorithms, 
                trained on verified medical resources to provide accurate and helpful responses.
              </p>
            </Card>
            <Card className="glass p-6 border-none">
              <div className="bg-secondary/90 text-white p-3 rounded-lg inline-block mb-4">
                <UserRound className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Medical Expertise</h3>
              <p className="text-gray-300">
                Developed in collaboration with healthcare professionals to ensure the information provided is accurate, 
                relevant, and follows established medical guidelines.
              </p>
            </Card>
          </div>
          
          <Card className="glass p-8 mb-10 border-none">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                  alt="Team Member" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="font-semibold">Dr. Emma Wilson</h4>
                <p className="text-sm text-gray-400">Medical Director</p>
              </div>
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                  alt="Team Member" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="font-semibold">James Chen</h4>
                <p className="text-sm text-gray-400">AI Lead Engineer</p>
              </div>
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                  alt="Team Member" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="font-semibold">Maya Rodriguez</h4>
                <p className="text-sm text-gray-400">Product Manager</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
