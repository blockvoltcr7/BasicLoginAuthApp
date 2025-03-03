
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Additional props specific to custom input
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 100; // size of the hover effect
    const [visible, setVisible] = React.useState(false);
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/input"
      >
        <motion.div
          className="absolute -inset-px rounded-lg opacity-0 group-hover/input:opacity-100 group-hover/input:duration-500 duration-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
          style={{
            opacity: visible ? 1 : 0,
            background: useMotionTemplate`
              radial-gradient(
                ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
                rgba(101, 60, 255, 0.15),
                transparent 80%
              )
            `,
          }}
        />
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-black px-3 py-2 text-sm",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground focus-visible:outline-none",
            "focus-visible:ring-1 focus-visible:ring-purple-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "text-gray-100",
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export { CustomInput };
