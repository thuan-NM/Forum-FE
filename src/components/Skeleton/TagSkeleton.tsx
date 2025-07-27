import React from "react";
import { Skeleton } from "@heroui/react";

const TagSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div
      className="grid gap-4
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-border rounded-xl p-4 shadow-sm bg-card w-full"
        >
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
};

export default TagSkeleton;
