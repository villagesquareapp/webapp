import { Skeleton } from "components/ui/skeleton";
import { Separator } from "components/ui/separator";

const PostSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-2 -mt-2 px-4 md:px-0 py-3 md:py-0 border-b md:border-b-0 border-gray-800">
            {/* Post Header */}
            <div className="flex flex-row gap-x-2 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="ml-auto h-4 w-4 rounded-full" />
            </div>

            {/* Post Content */}
            <div className="flex flex-col gap-y-2 mt-2">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                </div>

                {/* Media Placeholder */}
                <div className="mt-2 w-full aspect-[4/5] rounded-xl overflow-hidden">
                    <Skeleton className="w-full h-full" />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            <Separator className="my-2 md:my-0 hidden md:block" />
        </div>
    );
};

export default PostSkeleton;
