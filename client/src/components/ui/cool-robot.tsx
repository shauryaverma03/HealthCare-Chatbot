import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CoolRobot() {
  const [isLoading, setIsLoading] = useState(true);

  // Auto-hide loading screen after a timeout (in case the onLoad doesn't trigger)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full relative">
      {/* Loading screen with animation */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
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
            <Loader2 className="h-10 w-10 animate-spin text-white mb-4" />
          </motion.div>
          <p className="text-sm text-white">Loading 3D Robot...</p>
        </div>
      )}
      
      {/* Embedded Spline iframe directly from website */}
      <iframe 
        src="https://my.spline.design/coolroboto-58f3b9da167598cdb53e3db42cdbed84/" 
        onLoad={handleIframeLoad}
        frameBorder="0"
        width="100%"
        height="100%"
        allowFullScreen
        title="3D Robot Assistant"
        className="bg-transparent"
        style={{ border: "none", position: "absolute" }}
      />
    </div>
  );
}