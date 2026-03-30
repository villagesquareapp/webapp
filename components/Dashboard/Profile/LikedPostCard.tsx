"use client";

import Image from "next/image";
import PostHeader from "components/Dashboard/Social/PostHeader";
import PostText from "components/Dashboard/Social/PostText";
import PostVideo from "components/Dashboard/Social/PostVideo";
import { Separator } from "components/ui/separator";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LikedPostCardProps {
    post: IPost;
    currentVideoPlaying: string;
    setCurrentVideoPlaying: (mediaID: string) => void;
    isPlayingVideo: boolean;
    setIsPlayingVideo: (playing: boolean) => void;
}

const LikedPostCard = ({
    post,
    currentVideoPlaying,
    setCurrentVideoPlaying,
    isPlayingVideo,
    setIsPlayingVideo,
}: LikedPostCardProps) => {
    const router = useRouter();
    const [isGloballyMuted, setIsGloballyMuted] = useState(true);

    const isSingleMedia = post?.media?.length === 1;

    const handlePostClick = () => {
        router.push(`/posts/${post.uuid}`);
    };

    return (
        <div className="flex flex-col gap-y-2 -mt-2 px-0 py-3 md:py-0 border-b md:border-b-0 border-gray-800">
            <PostHeader post={post} />

            <div
                className="flex flex-col cursor-pointer"
                onClick={handlePostClick}
            >
                {/* Post caption */}
                <div onClick={(e) => { e.stopPropagation(); handlePostClick(); }} className="cursor-pointer">
                    <PostText text={post?.caption} />
                </div>

                {/* Media */}
                {!!post?.media?.length && (
                    <div
                        className={`md:p-4 ${isSingleMedia ? "w-full" : "grid grid-cols-2 gap-1.5"}`}
                    >
                        {post?.media?.map((media, index, array) => {
                            const isLastItem = index === array.length - 1;
                            const isOddCount = array.length % 2 === 1;
                            const shouldSpanFull = !isSingleMedia && isLastItem && isOddCount;

                            return (
                                <div
                                    key={`${media?.uuid}-${index}`}
                                    className={`${shouldSpanFull ? "col-span-2" : ""} ${isSingleMedia ? "w-full" : ""}`}
                                >
                                    {media?.media_type === "image" && (
                                        <div
                                            className={`w-full relative rounded-xl md:rounded-2xl overflow-hidden ${isSingleMedia
                                                ? "aspect-[4/5] max-h-[500px]"
                                                : shouldSpanFull
                                                    ? "aspect-[16/9] max-h-[250px]"
                                                    : "aspect-[4/5]"
                                                }`}
                                        >
                                            <Image
                                                className="object-cover"
                                                src={media?.media_url}
                                                alt="post"
                                                fill
                                                sizes={isSingleMedia ? "100vw" : "500px"}
                                                quality={90}
                                                priority
                                            />
                                        </div>
                                    )}
                                    {media?.media_type === "video" && (
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <PostVideo
                                                media={media}
                                                currentVideoPlaying={currentVideoPlaying}
                                                setCurrentVideoPlaying={setCurrentVideoPlaying}
                                                src={media?.transcoded_media_url}
                                                showEchoButtons={false}
                                                isPlayingVideo={isPlayingVideo}
                                                setIsPlayingVideo={setIsPlayingVideo}
                                                className={
                                                    isSingleMedia
                                                        ? "aspect-[4/5] max-h-[500px]"
                                                        : shouldSpanFull
                                                            ? "aspect-[16/9] max-h-[250px]"
                                                            : "aspect-[4/5]"
                                                }
                                                isGloballyMuted={isGloballyMuted}
                                                setGlobalMuteState={setIsGloballyMuted}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Address */}
                {post?.address && (
                    <span className="flex flex-row items-center gap-x-1 mt-2">
                        <span className="text-xs text-muted-foreground">{post?.address}</span>
                    </span>
                )}
            </div>

            {/* "You liked this" label */}
            <div className="flex items-center gap-2 mt-1 pb-1">
                <Heart className="size-4 text-red-500 fill-red-500" />
                <span className="text-sm text-muted-foreground">You liked this</span>
            </div>

            <Separator className="mt-2 mb-2 md:my-0 hidden md:block opacity-80 -ml-4 lg:-ml-6 w-[calc(100%+32px)] lg:w-[calc(100%+48px)] max-w-none" />
        </div>
    );
};

export default LikedPostCard;
