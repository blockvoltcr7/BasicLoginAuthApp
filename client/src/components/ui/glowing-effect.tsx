"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { animate } from "framer-motion";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
  children?: React.ReactNode;
}

const GlowingEffect = memo(
  ({
    blur = 30,
    inactiveZone = 0.7,
    proximity = 100,
    spread = 40,
    variant = "default",
    glow = true,
    className,
    movementDuration = 1,
    borderWidth = 2,
    disabled = false,
    children,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current || disabled) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0.8");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0.8");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              if (element) {
                element.style.setProperty("--start", String(value));
              }
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration, disabled]
    );

    useEffect(() => {
      if (disabled || typeof window === 'undefined') return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      // Set initial glow
      if (containerRef.current) {
        containerRef.current.style.setProperty("--active", "0.8");
        containerRef.current.style.setProperty("--start", "0");
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <div className="relative">
        {children}
        <div
          ref={containerRef}
          className={cn(
            "pointer-events-none absolute -inset-[3px] rounded-[inherit]",
            disabled && "hidden",
            className
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-[inherit]",
              "before:absolute before:-inset-[2px] before:rounded-[inherit]",
              "before:bg-[radial-gradient(circle_at_50%_50%,rgba(76,120,148,1)_0%,rgba(221,123,187,1)_25%,rgba(90,146,44,1)_50%,transparent_80%)]",
              "before:opacity-[var(--active)]",
              "before:blur-[var(--blur)]",
              "before:transition-opacity before:duration-500",
              "after:absolute after:-inset-[2px] after:rounded-[inherit]",
              "after:bg-[conic-gradient(from_var(--start)_at_50%_50%,rgba(76,120,148,1)_0deg,rgba(221,123,187,1)_120deg,rgba(90,146,44,1)_240deg,rgba(76,120,148,1)_360deg)]",
              "after:opacity-[var(--active)]",
              "after:blur-[calc(var(--blur)*0.7)]",
              "after:transition-opacity after:duration-500"
            )}
          />
        </div>
      </div>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };