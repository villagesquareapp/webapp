import { Skeleton } from "components/ui/skeleton";

const VFlixSkeleton = () => {
    return (
        <div className="relative w-full h-[calc(100vh-140px)] md:h-[85vh] rounded-xl overflow-hidden bg-black/20">
            {/* Main Video Area */}
            <Skeleton className="w-full h-full absolute inset-0 rounded-xl" />

            {/* Right Side Actions Overlay */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-4 z-10 items-end">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            {/* Bottom User Info Overlay */}
            <div className="absolute bottom-4 left-4 right-16 flex flex-col gap-2 z-10 px-2 pb-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full border-2 border-background" />
                    <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3 w-24 bg-white/50" />
                        <Skeleton className="h-3 w-32 bg-white/50" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-sm ml-2 bg-primary/20" />
                </div>
                <div className="space-y-1.5 mt-1 w-[70%]">
                    <Skeleton className="h-3 w-full bg-white/50" />
                    <Skeleton className="h-3 w-[80%] bg-white/50" />
                </div>
            </div>
        </div>
    );
};

export default VFlixSkeleton;
