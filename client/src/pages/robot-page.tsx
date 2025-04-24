import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function RobotPage() {
  console.log("Robot page loaded");
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  // Auto-hide loading screen after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide info after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfo(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle when iframe loads
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Full page iframe */}
      <iframe 
        src="https://my.spline.design/coolroboto-58f3b9da167598cdb53e3db42cdbed84/" 
        onLoad={handleIframeLoad}
        frameBorder="0"
        width="100%"
        height="100%"
        allowFullScreen
        title="Interactive 3D Healthcare Robot"
        className="bg-transparent"
        style={{ border: "none", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
              className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
                3D
              </div>
            </motion.div>
          </motion.div>
          <p className="mt-8 text-white/90 text-xl">Loading 3D Experience...</p>
        </div>
      )}

      {/* Info tooltip */}
      <motion.div 
        className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white p-4 rounded-lg max-w-sm z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: showInfo ? 1 : 0, 
          y: showInfo ? 0 : -10 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start">
          <Info className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm">
            Move your mouse or touch the screen to interact with the 3D robot. See how it follows your movements!
          </p>
        </div>
      </motion.div>

      {/* Back button */}
      <Link href="/">
        <Button 
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-md hover:bg-black/70 z-20"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </Link>

      {/* Info button (shows again when hidden) */}
      {!showInfo && (
        <Button 
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-md hover:bg-black/70 z-20"
          size="sm"
          onClick={() => setShowInfo(true)}
        >
          <Info className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}