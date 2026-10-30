import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export default function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn("animate-pulse bg-gray-200 rounded-lg", className)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)} />
  );
}

export { LoadingSkeleton };
