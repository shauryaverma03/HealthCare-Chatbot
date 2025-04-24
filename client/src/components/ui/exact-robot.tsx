import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import robotSvg from '../../assets/robot.svg';

export default function ExactRobot() {
  const [isHovered, setIsHovered] = useState(false);
  const [robotEyes, setRobotEyes] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse for eye movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate normalized direction vector (limited movement for subtle effect)
        const dirX = Math.min(Math.max((e.clientX - centerX) / 60, -4), 4);
        const dirY = Math.min(Math.max((e.clientY - centerY) / 60, -4), 4);
        
        setRobotEyes({
          left: { x: dirX, y: dirY },
          right: { x: dirX, y: dirY }
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Function to handle robot click for animation
  const handleRobotClick = () => {
    // Trigger wave animation if needed
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRobotClick}
    >
      <motion.div
        className="w-[300px] h-[300px] relative"
        animate={{
          y: [0, -5, 0], // More subtle float
          scale: isHovered ? 1.03 : 1 // More subtle scale
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: 0.5
          }
        }}
      >
        <div className="relative w-full h-full">
          {/* Base robot SVG */}
          <img 
            src={robotSvg} 
            alt="Healthcare Robot Assistant" 
            className="w-full h-full"
          />
          
          {/* Animated eyes */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          >
            {/* Left eye glow */}
            <motion.div
              className="absolute w-[16px] h-[16px] bg-white rounded-full"
              style={{ 
                left: 'calc(46.25% - 8px)', 
                top: 'calc(45% - 8px)',
                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.9))',
                opacity: 0.9
              }}
              animate={{
                x: robotEyes.left.x,
                y: robotEyes.left.y,
                opacity: [0.9, 1, 0.9]
              }}
              transition={{
                opacity: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
            
            {/* Right eye glow */}
            <motion.div
              className="absolute w-[16px] h-[16px] bg-white rounded-full"
              style={{ 
                left: 'calc(53.75% - 8px)', 
                top: 'calc(45% - 8px)',
                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.9))',
                opacity: 0.9
              }}
              animate={{
                x: robotEyes.right.x,
                y: robotEyes.right.y,
                opacity: [0.9, 1, 0.9]
              }}
              transition={{
                opacity: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }
              }}
            />
          </motion.div>
          
          {/* Enhanced platform glow effect */}
          <motion.div
            className="absolute bottom-16 left-1/2 w-[100px] h-[15px] rounded-full bg-purple-600 blur-md -z-10"
            style={{ 
              transform: 'translateX(-50%)',
              opacity: 0.4
            }}
            animate={{
              width: isHovered ? '110px' : '100px',
              opacity: isHovered ? 0.6 : 0.4,
              filter: isHovered ? 'blur(12px)' : 'blur(8px)'
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}