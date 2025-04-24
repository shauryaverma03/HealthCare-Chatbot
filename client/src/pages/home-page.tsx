import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Navigation */}
      <nav className="py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl">Robo Assistant</div>
          <div className="flex space-x-6">
            <Link href="/about">
              <span className="text-white hover:text-gray-300 cursor-pointer">About</span>
            </Link>
            <Link href="/chatbot">
              <span className="text-white hover:text-gray-300 cursor-pointer">Services</span>
            </Link>
            <Link href="/contact">
              <span className="text-white hover:text-gray-300 cursor-pointer">Contact</span>
            </Link>
            <Link href="/auth">
              <span className="text-white hover:text-gray-300 cursor-pointer">Login</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left content */}
            <div className="w-full md:w-1/2 md:pr-8 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-700">
                  Robo Assistant
                </span>
              </h1>
              <div className="mt-8">
                <Link href="/chatbot">
                  <Button className="bg-white hover:bg-gray-100 text-black font-semibold py-2 px-8 uppercase tracking-wide">
                    GET STARTED FOR FREE
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right content - iframe */}
            <div className="w-full md:w-1/2">
              <div className="relative" style={{ height: "400px" }}>
                <iframe 
                  src="https://my.spline.design/coolroboto-58f3b9da167598cdb53e3db42cdbed84/" 
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  title="3D Robot Assistant"
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: "none" }}
                />
                
                {/* Bottom platform glow effect */}
                <div className="absolute bottom-0 left-0 w-full" style={{ height: "100px", background: "radial-gradient(ellipse at center, rgba(147,51,234,0.2) 0%, rgba(0,0,0,0) 70%)", zIndex: -1 }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
