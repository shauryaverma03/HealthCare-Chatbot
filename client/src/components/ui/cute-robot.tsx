import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CuteRobot() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate mouse position relative to the container
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Compute robot eye direction based on mouse position
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate direction vector from center to mouse position
      const dirX = Math.min(Math.max((mousePosition.x - centerX) / 20, -5), 5);
      const dirY = Math.min(Math.max((mousePosition.y - centerY) / 20, -5), 5);
      
      setRobotPosition({ x: dirX, y: dirY });
    }
  }, [mousePosition]);

  // Wave animation when clicked
  const handleRobotClick = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRobotClick}
    >
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: isHovered ? 1.05 : 1,
          y: isHovered ? -10 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 15,
        }}
      >
        {/* Cute Robot SVG */}
        <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Glow effects */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="bodyGradient" cx="50%" cy="30%" r="50%" fx="50%" fy="30%">
              <stop offset="0%" stopColor="#8A6FE8" />
              <stop offset="100%" stopColor="#5D47D1" />
            </radialGradient>
            <radialGradient id="shadowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(90, 71, 209, 0.3)" />
              <stop offset="100%" stopColor="rgba(90, 71, 209, 0)" />
            </radialGradient>
          </defs>
          
          {/* Shadow */}
          <ellipse cx="150" cy="250" rx="70" ry="20" fill="url(#shadowGradient)" opacity="0.7" />
          
          {/* Body */}
          <motion.g
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Main body */}
            <ellipse cx="150" cy="180" rx="55" ry="60" fill="url(#bodyGradient)" filter="url(#glow)" />
            
            {/* Head */}
            <circle cx="150" cy="110" r="45" fill="#6C5CE7" />
            <ellipse cx="150" cy="110" rx="40" ry="42" fill="#8A6FE8" />
            
            {/* Face plate */}
            <ellipse cx="150" cy="115" rx="35" ry="30" fill="#F0F0F6" />
            
            {/* Eyes */}
            <g>
              {/* Left Eye Socket */}
              <circle cx="135" cy="110" r="12" fill="#444" />
              
              {/* Left Eye */}
              <motion.circle 
                cx="135" 
                cy="110" 
                r="8" 
                fill="#111" 
                animate={{
                  x: robotPosition.x,
                  y: robotPosition.y,
                }}
              />
              
              {/* Left Eye Highlight */}
              <motion.circle 
                cx="132" 
                cy="107" 
                r="3" 
                fill="white" 
                animate={{
                  x: robotPosition.x * 0.5,
                  y: robotPosition.y * 0.5,
                }}
              />
              
              {/* Right Eye Socket */}
              <circle cx="165" cy="110" r="12" fill="#444" />
              
              {/* Right Eye */}
              <motion.circle 
                cx="165" 
                cy="110" 
                r="8" 
                fill="#111" 
                animate={{
                  x: robotPosition.x,
                  y: robotPosition.y,
                }}
              />
              
              {/* Right Eye Highlight */}
              <motion.circle 
                cx="162" 
                cy="107" 
                r="3" 
                fill="white" 
                animate={{
                  x: robotPosition.x * 0.5,
                  y: robotPosition.y * 0.5,
                }}
              />
            </g>
            
            {/* Mouth */}
            <motion.path
              d="M135,130 Q150,140 165,130"
              stroke="#444"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: isHovered 
                  ? "M135,130 Q150,145 165,130" 
                  : "M135,130 Q150,140 165,130"
              }}
            />
            
            {/* Antennas */}
            <motion.g
              animate={{
                rotate: isWaving ? [0, 5, -5, 5, -5, 0] : 0
              }}
              transition={{
                duration: 1,
                ease: "easeInOut"
              }}
              style={{
                originX: "150px",
                originY: "90px"
              }}
            >
              <rect x="148" y="65" width="4" height="10" fill="#444" rx="2" />
              <motion.circle 
                cx="150" 
                cy="60" 
                r="7" 
                fill="#6C5CE7" 
                filter="url(#glow)"
                animate={{
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </motion.g>
            
            {/* Arms */}
            <motion.path
              d="M95,180 C85,160 80,150 85,140"
              stroke="#6C5CE7"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: isWaving 
                  ? "M95,180 C85,140 90,120 105,110" 
                  : "M95,180 C85,160 80,150 85,140"
              }}
            />
            <motion.circle 
              cx="85" 
              cy="140" 
              r="10" 
              fill="#8A6FE8"
              animate={{
                cx: isWaving ? 105 : 85,
                cy: isWaving ? 110 : 140
              }}
            />
            
            <path
              d="M205,180 C215,160 220,150 215,140"
              stroke="#6C5CE7"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="215" cy="140" r="10" fill="#8A6FE8" />
            
            {/* Legs */}
            <path
              d="M130,240 C130,220 135,210 120,200"
              stroke="#6C5CE7"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="120" cy="200" r="10" fill="#5D47D1" />
            
            <path
              d="M170,240 C170,220 165,210 180,200"
              stroke="#6C5CE7"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="180" cy="200" r="10" fill="#5D47D1" />
            
            {/* Feet */}
            <ellipse cx="130" cy="240" rx="15" ry="8" fill="#5D47D1" />
            <ellipse cx="170" cy="240" rx="15" ry="8" fill="#5D47D1" />
            
            {/* Belly */}
            <circle cx="150" cy="180" r="20" fill="#F0F0F6" />
            <circle cx="150" cy="180" r="15" fill="#E2E4F6" />
            
            {/* Buttons */}
            <circle cx="150" cy="170" r="3" fill="#6C5CE7" />
            <circle cx="150" cy="180" r="3" fill="#6C5CE7" />
            <circle cx="150" cy="190" r="3" fill="#6C5CE7" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}