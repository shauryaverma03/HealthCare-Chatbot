import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RobotFallback() {
  const [isHovered, setIsHovered] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  
  // Track mouse for eye movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to window center
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      
      // Limit eye movement
      setEyePosition({
        x: Math.min(Math.max(x, -5), 5),
        y: Math.min(Math.max(y, -5), 5)
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-xl">
      <motion.div 
        className="w-[200px] h-[250px] relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.05 : 1,
          y: [0, -10, 0],
        }}
        transition={{
          scale: { duration: 0.3 },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Base Platform with glow */}
        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-white rounded-md"
          animate={{
            boxShadow: isHovered 
              ? "0 0 30px 5px rgba(147, 112, 219, 0.7)" 
              : "0 0 20px 2px rgba(147, 112, 219, 0.5)"
          }}
        />
        
        {/* Robot Body */}
        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 w-[80px] h-[110px] bg-gradient-to-t from-gray-300 to-gray-100 rounded-2xl flex flex-col items-center justify-end">
          {/* Control panel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-gray-800 rounded-md flex flex-col items-center justify-evenly">
            <div className="w-[5px] h-[5px] bg-blue-500 rounded-full"></div>
            <div className="w-[5px] h-[5px] bg-red-500 rounded-full"></div>
            <div className="w-[5px] h-[5px] bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Robot Head */}
        <motion.div
          className="absolute bottom-[140px] left-1/2 -translate-x-1/2 w-[60px] h-[60px] bg-gradient-to-br from-indigo-900 to-purple-900 rounded-md overflow-hidden"
          animate={{
            rotateZ: isHovered ? [0, -5, 5, -5, 0] : 0
          }}
          transition={{
            duration: 1,
            ease: "easeInOut"
          }}
        >
          {/* Face panel */}
          <div className="absolute inset-[5px] bg-indigo-800 rounded-sm flex items-center justify-center">
            {/* Eyes container */}
            <div className="flex space-x-3">
              {/* Left eye */}
              <motion.div 
                className="w-[15px] h-[15px] rounded-full bg-white flex items-center justify-center"
                animate={{ x: eyePosition.x, y: eyePosition.y }}
              >
                <motion.div 
                  className="w-[8px] h-[8px] rounded-full bg-white"
                  animate={{ 
                    boxShadow: isHovered 
                      ? "0 0 8px 3px rgba(255, 255, 255, 0.8)" 
                      : "0 0 5px 2px rgba(255, 255, 255, 0.5)"
                  }}
                />
              </motion.div>
              
              {/* Right eye */}
              <motion.div 
                className="w-[15px] h-[15px] rounded-full bg-white flex items-center justify-center"
                animate={{ x: eyePosition.x, y: eyePosition.y }}
              >
                <motion.div 
                  className="w-[8px] h-[8px] rounded-full bg-white"
                  animate={{ 
                    boxShadow: isHovered 
                      ? "0 0 8px 3px rgba(255, 255, 255, 0.8)" 
                      : "0 0 5px 2px rgba(255, 255, 255, 0.5)"
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Arms */}
        <motion.div 
          className="absolute bottom-[90px] left-[35px] w-[10px] h-[40px] bg-gray-400 rounded-full origin-top"
          animate={{
            rotateZ: isHovered ? [0, -15, -5, -15, 0] : 0
          }}
          transition={{
            duration: 1,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-[90px] right-[35px] w-[10px] h-[40px] bg-gray-400 rounded-full origin-top"
          animate={{
            rotateZ: isHovered ? [0, 15, 5, 15, 0] : 0
          }}
          transition={{
            duration: 1,
            ease: "easeInOut"
          }}
        />
        
        {/* Legs */}
        <div className="absolute bottom-[30px] left-[50px] w-[10px] h-[30px] bg-gray-400 rounded-full"></div>
        <div className="absolute bottom-[30px] right-[50px] w-[10px] h-[30px] bg-gray-400 rounded-full"></div>
        
        {/* Antenna */}
        <motion.div 
          className="absolute bottom-[200px] left-1/2 -translate-x-1/2 w-[4px] h-[15px] bg-gray-700"
          animate={{
            height: isHovered ? [15, 18, 15] : 15
          }}
          transition={{
            duration: 1,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-purple-500"
            animate={{
              boxShadow: "0 0 10px 5px rgba(147, 112, 219, 0.5)",
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Purple glow underneath robot */}
        <motion.div 
          className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[10px] rounded-full bg-purple-500 blur-md"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            width: isHovered ? [100, 110, 100] : [90, 100, 90]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}