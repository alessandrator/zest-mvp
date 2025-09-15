"use client";

import { motion } from "framer-motion";

interface NewHeroSectionProps {
  className?: string;
}

export function NewHeroSection({ className = "" }: NewHeroSectionProps) {
  // Words to orbit around the lemon
  const orbitingWords = [
    "BEST BRANDS",
    "SUSTAINABLE DREAMERS", 
    "CREATORS",
    "HERITAGE HOLDERS",
    "SCHOOLS",
    "TALENTS"
  ];

  return (
    <section className={`min-h-screen bg-gray-400 flex items-center justify-center ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - ZEST Logo */}
          <div className="text-left flex items-center justify-center lg:justify-start">
            <h1 className="text-8xl md:text-9xl lg:text-[14rem] xl:text-[16rem] font-display font-black text-black leading-none tracking-tight">
              ZEST
            </h1>
          </div>

          {/* Right side - Lemon with Orbiting Text */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-96 h-96 md:w-[28rem] md:h-[28rem]">
              
              {/* Orbiting Text Animation */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {orbitingWords.map((word, index) => {
                  const angle = (360 / orbitingWords.length) * index;
                  const radius = 200; // Distance from center
                  const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                  const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
                  
                  return (
                    <motion.div
                      key={word}
                      className="absolute font-display font-bold text-white text-xs md:text-sm lg:text-base uppercase tracking-wider whitespace-nowrap"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: "translate(-50%, -50%)",
                        textShadow: "0 1px 3px rgba(0,0,0,0.3)"
                      }}
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      {word}
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Central Lemon SVG */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64"
                  fill="none"
                  stroke="#F6E05E"
                  strokeWidth="4"
                >
                  {/* Lemon body - oval shape */}
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="50"
                    ry="75"
                    transform="rotate(-15 100 100)"
                  />
                  
                  {/* Lemon top bump */}
                  <path
                    d="M82 42 Q100 30 118 42"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  
                  {/* Lemon bottom tip */}
                  <path
                    d="M100 175 L100 182"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  
                  {/* Lemon texture lines */}
                  <path
                    d="M70 70 Q100 76 130 70"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  <path
                    d="M65 95 Q100 102 135 95"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  <path
                    d="M70 120 Q100 127 130 120"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  <path
                    d="M75 145 Q100 152 125 145"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  
                  {/* Small leaf at top */}
                  <path
                    d="M100 35 Q92 25 82 32 Q88 38 100 35"
                    fill="#22C55E"
                    stroke="#22C55E"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}