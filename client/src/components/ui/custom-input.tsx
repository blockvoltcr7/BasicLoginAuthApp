"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <motion.div
        className="relative w-full"
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.2 }}
      >
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md bg-black px-3 py-2 text-sm text-white",
            "border border-white/10 hover:border-white/20",
            "ring-offset-background transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-gray-500",
            "focus:outline-none focus:ring-1 focus:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
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