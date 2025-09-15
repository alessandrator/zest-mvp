"use client";

import { motion } from "framer-motion";

interface AnimatedLemonProps {
  className?: string;
}

export function AnimatedLemon({ className = "" }: AnimatedLemonProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Orbiting Text */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30">
          {/* Text elements positioned around the circle */}
          <motion.span
            className="absolute text-sm font-medium text-primary"
            style={{
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)"
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Fresh
          </motion.span>
          
          <motion.span
            className="absolute text-sm font-medium text-primary"
            style={{
              top: "50%",
              right: "10%",
              transform: "translateY(-50%)"
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Creative
          </motion.span>
          
          <motion.span
            className="absolute text-sm font-medium text-primary"
            style={{
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)"
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Ideas
          </motion.span>
          
          <motion.span
            className="absolute text-sm font-medium text-primary"
            style={{
              top: "50%",
              left: "10%",
              transform: "translateY(-50%)"
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Zesty
          </motion.span>
        </div>
      </motion.div>

      {/* Central Lemon SVG */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-32 h-32"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 text-primary"
          fill="currentColor"
        >
          {/* Lemon shape */}
          <motion.path
            d="M50 10C35 10 25 25 25 40C25 55 35 70 50 90C65 70 75 55 75 40C75 25 65 10 50 10Z"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Lemon leaf */}
          <motion.path
            d="M50 10C55 5 60 8 58 12C56 16 52 14 50 10Z"
            fill="#22C55E"
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />
          {/* Lemon texture lines */}
          <motion.path
            d="M35 30Q50 35 65 30M35 45Q50 50 65 45M35 60Q50 65 65 60"
            stroke="#F59E0B"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}