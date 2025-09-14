"use client";

import { useEffect, useState } from "react";

export function HeroSection() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    setIsAnimating(true);
  }, []);

  const orbitingWords = [
    "BEST BRANDS",
    "SUSTAINABLE DREAMERS", 
    "CREATORS",
    "HERITAGE HOLDERS",
    "SCHOOLS",
    "TALENTS"
  ];

  return (
    <section className="min-h-screen bg-gray-light flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - ZEST Logo */}
        <div className="flex justify-center lg:justify-end">
          <div className="text-center">
            {/* Large ZEST Logo */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="bg-primary rounded-2xl p-6 shadow-lg">
                <span className="text-dark font-display font-bold text-6xl sm:text-7xl md:text-8xl">Z</span>
              </div>
              <span className="font-display font-bold text-6xl sm:text-7xl md:text-8xl text-dark">EST</span>
            </div>
          </div>
        </div>

        {/* Right side - Lemon with Orbiting Text */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Lemon SVG */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <svg
                width="280"
                height="320"
                viewBox="0 0 280 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-64 h-72 md:w-72 md:h-80"
              >
                {/* Lemon body - improved shape */}
                <path
                  d="M140 40C175 40 210 65 220 110C235 160 220 210 195 240C170 270 140 290 140 290C140 290 110 270 85 240C60 210 45 160 60 110C70 65 105 40 140 40Z"
                  stroke="#F6E05E"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Lemon leaf */}
                <path
                  d="M140 40C147 32 160 25 175 32C168 40 155 47 140 40Z"
                  stroke="#F6E05E"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Small inner detail */}
                <path
                  d="M140 70C160 70 180 85 185 110C190 135 180 160 165 175C150 190 140 200 140 200C140 200 130 190 115 175C100 160 90 135 95 110C100 85 120 70 140 70Z"
                  stroke="#F6E05E"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Orbiting Text Container */}
            <div className={`absolute inset-0 ${isAnimating ? 'animate-spin' : ''}`} style={{
              animation: isAnimating ? 'orbit 20s linear infinite' : 'none'
            }}>
              {orbitingWords.map((word, index) => {
                const angle = (360 / orbitingWords.length) * index;
                
                return (
                  <div
                    key={word}
                    className="absolute w-full h-full"
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <div 
                      className="absolute font-display font-bold text-sm md:text-base uppercase text-white whitespace-nowrap"
                      style={{
                        top: '20px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(-${angle}deg)`,
                        transformOrigin: 'center',
                      }}
                    >
                      {word}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}