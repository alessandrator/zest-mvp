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
    <section className={`min-h-screen bg-gray-200 flex items-center justify-center ${className}`}>
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
            <div className="relative w-[28rem] h-[28rem] md:w-[32rem] md:h-[32rem] lg:w-[36rem] lg:h-[36rem]">
              
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
                  const radius = 220; // Distance from center
                  const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                  const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
                  
                  return (
                    <motion.div
                      key={word}
                      className="absolute font-display font-bold text-black text-sm md:text-base lg:text-lg uppercase tracking-wider whitespace-nowrap"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: "translate(-50%, -50%)",
                        textShadow: "0 1px 3px rgba(0,0,0,0.1)"
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
                  className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80"
                  fill="none"
                  stroke="#F6E05E"
                  strokeWidth="4"
                >
                  {/* Lemon body - oval shape */}
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="55"
                    ry="80"
                    transform="rotate(-15 100 100)"
                  />
                  
                  {/* Lemon top bump */}
                  <path
                    d="M80 40 Q100 28 120 40"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  
                  {/* Lemon bottom tip */}
                  <path
                    d="M100 180 L100 187"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  
                  {/* Lemon texture lines */}
                  <path
                    d="M68 68 Q100 75 132 68"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  <path
                    d="M63 95 Q100 103 137 95"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  <path
                    d="M68 122 Q100 130 132 122"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  <path
                    d="M73 149 Q100 157 127 149"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  
                  {/* Small leaf at top */}
                  <path
                    d="M100 33 Q90 23 80 30 Q87 36 100 33"
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