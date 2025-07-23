import { Skeleton } from "@heroui/react";

const AnswerHeaderSkeleton = () => {
  return (
    <div className="flex items-center gap-x-2">
      {/* Skeleton cho Avatar */}
      <Skeleton className="w-8 h-8 sm:w-6 sm:h-6 rounded-full" />
      <div className="flex flex-col text-xs gap-y-1 w-full">
        {/* Skeleton cho Username & Follow */}
        <div className="flex flex-wrap items-center gap-x-1">
          <Skeleton className="w-32 h-4 rounded-md" />
        </div>
        {/* Skeleton cho Email & Timestamp */}
        <div className="flex flex-wrap items-center gap-x-1 opacity-90 text-xs">
          <Skeleton className="w-48 h-3 rounded-md hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
const AnswerContentSkeleton = () => {
  return (
    <div className="space-y-2 mt-4">
      <Skeleton className="h-5 w-full rounded-md" />
      <Skeleton className="h-5 w-full rounded-md" />
    </div>
  );
};

const AnswerFooterSkeleton = () => {
  return (
    <div className="space-y-2 mt-4">
      <Skeleton className="h-5 w-full rounded-md" />
    </div>
  );
};
export { AnswerHeaderSkeleton, AnswerContentSkeleton, AnswerFooterSkeleton };
