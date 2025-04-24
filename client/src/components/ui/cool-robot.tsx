import { useState, useEffect } from 'react';
import SplineRobot from './spline-robot';
import RobotFallback from './robot-fallback';

export default function CoolRobot() {
  const [useSpline, setUseSpline] = useState(true);
  const [splineErrored, setSplineErrored] = useState(false);

  // Detect Spline errors and fallback to simpler version if needed
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      // If any error contains "Spline" or occurs in Spline related files
      if (e.message?.includes('Spline') || e.filename?.includes('spline')) {
        console.warn('Spline error detected, falling back to simpler robot');
        setSplineErrored(true);
        setUseSpline(false);
      }
    };

    // Set up timeout in case Spline takes too long
    const timeout = setTimeout(() => {
      const splineCanvas = document.querySelector('canvas[data-spline-canvas]');
      if (!splineCanvas) {
        console.warn('Spline canvas not detected after timeout, using fallback');
        setUseSpline(false);
      }
    }, 8000);

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative">
      {useSpline && !splineErrored ? (
        <SplineRobot />
      ) : (
        <RobotFallback />
      )}
    </div>
  );
}