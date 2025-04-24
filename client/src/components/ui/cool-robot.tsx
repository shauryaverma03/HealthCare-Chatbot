import { useState, useEffect } from 'react';
import RobotFallback from './robot-fallback';

// Temporarily using just the fallback as Spline is causing issues
export default function CoolRobot() {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative">
      <RobotFallback />
    </div>
  );
}