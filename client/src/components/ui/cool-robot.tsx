import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function CoolRobot() {
  const [isLoading, setIsLoading] = useState(true);

  // Auto-hide loading screen after a timeout
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
    <div className="w-full h-full rounded-xl overflow-hidden relative">
      {/* Loading screen with animation */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl z-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-sm text-white">Loading 3D Robot...</p>
        </div>
      )}
      
      {/* Embedded Spline iframe directly from website */}
      <div className="w-full h-full rounded-xl overflow-hidden">
        <iframe 
          src="https://my.spline.design/coolroboto-58f3b9da167598cdb53e3db42cdbed84/" 
          onLoad={handleIframeLoad}
          frameBorder="0"
          width="100%"
          height="100%"
          allowFullScreen
          title="3D Healthcare Robot"
          className="bg-transparent"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
}