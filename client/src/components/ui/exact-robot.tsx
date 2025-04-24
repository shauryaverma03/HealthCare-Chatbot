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
        
        // Calculate normalized direction vector (max 5px movement)
        const dirX = Math.min(Math.max((e.clientX - centerX) / 30, -5), 5);
        const dirY = Math.min(Math.max((e.clientY - centerY) / 30, -5), 5);
        
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
    // If you want to add a click animation in the future
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
        className="w-[240px] h-[240px] relative"
        animate={{
          y: [0, -10, 0],
          scale: isHovered ? 1.05 : 1
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: 0.3
          }
        }}
      >
        <div className="relative w-full h-full">
          {/* Base SVG robot image */}
          <img 
            src={robotSvg} 
            alt="Robot Assistant" 
            className="w-full h-full"
          />
          
          {/* Animated eyes overlay */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          >
            {/* Left eye */}
            <motion.div
              className="absolute w-[20px] h-[20px] bg-white rounded-full"
              style={{ 
                left: '140px', 
                top: '155px',
                filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))'
              }}
              animate={{
                x: robotEyes.left.x,
                y: robotEyes.left.y,
                opacity: isHovered ? 1 : 0
              }}
            />
            
            {/* Right eye */}
            <motion.div
              className="absolute w-[20px] h-[20px] bg-white rounded-full"
              style={{ 
                left: '160px', 
                top: '155px',
                filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))'
              }}
              animate={{
                x: robotEyes.right.x,
                y: robotEyes.right.y,
                opacity: isHovered ? 1 : 0
              }}
            />
          </motion.div>
          
          {/* Platform glow */}
          <motion.div
            className="absolute bottom-10 left-1/2 w-[100px] h-[20px] rounded-full bg-purple-500 blur-md -z-10"
            style={{ 
              transform: 'translateX(-50%)',
              opacity: 0.5
            }}
            animate={{
              width: isHovered ? '120px' : '100px',
              opacity: isHovered ? 0.7 : 0.5
            }}
            transition={{
              duration: 1,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}