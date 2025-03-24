import { Button } from "components/ui/button";
import { useEffect, useState, useRef } from "react";
import { CgEyeAlt } from "react-icons/cg";
import ReactPlayer from "react-player";

const PostVideo = ({
  src,
  media,
  showEchoButtons = true,
  isPlayingVideo,
  setIsPlayingVideo,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  className = "",
}: {
  media: IPostMedia;
  src: string;
  currentVideoPlaying: string;
  setCurrentVideoPlaying: (mediaID: string) => void;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (playing: boolean) => void;
  showEchoButtons?: boolean;
  className?: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Set up intersection observer to detect when video is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);

        // If video is playing but scrolled out of view, pause it
        if (!entry.isIntersecting && isPlaying) {
          setIsPlaying(false);
          if (currentVideoPlaying === media.uuid) {
            setIsPlayingVideo(false);
            setCurrentVideoPlaying("");
          }
        }
      },
      {
        threshold: 0.2, // 20% of the video must be visible
      }
    );

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, [media.uuid, currentVideoPlaying, isPlaying, setCurrentVideoPlaying, setIsPlayingVideo]);

  // When currentVideoPlaying changes, pause this video if it's not the current one
  useEffect(() => {
    if (currentVideoPlaying !== media.uuid) {
      setIsPlaying(false);
    }
  }, [currentVideoPlaying, media.uuid]);

  // When this video becomes the current video, start playing only if it's visible
  useEffect(() => {
    if (currentVideoPlaying === media.uuid && isPlayingVideo && isVisible) {
      setIsPlaying(true);
    }
  }, [currentVideoPlaying, media.uuid, isPlayingVideo, isVisible]);

  return (
    <div
      ref={videoRef}
      className={`w-full relative rounded-xl overflow-hidden bg-black ${className}`}
    >
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
            // Only allow playing if the video is visible
            if (isVisible) {
              setCurrentVideoPlaying(media.uuid);
              setIsPlayingVideo(true);
            } else {
              setIsPlaying(false);
            }
          }}
          onPause={() => {
            console.log("Video paused");
            if (currentVideoPlaying === media.uuid) {
              setIsPlayingVideo(false);
            }
          }}
          onEnded={() => {
            console.log("Video ended");
            if (currentVideoPlaying === media.uuid) {
              setIsPlayingVideo(false);
              setCurrentVideoPlaying("");
            }
          }}
          onError={(e) => {
            console.log("Video error:", e);
            if (currentVideoPlaying === media.uuid) {
              setIsPlayingVideo(false);
              setCurrentVideoPlaying("");
            }
          }}
        />
      </div>
    </div>
  );
};

export default PostVideo;
