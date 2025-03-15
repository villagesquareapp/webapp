import { Button } from "components/ui/button";
import { useState } from "react";
import { CgEyeAlt } from "react-icons/cg";
import ReactPlayer from "react-player";

const PostVideo = ({
  src,
  showEchoButtons = true,
  className = "",
}: {
  src: string;
  showEchoButtons?: boolean;
  className?: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`w-full relative rounded-xl overflow-hidden bg-black ${className}`}>
      {showEchoButtons && (
        <>
          <Button className="absolute bottom-4 right-4 rounded-full text-foreground text-xs font-semibold py-1 z-10">
            Explore More Livestreams
          </Button>
          <div className="rounded-full bg-muted-foreground absolute top-4 right-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs z-10">
            <CgEyeAlt className="size-4" />
            <span className="font-semibold">107</span>
          </div>
          {/* Echo - For sound wave */}
          <div className="rounded-full bg-red-600 absolute top-4 left-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs z-10">
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
        </>
      )}
      <div className="react-player-wrapper w-full h-full">
        <ReactPlayer
          url={src}
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
  );
};

export default PostVideo;
