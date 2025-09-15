"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedLemon } from "@/components/ui/animated-lemon";
import { motion } from "framer-motion";
import { User } from "@/types";

interface HeroSectionProps {
  user: User | null;
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-gray-100 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - ZEST Logo and Text */}
          <motion.div
            className="text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Large ZEST Logo */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            >
              <h1 className="text-8xl md:text-9xl zest-logo font-black text-dark leading-none">
                Z
                <motion.span
                  className="text-primary"
                  animate={{ 
                    textShadow: [
                      "0 0 0px #F6E05E",
                      "0 0 20px #F6E05E",
                      "0 0 0px #F6E05E"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  E
                </motion.span>
                ST
              </h1>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-display font-bold text-dark mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Where Brands Meet
              <span className="block text-primary">Creative Minds</span>
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Connect with talented students and creators. Build authentic campaigns 
              that resonate with Gen Z and millennial audiences through fresh, 
              innovative marketing strategies.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {user ? (
                <Button size="lg" className="group" asChild>
                  <Link href="/dashboard">
                    <span className="mr-2">Go to Dashboard</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="group" asChild>
                    <Link href="/request-access">
                      <span className="mr-2">Start Creating</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/campaigns">Explore Campaigns</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right side - Animated Lemon */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            <AnimatedLemon className="w-80 h-80" />
          </motion.div>
        </div>
      </div>

      {/* Background decorative elements */}
      <motion.div
        className="absolute top-10 right-10 w-2 h-2 bg-primary rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-3 h-3 bg-primary/60 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </section>
  );
}