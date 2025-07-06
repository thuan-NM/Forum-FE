import { Skeleton } from "@heroui/react";

const TopicSkeleton = () => {
  return (
    <div className="p-4 space-y-3">
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-2 rounded-md bg-content2/80"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-32 h-4 rounded-full" />
          </div>
          <Skeleton className="w-14 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default TopicSkeleton;
