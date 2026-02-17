import { Button } from "components/ui/button";
import { useEffect, useState, useRef, useCallback } from "react";
import { CgEyeAlt } from "react-icons/cg";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import Hls from "hls.js";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  const isThisPlaying = currentVideoPlaying === media.uuid && isPlayingVideo;

  // Use direct URL now that CORS is fixed on CloudFront
  const videoUrl = media.transcoded_media_url || src;
  const isHLS = videoUrl?.includes(".m3u8");

  // Setup HLS or native video source
  useEffect(() => {
    const video = videoElRef.current;
    if (!video || !videoUrl) return;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (isHLS && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 10,
        maxMaxBufferLength: 30,
        maxBufferSize: 10 * 1000 * 1000,
        maxBufferHole: 0.5,
        backBufferLength: 5,
        startLevel: -1,
        abrEwmaDefaultEstimate: 500_000,
        enableWorker: true,
        lowLatencyMode: false,
        manifestLoadingTimeOut: 8000,
        manifestLoadingMaxRetry: 2,
        levelLoadingTimeOut: 8000,
        fragLoadingTimeOut: 10000,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (isHLS && video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = videoUrl;
    } else {
      // Regular mp4
      video.src = videoUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, isHLS]);

  // Play/pause control
  useEffect(() => {
    const video = videoElRef.current;
    if (!video) return;

    if (isThisPlaying) {
      video.play().catch(() => {
        // Autoplay blocked — ignore
      });
    } else {
      video.pause();
    }
  }, [isThisPlaying]);

  // Mute control
  useEffect(() => {
    const video = videoElRef.current;
    if (video) {
      video.muted = isGloballyMuted;
    }
  }, [isGloballyMuted]);

  // Intersection observer for auto-play on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (!isManuallyPaused) {
            setCurrentVideoPlaying(media.uuid);
            setIsPlayingVideo(true);
          }
        } else {
          if (currentVideoPlaying === media.uuid) {
            setCurrentVideoPlaying("");
            setIsPlayingVideo(false);
          }
        }
      },
      { threshold: 0.8 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [media.uuid, setCurrentVideoPlaying, setIsPlayingVideo, currentVideoPlaying, isManuallyPaused]);

  const handleVideoClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isThisPlaying) {
        setCurrentVideoPlaying("");
        setIsPlayingVideo(false);
        setIsManuallyPaused(true);
      } else {
        setCurrentVideoPlaying(media.uuid);
        setIsPlayingVideo(true);
        setIsManuallyPaused(false);
      }
    },
    [isThisPlaying, media.uuid, setCurrentVideoPlaying, setIsPlayingVideo]
  );

  return (
    <div
      ref={containerRef}
      className={`w-full relative rounded-xl overflow-hidden bg-black ${className}`}
    >
      <video
        ref={videoElRef}
        loop
        playsInline
        muted={isGloballyMuted}
        poster={media.media_thumbnail || ""}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Loading spinner */}
      {isLoading && isThisPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200">
          <ImSpinner2 className="text-white text-4xl animate-spin" />
        </div>
      )}

      {/* Play/Pause overlay */}
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

      {/* Mute/Unmute */}
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