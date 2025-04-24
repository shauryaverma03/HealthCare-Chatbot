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

  // Animation when clicked
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
          y: isHovered ? -5 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 15,
        }}
      >
        {/* Robot SVG based on screenshot */}
        <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Glow effects */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4B0082" />
              <stop offset="100%" stopColor="#6A5ACD" />
            </linearGradient>
            <radialGradient id="platformGlow" cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#9370DB" stopOpacity="1" />
              <stop offset="100%" stopColor="#9370DB" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#999999" />
              <stop offset="50%" stopColor="#e0e0e0" />
              <stop offset="100%" stopColor="#888888" />
            </linearGradient>
            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
            </radialGradient>
          </defs>
          
          {/* Purple glow under the platform */}
          <ellipse cx="150" cy="250" rx="80" ry="20" fill="url(#platformGlow)" opacity="0.7" filter="url(#glow)" />
          
          {/* Platform */}
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* White base platform */}
            <rect x="100" y="220" width="100" height="25" rx="2" fill="#FFFFFF" />
            <rect x="105" y="215" width="90" height="5" rx="1" fill="#EFEFEF" />
            
            {/* Robot body group */}
            <g>
              {/* Legs */}
              <rect x="130" y="200" width="10" height="20" rx="2" fill="url(#metalGradient)" />
              <rect x="160" y="200" width="10" height="20" rx="2" fill="url(#metalGradient)" />
              
              {/* Feet */}
              <rect x="125" y="215" width="20" height="5" rx="2" fill="url(#metalGradient)" />
              <rect x="155" y="215" width="20" height="5" rx="2" fill="url(#metalGradient)" />
              
              {/* Body */}
              <motion.g
                animate={{
                  rotateZ: isWaving ? [0, -2, 2, -2, 0] : 0
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
                style={{ originX: "150px", originY: "180px" }}
              >
                {/* Torso */}
                <rect x="125" y="150" width="50" height="50" rx="15" fill="url(#metalGradient)" />
                <ellipse cx="150" cy="190" rx="25" ry="12" fill="url(#metalGradient)" />
                
                {/* Arms */}
                <motion.g
                  animate={{
                    rotateZ: isWaving ? [0, -15, -5, -15, -5, 0] : 0
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut"
                  }}
                  style={{ originX: "115px", originY: "160px" }}
                >
                  <rect x="105" y="155" width="20" height="10" rx="5" fill="url(#metalGradient)" />
                  <circle cx="105" cy="160" r="6" fill="url(#metalGradient)" />
                </motion.g>
                
                <motion.g
                  animate={{
                    rotateZ: isWaving ? [0, 5, 15, 5, 15, 0] : 0
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut"
                  }}
                  style={{ originX: "185px", originY: "160px" }}
                >
                  <rect x="175" y="155" width="20" height="10" rx="5" fill="url(#metalGradient)" />
                  <circle cx="195" cy="160" r="6" fill="url(#metalGradient)" />
                </motion.g>
                
                {/* Head */}
                <g>
                  {/* Head base - square with rounded corners */}
                  <rect x="125" y="100" width="50" height="50" rx="5" fill="url(#metalGradient)" />
                  
                  {/* Dark blue/purple face plate */}
                  <rect x="130" y="105" width="40" height="40" rx="3" fill="url(#faceGradient)" filter="url(#glow)" />
                  
                  {/* Eyes */}
                  <motion.circle 
                    cx="140" 
                    cy="125" 
                    r="7" 
                    fill="url(#eyeGlow)" 
                    filter="url(#glow)"
                    animate={{
                      x: robotPosition.x,
                      y: robotPosition.y,
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{
                      opacity: {
                        duration: 2,
                        repeat: Infinity
                      }
                    }}
                  />
                  
                  <motion.circle 
                    cx="160" 
                    cy="125" 
                    r="7" 
                    fill="url(#eyeGlow)" 
                    filter="url(#glow)"
                    animate={{
                      x: robotPosition.x,
                      y: robotPosition.y,
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{
                      opacity: {
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.5
                      }
                    }}
                  />
                  
                  {/* Side "ears" */}
                  <rect x="120" y="115" width="5" height="20" rx="2" fill="url(#metalGradient)" />
                  <rect x="175" y="115" width="5" height="20" rx="2" fill="url(#metalGradient)" />
                  
                  <circle cx="122.5" cy="125" r="3" fill="#9370DB" filter="url(#glow)" />
                  <circle cx="177.5" cy="125" r="3" fill="#9370DB" filter="url(#glow)" />
                </g>
              </motion.g>
            </g>
            
            {/* Purple glow on platform */}
            <motion.ellipse 
              cx="150" 
              cy="220" 
              rx="30" 
              ry="5" 
              fill="#9370DB" 
              opacity="0.4"
              filter="url(#glow)"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                rx: [25, 30, 25]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.g>
          
          {/* Reflection */}
          <ellipse cx="150" cy="245" rx="45" ry="4" fill="#FFFFFF" opacity="0.2" />
        </svg>
      </motion.div>
    </div>
  );
}