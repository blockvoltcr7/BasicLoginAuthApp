"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  value: externalValue,
  className,
  inputClassName,
  showButton = true,
  submitOnEnter = true,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  value?: string;
  className?: string;
  inputClassName?: string;
  showButton?: boolean;
  submitOnEnter?: boolean;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState(externalValue || "");
  const [animating, setAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update internal value when external value changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  // Rotate placeholders
  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  }, [placeholders.length]);

  useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAnimation]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      setAnimating(true);
      onSubmit(e);
      setTimeout(() => {
        setValue("");
        setAnimating(false);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && submitOnEnter && !animating) {
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  return (
    <form
      className={cn(
        "relative w-full bg-background h-12 rounded-lg overflow-hidden border shadow-sm transition duration-200",
        className
      )}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange && onChange(e);
          }
        }}
        onKeyDown={handleKeyDown}
        type="text"
        className={cn(
          "w-full h-full bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-ring",
          animating && "opacity-0 transition-opacity duration-300",
          inputClassName
        )}
      />

      <div className="absolute inset-0 flex items-center pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.5, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground px-4 truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {showButton && value && (
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-opacity"
          disabled={animating}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </motion.svg>
        </button>
      )}
    </form>
  );
}
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  value: externalValue,
  className,
  inputClassName,
  showButton = true,
  submitOnEnter = true,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  value?: string;
  className?: string;
  inputClassName?: string;
  showButton?: boolean;
  submitOnEnter?: boolean;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState(externalValue || "");
  const [animating, setAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update internal value when external value changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  // Rotate placeholders
  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  }, [placeholders.length]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  }, [startAnimation]);

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange, startAnimation]);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let i = 0; i < pixelData.length; i += 4) {
      if (pixelData[i] > 0 || pixelData[i + 1] > 0 || pixelData[i + 2] > 0) {
        const x = (i / 4) % 800;
        const y = Math.floor(i / 4 / 800);
        if (Math.random() < 0.2) {
          newData.push({
            x,
            y,
            r: 3,
            color: `rgb(${pixelData[i]}, ${pixelData[i + 1]}, ${
              pixelData[i + 2]
            })`,
          });
        }
      }
    }

    newDataRef.current = newData;
  }, [value]);

  const animate = useCallback(
    (start: number) => {
      const animateFrame = (pos: number = 0) => {
        requestAnimationFrame(() => {
          const newArr = [];
          for (let i = 0; i < newDataRef.current.length; i++) {
            const current = newDataRef.current[i];
            if (current.x < pos) {
              newArr.push(current);
            } else {
              if (current.r <= 0) {
                current.r = 0;
                continue;
              }
              current.x += Math.random() > 0.5 ? 1 : -1;
              current.y += Math.random() > 0.5 ? 1 : -1;
              current.r -= 0.05 * Math.random();
              newArr.push(current);
            }
          }
          newDataRef.current = newArr;
          const ctx = canvasRef.current?.getContext("2d");
          if (ctx) {
            ctx.clearRect(pos, 0, 800, 800);
            newDataRef.current.forEach((t) => {
              const { x: n, y: i, r: s, color: color } = t;
              if (n > pos) {
                ctx.beginPath();
                ctx.rect(n, i, s, s);
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                ctx.stroke();
              }
            });
          }
          if (newDataRef.current.length > 0) {
            animateFrame(pos - 8);
          } else {
            setValue("");
            setAnimating(false);
          }
        });
      };
      animateFrame(start);
    },
    []
  );

  const vanishAndSubmit = useCallback(() => {
    if (value && !animating) {
      setAnimating(true);
      draw();
      animate(800);
    }
  }, [value, animating, draw, animate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !animating && submitOnEnter) {
        vanishAndSubmit();
      }
    },
    [animating, submitOnEnter, vanishAndSubmit]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      vanishAndSubmit();
      onSubmit && onSubmit(e);
    },
    [onSubmit, vanishAndSubmit]
  );

  return (
    <form
      className={cn(
        "w-full relative h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        value && "bg-muted",
        className
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        className={cn(
          "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 origin-top-left",
          !animating ? "opacity-0" : "opacity-100"
        )}
        ref={canvasRef}
      />

      <input
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange && onChange(e);
          }
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        className={cn(
          "w-full relative z-10 border-none bg-transparent h-full rounded-full focus:outline-none focus:ring-0 px-4",
          animating && "text-transparent",
          inputClassName
        )}
      />

      <div className="absolute inset-0 flex items-center pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.5, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground px-4 truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {showButton && value && (
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-opacity"
          disabled={animating}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </motion.svg>
        </button>
      )}
    </form>
  );
}
