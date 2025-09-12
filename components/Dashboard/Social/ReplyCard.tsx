import { useEffect, useState } from "react";
import Image from "next/image";
import CustomAvatar from "components/ui/custom/custom-avatar";
import PostVideo from "./PostVideo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "components/ui/carousel";
import SocialPostActionButtons from "./SocialPostActionButtons";

interface ReplyCardProps {
  reply: IPostComment;
  post: IPost;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  currentVideoPlaying: string;
  setCurrentVideoPlaying: (mediaID: string) => void;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (playing: boolean) => void;
}

export default function ReplyCard({
  reply,
  post,
  setPosts,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  isPlayingVideo,
  setIsPlayingVideo,
}: ReplyCardProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [api, setApi] = useState<CarouselApi | null>(null);
  // To track which media is active in carousel for video play/pause
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    // set initial index
    setActiveIndex(api.selectedScrollSnap());

    // update when slide changes
    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex gap-3 p-4">
      <CustomAvatar
        src={reply.user?.profile_picture || ""}
        name={reply.user?.name || ""}
        className="size-8 border-foreground border-[1.5px]"
      />
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white">
              {reply.user?.name}
            </span>
            <span className="text-xs text-gray-400">
              · {reply.formatted_time}
            </span>
          </div>
          <div className="text-xs text-gray-400 my-1">@{reply.user?.username}</div>
        </div>

        {/* Caption */}
        <p className="text-sm text-gray-200 mt-4">{reply.caption}</p>

        {/* Media */}
        {reply.media?.length === 1 && (
          <div className="mt-2 rounded-xl overflow-hidden">
            {reply.media[0].media_type === "image" ? (
              <Image
                src={reply.media[0].media_url}
                alt="reply media"
                width={500}
                height={500}
                className="rounded-xl object-contain"
              />
            ) : (
              <PostVideo
                media={reply.media[0]}
                src={reply.media[0].media_url}
                currentVideoPlaying={currentVideoPlaying}
                setCurrentVideoPlaying={setCurrentVideoPlaying}
                isPlayingVideo={isPlayingVideo}
                setIsPlayingVideo={setIsPlayingVideo}
                isGloballyMuted={isMuted}
                setGlobalMuteState={setIsMuted}
                className="rounded-xl aspect-[4/5] max-h-[400px]"
              />
            )}
          </div>
        )}

        {reply.media?.length > 1 && (
          <div className="mt-2">
            <Carousel setApi={setApi}>
              <CarouselContent>
                {reply.media.map((media, index) => (
                  <CarouselItem key={index}>
                    {media.media_type === "image" ? (
                      <Image
                        src={media.media_url}
                        alt="reply media"
                        width={500}
                        height={500}
                        className="rounded-xl object-contain"
                      />
                    ) : (
                      <PostVideo
                        media={media}
                        src={media.media_url}
                        currentVideoPlaying={currentVideoPlaying}
                        setCurrentVideoPlaying={setCurrentVideoPlaying}
                        isPlayingVideo={activeIndex === index && isPlayingVideo}
                        setIsPlayingVideo={setIsPlayingVideo}
                        isGloballyMuted={isMuted}
                        setGlobalMuteState={setIsMuted}
                        showEchoButtons={false}
                        className="rounded-xl aspect-[4/5] max-h-[400px]"
                      />
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {/* Actions */}
        {/* <SocialPostActionButtons
          setPosts={setPosts}
          likeUnlikePost={() => {}}
          saveUnsavePost={() => {}}
          post={post}
          user={user}
        /> */}
      </div>
    </div>
  );
}
