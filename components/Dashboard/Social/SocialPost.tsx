"use client";

import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import Image from "next/image";
import { useState } from "react";
import { CgEyeAlt } from "react-icons/cg";
import ReactPlayer from "react-player";
import PostHeader from "./PostHeader";
import SocialPostActionButtons from "./SocialPostActionButtons";
import SocialPostFilterDialog from "./SocialPostFilterDialog";
import PostText from "./PostText";

const SocialPost = () => {
  const postWriteup =
    "Ex aute fugiat do consequat ut cillum minim quis aliquip consectetur qui esse. Ea ut dolor amet excepteur ad do. #WixStudio #Good #Nice";

  let postType = "video";

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="border-b-[1.5px] flex justify-between">
        <div className="flex flex-row">
          {/* @Todo Font is bold and primary border when selected */}
          <span className="py-3 px-5 text-lg border-b-4 border-primary">For You</span>
          <span className="py-3 px-5 text-lg">Following</span>
        </div>
        <SocialPostFilterDialog />
      </div>
      <div className="border rounded-xl flex flex-col gap-y-4 py-4 ">
        {/* Post */}
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="flex flex-col gap-y-4">
            <PostHeader />
            {/* Image Post - optimized for 500px width */}
            {postType === "image" && (
              <div className="px-4">
                <div className="w-full  aspect-[4/5] relative rounded-xl overflow-hidden">
                  <Image
                    className="object-cover"
                    src="/images/beautiful-image.jpg"
                    alt="post"
                    fill
                    sizes="500px"
                    quality={90}
                    priority
                  />
                </div>
              </div>
            )}
            {/* Video Post */}
            {postType === "video" && (
              <div className="px-4">
                <div className="w-full  aspect-video rounded-xl overflow-hidden bg-black relative">
                  <Button className="absolute bottom-4 right-4 rounded-full text-foreground text-xs font-semibold py-1">
                    Explore More Livestreams
                  </Button>
                  <div className="rounded-full bg-muted-foreground absolute top-4 right-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs">
                    <CgEyeAlt className="size-4" />
                    <span className="font-semibold">107</span>
                  </div>
                  {/* Echo - For sound wave */}
                  <div className="rounded-full bg-red-600 absolute top-4 left-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs">
                    <div className="flex items-center gap-x-[2px] h-[12px]">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-[3px] bg-white rounded-full h-[4px] ${
                            isPlaying ? `animate-wave-${i}` : ""
                          }`}
                          style={{
                            animationDelay: `${(i - 1) * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-semibold ml-1 text-white">Echo</span>
                  </div>

                  <ReactPlayer
                    url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={isPlaying}
                    playsinline={true}
                    pip={true}
                    stopOnUnmount={true}
                    volume={0.8}
                    className="react-player"
                    style={{ borderRadius: "12px" }}
                    onPlay={() => {
                      console.log("Video playing");
                      setIsPlaying(true);
                    }}
                    onPause={() => {
                      console.log("Video paused");
                      setIsPlaying(false);
                    }}
                    onEnded={() => {
                      console.log("Video ended");
                      setIsPlaying(false);
                    }}
                    onError={(e) => {
                      console.log("Video error:", e);
                      setIsPlaying(false);
                    }}
                  />
                </div>
              </div>
            )}
            {/* Post text with highlighted hashtags */}
            <PostText text={postWriteup} />
            <SocialPostActionButtons />
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialPost;
