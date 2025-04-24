import { useState } from 'react';
import { motion } from 'framer-motion';

// Inline SVG component that can be animated
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
          animate={{
            filter: hovered 
              ? 'drop-shadow(0 0 20px rgba(138, 43, 226, 0.9))' 
              : 'drop-shadow(0 0 10px rgba(138, 43, 226, 0.7))'
          }}
        >
          {/* Inline SVG Robot */}
          <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            {/* Platform with glow */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <radialGradient id="platformGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#8a2be2" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8a2be2" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Platform glow */}
            <ellipse cx="200" cy="320" rx="80" ry="30" fill="url(#platformGlow)" opacity="0.7" />
            
            {/* Platform */}
            <rect x="150" y="280" width="100" height="40" rx="5" fill="#ffffff" />
            <rect x="152" y="282" width="96" height="36" rx="4" fill="#f0f0f0" />
            
            {/* Robot Body */}
            <motion.g
              animate={{
                y: hovered ? -5 : 0
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {/* Legs */}
              <path d="M180,280 C180,260 175,255 175,255 L185,255 C185,255 180,260 180,280" fill="#333333" />
              <path d="M220,280 C220,260 225,255 225,255 L215,255 C215,255 220,260 220,280" fill="#333333" />
              
              {/* Feet */}
              <ellipse cx="175" cy="280" rx="10" ry="5" fill="#444444" />
              <ellipse cx="225" cy="280" rx="10" ry="5" fill="#444444" />
              
              {/* Torso */}
              <path d="M165,230 L235,230 C240,230 245,235 245,240 L245,255 C245,260 240,265 235,265 L165,265 C160,265 155,260 155,255 L155,240 C155,235 160,230 165,230" fill="#333333" />
              
              {/* Arms */}
              <motion.path 
                d="M155,240 L145,245 C142,247 140,250 140,250 C140,250 142,252 145,253 L155,255" 
                fill="#333333"
                animate={{ rotate: hovered ? 15 : 0 }}
                style={{ transformOrigin: "155px 245px" }}
              />
              <motion.path 
                d="M245,240 L255,245 C258,247 260,250 260,250 C260,250 258,252 255,253 L245,255" 
                fill="#333333"
                animate={{ rotate: hovered ? -15 : 0 }}
                style={{ transformOrigin: "245px 245px" }}
              />
              
              {/* Hands */}
              <motion.circle 
                cx="140" cy="250" r="5" 
                fill="#444444"
                animate={{ x: hovered ? -5 : 0, y: hovered ? 5 : 0 }}
              />
              <motion.circle 
                cx="260" cy="250" r="5" 
                fill="#444444"
                animate={{ x: hovered ? 5 : 0, y: hovered ? 5 : 0 }}
              />
              
              {/* Head */}
              <rect x="165" y="180" width="70" height="50" rx="5" fill="#222222" />
              
              {/* Eyes */}
              <motion.circle 
                cx="185" cy="205" r="10" 
                fill="#ffffff" 
                filter="url(#glow)"
                animate={{ 
                  opacity: [1, 0.8, 1],
                  scale: hovered ? 1.1 : 1
                }}
                transition={{
                  opacity: {
                    duration: 2,
                    repeat: Infinity
                  },
                  scale: {
                    duration: 0.5
                  }
                }}
              />
              <motion.circle 
                cx="215" cy="205" r="10" 
                fill="#ffffff" 
                filter="url(#glow)"
                animate={{ 
                  opacity: [1, 0.8, 1],
                  scale: hovered ? 1.1 : 1
                }}
                transition={{
                  opacity: {
                    duration: 2,
                    repeat: Infinity
                  },
                  scale: {
                    duration: 0.5
                  }
                }}
              />
              
              {/* Antenna */}
              <rect x="195" y="170" width="10" height="15" fill="#333333" />
              <motion.circle 
                cx="200" cy="165" r="10" 
                fill="#8a2be2" 
                filter="url(#glow)"
                animate={{ 
                  opacity: [0.8, 1, 0.8],
                  scale: hovered ? 1.3 : 1
                }}
                transition={{
                  opacity: {
                    duration: 1,
                    repeat: Infinity
                  },
                  scale: {
                    duration: 0.5
                  }
                }}
              />
              
              {/* Ear/Side Light */}
              <motion.circle 
                cx="165" cy="205" r="5" 
                fill="#8a2be2" 
                filter="url(#glow)"
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
            </motion.g>
          </svg>
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