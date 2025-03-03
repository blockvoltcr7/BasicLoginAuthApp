"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";

export interface TracingBeamProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  glowColor?: string;
  speed?: number;
  thickness?: number;
  repeatDelay?: number;
}

export const TracingBeam: React.FC<TracingBeamProps> = ({
  children,
  className = "",
  color = "rgba(255, 255, 255, 0.3)",
  glowColor = "rgba(255, 255, 255, 0.05)",
  speed = 4,
  thickness = 1.5,
  repeatDelay = 3,
}) => {
  // Using useAnimate hook instead of useAnimation for better control
  const [scope, animate] = useAnimate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Define the animation sequence
    const sequence = async () => {
      // Reset to initial state
      await animate("path", { pathLength: 0, opacity: 0 }, { duration: 0 });
      
      // Animate in
      await animate("path", { opacity: 1 }, { duration: 0.5 });
      
      // Trace the outline
      await animate(
        "path", 
        { pathLength: 1 }, 
        { duration: speed, ease: "easeInOut" }
      );
      
      // Pulse effect
      await animate(
        "path", 
        { strokeWidth: [thickness, thickness * 1.5, thickness] }, 
        { duration: 1, times: [0, 0.5, 1] }
      );
      
      // Hold for a moment
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fade out
      await animate("path", { opacity: 0.2 }, { duration: 1 });
      
      // Wait before repeating
      await new Promise(resolve => setTimeout(resolve, repeatDelay * 1000));
      
      // Repeat the sequence
      sequence();
    };
    
    // Start the animation sequence
    sequence();
    
    // Cleanup
    return () => {
      animate("path", { opacity: 0 }, { duration: 0 });
    };
  }, [animate, speed, thickness, repeatDelay]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Container for both glow and main beam */}
      <div ref={scope} className="absolute inset-0 pointer-events-none">
        {/* Glow effect */}
        <svg
          className="w-full h-full absolute inset-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,0 L100,0 L100,100 L0,100 Z"
            fill="none"
            stroke={glowColor}
            strokeWidth={thickness * 6}
            className="filter blur-sm"
            initial={{ pathLength: 0, opacity: 0 }}
          />
        </svg>
        
        {/* Main beam */}
        <svg
          className="w-full h-full absolute inset-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,0 L100,0 L100,100 L0,100 Z"
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            initial={{ pathLength: 0, opacity: 0 }}
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 