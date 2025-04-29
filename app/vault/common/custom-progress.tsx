import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  maxValue?: number;
  color?: string;
  track?: string;
  segmentWidth?: number;
  gap?: number;
  animate?: boolean;
}

export const CustomProgress = React.forwardRef<
  HTMLDivElement,
  CustomProgressProps
>(
  (
    {
      value,
      maxValue = 100,
      color = "#DA913E",
      track = "#E5E5E1",
      segmentWidth = 1,
      gap = 2,
      animate = true,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [segments, setSegments] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
      const updateSegments = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          const count = Math.floor((width + gap) / (segmentWidth + gap));
          setSegments(count);
        }
      };
      updateSegments();
      const resizeObserver = new window.ResizeObserver(updateSegments);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => resizeObserver.disconnect();
    }, [segmentWidth, gap]);

    const percentage = Math.min(100, (value / maxValue) * 100);
    const filledSegments = Math.round((percentage / 100) * segments);

    const getSegmentScale = (index: number) => {
      if (hoveredIndex === null) return 1;

      const distance = Math.abs(index - hoveredIndex);
      if (distance > 2) return 1;

      return 1 + 0.3 * (1 - distance / 3);
    };

    return (
      <div
        ref={containerRef}
        className={cn("h-4 w-full", className)}
        {...props}
      >
        <div className="flex h-full w-full cursor-pointer items-center">
          {Array.from({ length: segments }).map((_, i) => {
            let bg = track;

            if (i < filledSegments) {
              bg = color;
            }

            return (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={{
                  scale: getSegmentScale(i),
                }}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                transition={
                  animate ? { duration: 0.3, ease: "easeIn" } : undefined
                }
                className={cn("flex h-full")}
              >
                <motion.div
                  initial={{ background: track }}
                  animate={{
                    background: bg,
                    scale: getSegmentScale(i),
                  }}
                  transition={
                    animate ? { duration: 0.3, ease: "easeOut" } : undefined
                  }
                  className="h-full"
                  style={{
                    width: segmentWidth,
                  }}
                ></motion.div>
                <div
                  className="h-full bg-transparent"
                  style={{
                    width: gap,
                  }}
                ></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }
);

CustomProgress.displayName = "CustomProgress";
