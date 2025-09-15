"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AnimatedLemonProps {
  className?: string;
}

export function AnimatedLemon({ className = "" }: AnimatedLemonProps) {
  const textItems = [
    { text: "BEST BRANDS", startOffset: "0%" },
    { text: "SUSTAINABLE", startOffset: "25%" },
    { text: "DREAMERS", startOffset: "50%" },
    { text: "CREATIVE MINDS", startOffset: "75%" },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Orbiting Curved Text */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Define circular path for text */}
            <path
              id="text-circle"
              d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
          </defs>
          
          {textItems.map((item, index) => (
            <motion.text
              key={index}
              className="text-xs font-bold fill-primary"
              style={{
                fontSize: "10px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                transformOrigin: "100px 100px",
              }}
              animate={{ rotate: -360 }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <textPath href="#text-circle" startOffset={item.startOffset}>
                {item.text}
              </textPath>
            </motion.text>
          ))}
        </svg>
      </motion.div>

      {/* Central Lemon Image */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-32 h-32 mx-auto"
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* TODO: Replace with actual 7.png when provided */}
        <div className="w-16 h-16 relative">
          <Image
            src="/images/lemon-placeholder.svg"
            alt="Lemon"
            width={64}
            height={64}
            className="w-full h-full"
          />
        </div>
      </motion.div>

      {/* Additional floating elements for visual interest */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute top-3 left-1/2 w-1.5 h-1.5 bg-primary/50 rounded-full transform -translate-x-1/2" />
        <div className="absolute bottom-3 left-1/2 w-1 h-1 bg-primary/30 rounded-full transform -translate-x-1/2" />
        <div className="absolute left-3 top-1/2 w-1 h-1 bg-primary/40 rounded-full transform -translate-y-1/2" />
        <div className="absolute right-3 top-1/2 w-1.5 h-1.5 bg-primary/60 rounded-full transform -translate-y-1/2" />
      </motion.div>

      {/* Subtle ring around the lemon */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/10"
        style={{
          width: "150px",
          height: "150px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}