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

interface Props {
  post: IVflix;
  user: IUser;
  setVideos: React.Dispatch<React.SetStateAction<IVflix[]>>;
  likeUnlikeVflix: (postId: string) => void;
}

export default function VflixCard({ post, user, setVideos, likeUnlikeVflix }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
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

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted; // update actual video element
    setMuted(!muted); // update state for UI
  };

  const [clickedMediaIndex, setClickedMediaIndex] = useState(0);

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
        <div onClick={(e) => handlePostClickWithVideoPause(e)} className="cursor-pointer">
          {post?.caption && <VflixText text={post.caption} />}
        </div>

        {/* Actions row */}
        {/* <div className="flex items-center gap-8 mt-4 text-sm">
          <button className="flex items-center gap-1 hover:opacity-80">
            <PiHeartFill className="w-5 h-5" /> {post?.likes_count ?? 0}
          </button>
          <button className="flex items-center gap-1 hover:opacity-80">
            <MessageCircle className="w-5 h-5" /> {post?.comments_count ?? 0}
          </button>
          <button className="flex items-center gap-1 hover:opacity-80">
            <Share2 className="w-5 h-5" /> {post?.shares_count ?? 0}
          </button>
          <button className="flex items-center gap-1 hover:opacity-80">
            <Gift className="w-5 h-5" />
          </button>
        </div> */}

        <VflixActionButtons setVideos={setVideos} likeUnlikeVflix={likeUnlikeVflix} post={post} />

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

      {/* <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <CustomAvatar
          src={post?.user?.profile_picture || ""}
          name={post?.user?.name || ""}
          className="size-12 border-foreground border-[1.5px]"
        />
        <div className="text-white">
          {post.caption && (
            <p className="text-sm text-gray-200 line-clamp-2">{post.caption}</p>
          )}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button className="flex flex-col items-center text-white hover:scale-110">
            <Heart className="w-6 h-6" />
            <span className="text-xs">{post.likes_count ?? 0}</span>
          </button>
          <button className="flex flex-col items-center text-white hover:scale-110">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">{post.comments_count ?? 0}</span>
          </button>
        </div>
      </div> */}
    </div>
  );
}
