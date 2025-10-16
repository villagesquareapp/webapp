import { Button } from "components/ui/button";
import { useEffect, useState, useRef } from "react";
import { CgEyeAlt } from "react-icons/cg";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import ReactPlayer from "react-player";
import { set } from "zod";

const PostVideo = ({
  src,
  media,
  showEchoButtons,
  isPlayingVideo,
  setIsPlayingVideo,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  className = "",
  isGloballyMuted,
  setGlobalMuteState,
}: {
  media: IPostMedia;
  src: string;
  currentVideoPlaying: string;
  setCurrentVideoPlaying: (mediaID: string) => void;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (playing: boolean) => void;
  showEchoButtons?: boolean;
  className?: string;
  isGloballyMuted: boolean;
  setGlobalMuteState: (muted: boolean) => void;
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Video starts loading
  const playerRef = useRef<ReactPlayer>(null);
  // Track if the user has manually paused the video
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // A single, reliable source for play/pause state for this specific video
  const isThisPlaying = currentVideoPlaying === media.uuid && isPlayingVideo;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // This video is in the viewport, so it should play
          if (!isManuallyPaused) {
            setCurrentVideoPlaying(media.uuid);
            setIsPlayingVideo(true);
          }
        } else {
          // This video is NOT in the viewport, it should be paused
          // Only pause if this video was the one currently playing
          if (currentVideoPlaying === media.uuid) {
            setCurrentVideoPlaying("");
            setIsPlayingVideo(false);
          }
        }
      },
      {
        threshold: 0.8,
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
  }, [media.uuid, setCurrentVideoPlaying, setIsPlayingVideo, currentVideoPlaying]);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThisPlaying) {
      // If it's playing, clicking should pause it
      setCurrentVideoPlaying("");
      setIsPlayingVideo(false);
      setIsManuallyPaused(true); // User manually paused
    } else {
      // If it's paused, clicking should play it
      setCurrentVideoPlaying(media.uuid);
      setIsPlayingVideo(true);
      setIsManuallyPaused(false); // User manually played
    }
  };

  return (
    <div
      ref={videoRef}
      className={`w-full relative rounded-xl overflow-hidden bg-black ${className}`}
    >
      <ReactPlayer
        ref={playerRef}
        url={media.transcoded_media_url || src}
        playing={isThisPlaying}
        loop={true}
        muted={isGloballyMuted}
        width="100%"
        height="100%"
        playsinline
        light={false}
        pip={false}
        onBuffer={() => setIsLoading(true)}
        onBufferEnd={() => setIsLoading(false)}
        config={{
          file: {
            attributes: {
              playsInline: true,
              loop: true,
              style: { width: "100%", height: "100%" },
            },
            forceHLS: (media.transcoded_media_url || src)?.endsWith(".m3u8"),
            hlsOptions: {
              enableLowLatencyMode: true,
              backBufferLength: 90,
              maxBufferLength: 30,
              maxMaxBufferLength: 600,
              maxBufferSize: 60 * 1000 * 1000,
              maxBufferHole: 0.5,
              lowLatencyMode: true,
              liveDurationInfinity: true,
              liveBackBufferLength: 0,
              progressive: true,
            },
          },
        }}
      />

      {/* Loading spinner overlay */}
      {isLoading && isThisPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200">
          <ImSpinner2 className="text-white text-4xl animate-spin" />
        </div>
      )}

      {/* Play/Pause button overlay - Only show when video is NOT playing */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          isThisPlaying && !isLoading ? "opacity-0" : "opacity-100 bg-black/20"
        }`}
        onClick={handleVideoClick}
      >
        {isThisPlaying && !isLoading ? (
          <FaPause className="text-white text-4xl opacity-80" />
        ) : (
          <FaPlay className="text-white text-4xl opacity-80" />
        )}
      </div>

      {/* Mute/Unmute Button - Placed at a new location to not interfere */}
      <Button
        onClick={() => setGlobalMuteState(!isGloballyMuted)}
        className="absolute bottom-4 right-4 rounded-full p-2 z-20 bg-gray-800/50 text-white"
      >
        {isGloballyMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </Button>

      {showEchoButtons && (
        <>
          <Button className="absolute bottom-4 right-4 rounded-full text-foreground text-xs font-semibold py-1 z-10">
            Explore More Livestreams
          </Button>
          <div className="rounded-full bg-muted-foreground absolute top-4 right-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs z-10">
            <CgEyeAlt className="size-4" />
            <span className="font-semibold">107</span>
          </div>
        </>
      )}
    </div>
  );
};

export default PostVideo;