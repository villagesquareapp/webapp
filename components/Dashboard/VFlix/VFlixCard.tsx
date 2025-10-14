"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  Gift,
  Share2,
  VolumeX,
  Volume2,
  CirclePause,
  CirclePlay,
} from "lucide-react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { HiMiniCheckBadge } from "react-icons/hi2";
import PostText from "../Social/PostText";
import VflixText from "./VflixText";
import { PiHeartFill } from "react-icons/pi";
import VflixActionButtons from "./VflixActionButtons";
import LoadingSpinner from "../Reusable/LoadingSpinner";

interface Props {
  post: IVflix;
  user: IUser;
  setVideos: React.Dispatch<React.SetStateAction<IVflix[]>>;
  likeUnlikeVflix: (postId: string) => void;
  onCommentClick: () => void;
}

export default function VflixCard({
  post,
  user,
  setVideos,
  likeUnlikeVflix,
  onCommentClick,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch((error) => {
        // Handle potential play() promise rejection (e.g., due to user interaction)
        console.error("Video playback failed:", error);
      });
    } else {
      videoRef.current.pause();
    }
  };

  // This function now only controls the video, not the state
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  };

  // Format time as mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(1, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setMuted(video.muted);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.play().catch((error) => {
        console.log("Autoplay was prevented:", error);
      });
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.pause();
    };
  }, []);

  // const toggleMute = () => {
  //   if (!videoRef.current) return;
  //   videoRef.current.muted = !muted; // update actual video element
  //   setMuted(!muted); // update state for UI
  // };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setMuted(video.muted);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    video.play().catch((error) => {
      // Autoplay may be blocked by the browser. The user can manually play.
      console.log("Autoplay was prevented:", error);
      setIsPlaying(false);
    });

    // Clean up event listeners on unmount
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.pause(); // Pause the video when the component is removed
    };
  }, []);

  const [clickedMediaIndex, setClickedMediaIndex] = useState<number>(0);

  const handlePostClickWithVideoPause = (
    e: React.MouseEvent,
    mediaIndex?: number
  ) => {
    e.stopPropagation();

    // If a video is playing, pause it before opening the details
    if (isPlaying) {
      // Small delay to ensure we don't create race conditions
      setTimeout(() => {
        setIsPlaying(false);
        // setCurrentVideoPlaying("");
        // Open details after ensuring video is paused
        setClickedMediaIndex(mediaIndex ?? 0);
      }, 150);
    } else {
      // No video playing, just open details immediately
      setClickedMediaIndex(mediaIndex ?? 0);
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      {/* Video @Note: still gonna change it to ReactPlayer, to support HLS (transcoded media) */}
      <video
        ref={videoRef}
        src={post.media.media_url}
        poster={post.media.media_thumbnail}
        className="w-full h-full object-contain"
        loop
        autoPlay
        playsInline
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <LoadingSpinner />
        </div>
      )}
      {/* Controls */}

      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center"
      >
        {isPlaying ? (
          <CirclePause className="w-8 h-8 text-white/80" />
        ) : (
          <CirclePlay className="w-8 h-8 text-white/80" />
        )}
        {/* {!isPlaying && <CirclePlay className="w-8 h-8 text-white/80" />} */}
      </button>

      {/* Bottom info */}

      <div className="absolute bottom-4 left-4 right-4 text-white">
        {/* User row */}
        <div className="flex items-center gap-2">
          <CustomAvatar
            src={post?.user?.profile_picture || ""}
            name={post?.user?.name || ""}
            className="size-10 border-foreground border-[1.5px]"
          />
          <span className="flex flex-row gap-x-2 items-center max-w-60">
            <span className="font-semibold text-sm truncate">
              {post?.user.username}
            </span>
            {!!post?.user?.verified_status && (
              <HiMiniCheckBadge className="size-5 text-green-600" />
            )}
          </span>{" "}
          {/* Only show Follow button if not the owner */}
          {post?.user.uuid !== user?.uuid && (
            <button className="ml-2 px-3 py-1 rounded bg-[#0D1E34] text-xs font-medium">
              Follow
            </button>
          )}
        </div>

        {/* Date */}
        {post?.created_at && (
          <p className="text-[10px] py-1 text-gray-300 mt-1">
            {/* {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })} */}
            {post.formatted_date}
          </p>
        )}

        {/* Caption */}
        <div
          onClick={(e) => handlePostClickWithVideoPause(e)}
          className="cursor-pointer"
        >
          {post?.caption && <VflixText text={post.caption} />}
        </div>

        {/* Actions row */}

        <VflixActionButtons
          setVideos={setVideos}
          likeUnlikeVflix={likeUnlikeVflix}
          post={post}
          onCommentClick={onCommentClick}
        />

        {/* Progress + volume + timer */}
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{
                width: duration ? `${(currentTime / duration) * 100}%` : "0%",
              }}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <button onClick={toggleMute}>
              {muted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <span className="mb-4">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
