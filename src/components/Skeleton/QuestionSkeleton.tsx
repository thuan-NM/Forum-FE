import { Skeleton } from "@heroui/react"


const QuestionSkeleton = () => {
    return (
        <div className="text-center">
            <Skeleton className="w-full h-32 rounded-lg" />
        </div>
    )
}

export { QuestionSkeleton, }