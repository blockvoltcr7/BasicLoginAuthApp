
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  // Additional custom props
};

const CustomLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium text-gray-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));

CustomLabel.displayName = LabelPrimitive.Root.displayName;

export { CustomLabel };
