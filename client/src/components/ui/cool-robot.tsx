import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CoolRobot() {
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  // Auto-hide loading screen after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide the info tooltip after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfo(false);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full relative">
      {/* Loading screen with animation */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7] 
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          </motion.div>
          <p className="text-sm text-white">Loading 3D Robot...</p>
        </div>
      )}
      
      {/* Interactive info tooltip */}
      {showInfo && (
        <motion.div 
          className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white p-3 rounded-lg max-w-xs z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <p className="text-xs">
            Move your mouse to interact with the robot! Watch how it follows your movements.
          </p>
        </motion.div>
      )}
      
      {/* Embedded Spline iframe directly from website */}
      <iframe 
        src="https://my.spline.design/coolroboto-58f3b9da167598cdb53e3db42cdbed84/" 
        onLoad={handleIframeLoad}
        frameBorder="0"
        width="100%"
        height="100%"
        allowFullScreen
        title="3D Healthcare Robot"
        className="bg-transparent rounded-xl"
        style={{ border: "none" }}
      />
    </div>
  );
}