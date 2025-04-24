import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react';

export default function SplineRobot() {
  const [isLoading, setIsLoading] = useState(true);

  // Handle when Spline is loaded
  const onLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full min-h-[350px]">
      {/* Loading screen with animation */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl z-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-sm text-white">Loading 3D Robot...</p>
        </div>
      )}
      
      {/* Spline 3D scene */}
      <div className="w-full h-full rounded-xl overflow-hidden">
        <Spline 
          scene="https://prod.spline.design/DFHAZeL4EkGoTOWk/scene.splinecode" 
          onLoad={onLoad}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}