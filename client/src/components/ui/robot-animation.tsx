import { useState } from 'react';
import { motion } from 'framer-motion';
// Direct import of the SVG
import robotSvg from '../../assets/robot.svg';

export default function RobotAnimation() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="robot-container w-[300px] h-[300px] relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ scale: 1 }}
        animate={{
          scale: hovered ? 1.05 : 1,
          y: hovered ? -10 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 15,
        }}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{ filter: 'drop-shadow(0 0 10px rgba(138, 43, 226, 0.7))' }}
          animate={{
            filter: hovered 
              ? 'drop-shadow(0 0 20px rgba(138, 43, 226, 0.9))' 
              : 'drop-shadow(0 0 10px rgba(138, 43, 226, 0.7))'
          }}
        >
          <img 
            src={robotSvg} 
            alt="Healthcare Robot Assistant" 
            className="w-full h-full"
          />
        </motion.div>
        
        {/* Pulsing glow effect */}
        <motion.div
          className="absolute left-1/2 bottom-[60px] w-[150px] h-[30px] -translate-x-1/2 rounded-full bg-purple-600 opacity-40 blur-md"
          animate={{
            opacity: hovered ? 0.6 : 0.4,
            width: hovered ? '170px' : '150px',
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </motion.div>
    </div>
  );
}