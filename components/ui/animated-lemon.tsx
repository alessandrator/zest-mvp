"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AnimatedLemonProps {
  className?: string;
}

export function AnimatedLemon({ className = "" }: AnimatedLemonProps) {
  const textItems = [
    { text: "BEST BRANDS", angle: 0 },
    { text: "SUSTAINABLE", angle: 90 },
    { text: "DREAMERS", angle: 180 },
    { text: "CREATIVE MINDS", angle: 270 },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Orbiting Curved Text */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {textItems.map((item, index) => (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              transform: `rotate(${item.angle}deg)`,
            }}
          >
            {/* Curved text along circular path */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              style={{ overflow: "visible" }}
            >
              <defs>
                <path
                  id={`circle-${index}`}
                  d="M 100,100 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
                />
              </defs>
              <motion.text
                className="text-xs font-bold fill-primary"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  transformOrigin: "100px 100px",
                }}
              >
                <textPath href={`#circle-${index}`} startOffset="0%">
                  {item.text}
                </textPath>
              </motion.text>
            </svg>
          </div>
        ))}
      </motion.div>

      {/* Central Lemon Image */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-32 h-32 mx-auto"
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
        {/* TODO: Replace with actual 7.png when provided */}
        <div className="w-20 h-20 relative">
          <Image
            src="/images/lemon-placeholder.svg"
            alt="Lemon"
            width={80}
            height={80}
            className="w-full h-full"
          />
        </div>
      </motion.div>

      {/* Additional orbiting elements for visual interest */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute top-4 left-1/2 w-2 h-2 bg-primary/60 rounded-full transform -translate-x-1/2" />
        <div className="absolute bottom-4 left-1/2 w-1 h-1 bg-primary/40 rounded-full transform -translate-x-1/2" />
        <div className="absolute left-4 top-1/2 w-1.5 h-1.5 bg-primary/50 rounded-full transform -translate-y-1/2" />
        <div className="absolute right-4 top-1/2 w-1 h-1 bg-primary/30 rounded-full transform -translate-y-1/2" />
      </motion.div>
    </div>
  );
}