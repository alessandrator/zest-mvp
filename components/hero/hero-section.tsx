"use client";

import React from 'react';

export function HeroSection() {
  return (
    <section className="min-h-screen w-full bg-[#d8d8d8] flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: ZEST Logo */}
          <div className="flex justify-center md:justify-end pr-8">
            <h1 className="font-black text-black select-none" style={{
              fontSize: 'clamp(4rem, 15vw, 14rem)',
              fontFamily: '"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 900,
              letterSpacing: '0.02em',
              lineHeight: 0.85
            }}>
              ZEST
            </h1>
          </div>
          
          {/* Right: Lemon with Orbiting Text */}
          <div className="flex justify-center md:justify-start relative pl-8">
            <div className="relative w-96 h-96">
              {/* Lemon SVG with hand-drawn style and animated orbiting text */}
              <svg 
                viewBox="0 0 400 400" 
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>
                  {`
                    .orbiting-text {
                      animation: orbit 20s linear infinite;
                      transform-origin: 200px 200px;
                    }
                    @keyframes orbit {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}
                </style>
                
                {/* Hand-drawn lemon outline path - more organic shape */}
                <path
                  id="lemon-path"
                  d="M200,50 C185,45 170,48 155,55 C140,65 130,80 125,95 C120,110 122,125 128,140 C120,145 115,152 112,160 C108,170 107,180 110,190 C115,205 125,220 140,230 C155,240 170,245 185,248 C200,250 215,248 230,245 C245,240 260,230 275,220 C285,205 290,190 292,175 C295,160 292,145 285,132 C290,120 292,107 290,95 C285,80 275,65 260,55 C245,48 230,45 215,48 C210,49 205,50 200,50 Z"
                  fill="none"
                  stroke="#FFFF66"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Orbiting text elements with animation */}
                <defs>
                  <path
                    id="text-path-outer"
                    d="M200,35 C180,30 160,33 140,43 C120,55 105,75 98,95 C92,115 95,135 105,152 C95,158 88,167 85,178 C80,192 79,206 85,220 C92,240 105,260 125,275 C145,290 165,295 185,298 C205,300 225,298 245,295 C265,290 285,275 305,260 C318,240 325,220 328,200 C330,180 328,160 320,142 C328,125 330,107 328,90 C325,70 318,50 305,35 C285,23 265,20 245,23 C235,24 225,26 215,28 C210,29 205,32 200,35 Z"
                  />
                </defs>
                
                {/* Animated text group */}
                <g className="orbiting-text">
                  <text fill="white" fontWeight="bold" fontSize="14" textAnchor="middle" fontFamily="Arial, sans-serif">
                    <textPath href="#text-path-outer" startOffset="0%">
                      BEST BRANDS
                    </textPath>
                  </text>
                  <text fill="white" fontWeight="bold" fontSize="14" textAnchor="middle" fontFamily="Arial, sans-serif">
                    <textPath href="#text-path-outer" startOffset="18%">
                      • SUSTAINABLE DREAMERS
                    </textPath>
                  </text>
                  <text fill="white" fontWeight="bold" fontSize="14" textAnchor="middle" fontFamily="Arial, sans-serif">
                    <textPath href="#text-path-outer" startOffset="45%">
                      • CREATORS
                    </textPath>
                  </text>
                  <text fill="white" fontWeight="bold" fontSize="14" textAnchor="middle" fontFamily="Arial, sans-serif">
                    <textPath href="#text-path-outer" startOffset="58%">
                      • HERITAGE HOLDERS
                    </textPath>
                  </text>
                  <text fill="white" fontWeight="bold" fontSize="14" textAnchor="middle" fontFamily="Arial, sans-serif">
                    <textPath href="#text-path-outer" startOffset="80%">
                      • SCHOOLS
                    </textPath>
                  </text>
                  <text fill="white" fontWeight="bold" fontSize="14" textAnchor="middle" fontFamily="Arial, sans-serif">
                    <textPath href="#text-path-outer" startOffset="90%">
                      • TALENTS •
                    </textPath>
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}