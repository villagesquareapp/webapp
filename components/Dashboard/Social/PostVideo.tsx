import { Button } from "components/ui/button";
import { useEffect, useState, useRef } from "react";
import { CgEyeAlt } from "react-icons/cg";
import { FaPlay, FaPause } from "react-icons/fa";
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Set up intersection observer to detect when video is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);

        // If video is playing but scrolled out of view, pause it
        if (!entry.isIntersecting && isPlaying) {
          handlePause();
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

  // Safe play/pause handlers with debouncing
  const handlePlay = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setIsPlaying(true);
    setIsPlayingVideo(true);
    setCurrentVideoPlaying(media.uuid);

    // Release transition lock after a short delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handlePause = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setIsPlaying(false);
    setIsPlayingVideo(false);
    setCurrentVideoPlaying("");

    // Release transition lock after a short delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // When currentVideoPlaying changes, pause this video if it's not the current one
  useEffect(() => {
    if (currentVideoPlaying !== media.uuid && isPlaying) {
      handlePause();
    }
  }, [currentVideoPlaying, media.uuid]);

  // When this video becomes the current video, start playing only if it's visible
  useEffect(() => {
    if (currentVideoPlaying === media.uuid && isPlayingVideo && isVisible && !isPlaying) {
      handlePlay();
    }
  }, [currentVideoPlaying, media.uuid, isPlayingVideo, isVisible]);

  return (
    <div
      ref={videoRef}
      className={`w-full relative rounded-xl overflow-hidden bg-black ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isVisible || isTransitioning) return;

        if (isPlaying) {
          handlePause();
        } else {
          handlePlay();
        }
      }}
    >
      {/* Play/Pause overlay */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${
          isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
        } pointer-events-none`}
      >
        {isPlaying ? (
          <FaPause className="text-white text-4xl opacity-80" />
        ) : (
          <FaPlay className="text-white text-4xl opacity-80" />
        )}
      </div>

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
          </div>
        </>
      )}
      <ReactPlayer
        url={media.transcoded_media_url || src}
        playing={isPlaying}
        controls
        width="100%"
        height="100%"
        playsinline
        light={false}
        onPlay={() => {
          // Only allow playing if the video is visible
          if (isVisible && !isTransitioning) {
            handlePlay();
          } else if (!isVisible) {
            handlePause();
          }
        }}
        onPause={() => {
          if (currentVideoPlaying === media.uuid && !isTransitioning) {
            handlePause();
          }
        }}
        onEnded={() => {
          if (currentVideoPlaying === media.uuid) {
            handlePause();
          }
        }}
        onError={(e) => {
          console.error("Video error:", e);

          // Don't treat AbortError as a real error - it's just a play/pause interruption
          if (e && e.name === "AbortError") {
            // Just log it and continue
            console.log("Play interrupted, this is normal when switching videos quickly");
            return;
          }

          // For actual errors, stop the video
          if (currentVideoPlaying === media.uuid) {
            handlePause();
          }
        }}
        config={{
          file: {
            attributes: {
              playsInline: true,
              style: { width: "100%", height: "100%" },
            },
            forceHLS: true,
            hlsOptions: {
              enableLowLatencyMode: true,
              backBufferLength: 90,
              maxBufferLength: 30,
              maxMaxBufferLength: 600,
              maxBufferSize: 60 * 1000 * 1000,
              maxBufferHole: 0.5,
              lowLatencyMode: true,
            },
          },
        }}
      />
    </div>
  );
};

export default PostVideo;
