import { Button } from "components/ui/button";
import { useEffect, useState, useRef } from "react";
import { CgEyeAlt } from "react-icons/cg";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdVolumeHigh, IoMdVolumeLow, IoMdVolumeOff, IoMdVolumeMute } from "react-icons/io";
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
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showControls, setShowControls] = useState(false);

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
        threshold: 0.5, // 50% of the video must be visible
        rootMargin: "50px 0px", // Add some margin to pre-load/pause
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
  }, [media.uuid, isPlaying]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const pad = (string: number) => {
    return ("0" + string).slice(-2);
  };

  // Handle play state
  const handlePlay = () => {
    if (!isVisible) return;

    setIsPlaying(true);
    setIsPlayingVideo(true);
    setCurrentVideoPlaying(media.uuid);
  };

  // Handle pause state
  const handlePause = () => {
    setIsPlaying(false);
    setIsPlayingVideo(false);
    setCurrentVideoPlaying("");
  };

  // Handle user click to play/pause
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isVisible) return;

    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  // Handle seeking
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value));
    }
  };

  // Get volume icon based on volume level
  const getVolumeIcon = () => {
    if (volume === 0) return <IoMdVolumeMute className="size-5" />;
    if (volume < 0.3) return <IoMdVolumeOff className="size-5" />;
    if (volume < 0.7) return <IoMdVolumeLow className="size-5" />;
    return <IoMdVolumeHigh className="size-5" />;
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setPrevVolume(newVolume);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  };

  // When currentVideoPlaying changes, pause this video if it's not the current one
  useEffect(() => {
    if (currentVideoPlaying !== media.uuid && isPlaying) {
      handlePause();
    }
  }, [currentVideoPlaying, media.uuid]);

  return (
    <div
      ref={videoRef}
      className={`w-full relative rounded-xl overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowVolumeSlider(false);
      }}
      onClick={handleVideoClick}
    >
      {/* Play/Pause overlay */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${
          isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
        }`}
      >
        {isPlaying ? (
          <FaPause className="text-white text-4xl opacity-80" />
        ) : (
          <FaPlay className="text-white text-4xl opacity-80" />
        )}
      </div>

      {/* Interactive controls (progress bar) */}
      <div
        className={`absolute bottom-12 left-0 right-0 px-4 transition-opacity duration-200 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="range"
          min={0}
          max={0.999999}
          step="any"
          value={played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
          className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-gray-400/50"
        />
      </div>

      {/* Always visible controls */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-4">
            {/* Volume control with hover effect */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="text-white hover:text-white/80 transition p-1"
              >
                {getVolumeIcon()}
              </button>
              <div
                className={`absolute left-8 bottom-1 transition-all duration-200 ${
                  showVolumeSlider ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-16 h-1 rounded-lg appearance-none cursor-pointer bg-gray-400/50"
                />
              </div>
            </div>
            {/* Time display */}
            <div onClick={(e) => e.stopPropagation()}>
              {formatTime(duration * played)} / {formatTime(duration)}
            </div>
          </div>
        </div>
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
        ref={playerRef}
        url={media.transcoded_media_url || src}
        playing={isPlaying}
        volume={volume}
        controls={false}
        width="100%"
        height="100%"
        playsinline
        light={false}
        pip={false}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
        onProgress={(state) => {
          if (!seeking) {
            setPlayed(state.played);
          }
        }}
        onDuration={setDuration}
        onError={(e) => {
          console.error("Video error:", e);
          // Only pause for real errors, not interruptions
          if (e && e.name !== "AbortError") {
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
              liveDurationInfinity: true,
              liveBackBufferLength: 0,
              progressive: true,
            },
          },
        }}
      />
    </div>
  );
};

export default PostVideo;
