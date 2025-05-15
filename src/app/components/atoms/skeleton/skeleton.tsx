"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * A reusable skeleton loading component with customizable dimensions and styling
 */
export function Skeleton({ 
  className, 
  width, 
  height 
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-muted/60",
        className
      )}
      style={{ 
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined
      }}
    />
  );
}
