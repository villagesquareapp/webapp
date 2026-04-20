"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
  CirclePause,
  CirclePlay,
  VolumeX,
  Volume2,
  MoreVertical,
  Bookmark,
  CircleSlash,
  Info,
  Ban,
  MessageCircleOff,
  Trash2,
  Loader2,
  ChevronDown,
} from "lucide-react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { HiMiniCheckBadge } from "react-icons/hi2";
import VflixText from "./VflixText";
import VflixActionButtons from "./VflixActionButtons";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { FaEllipsisH } from "react-icons/fa";
import ShareModal from "../Reusable/ShareModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function FollowButton({
  userId,
  isFollowed,
  isFollowedBy,
  postId,
  setVideos,
}: {
  userId: string;
  isFollowed: boolean;
  isFollowedBy?: boolean;
  postId: string;
  setVideos: React.Dispatch<React.SetStateAction<IVflix[]>>;
}) {
  const [following, setFollowing] = useState(isFollowed);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFollowing(isFollowed);
  }, [isFollowed]);

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    const wasFollowing = following;
    setFollowing(!wasFollowing);
    setLoading(true);

    try {
      const endpoint = wasFollowing
        ? `/api/users/${userId}/follow`
        : `/api/users/${userId}/follow`;
      const res = await fetch(endpoint, { method: "POST" });
      const result = await res.json();

      if (!result?.status) {
        setFollowing(wasFollowing);
        toast.error(result?.message || "Action failed");
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v.user.uuid === userId ? { ...v, is_followed: !wasFollowing } : v,
          ),
        );
      }
    } catch {
      setFollowing(wasFollowing);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const label = following
    ? "Following"
    : isFollowedBy
      ? "Follow Back"
      : "Follow";

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`ml-1 px-4 py-1 rounded-full text-[13px] font-semibold transition-all ${following
        ? "bg-transparent border-[1px] border-white/20 text-white/80 hover:bg-white/10"
        : "bg-transparent border-[1px] border-[#0D52D2] text-white hover:bg-[#0D52D2]/20"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {label}
    </button>
  );
}

interface Props {
  post: IVflix;
  user: IUser;
  setVideos: React.Dispatch<React.SetStateAction<IVflix[]>>;
  likeUnlikeVflix: (postId: string, source?: string) => void;
  onCommentClick: () => void;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  onNext?: () => void;
}

export default function VflixCard({
  post,
  user,
  setVideos,
  likeUnlikeVflix,
  onCommentClick,
  isMuted,
  setIsMuted,
  onNext,
}: Props) {
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const playCountRef = useRef<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showPlayIcon, setShowPlayIcon] = useState<boolean>(false);
  const [showPauseIcon, setShowPauseIcon] = useState<boolean>(false);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideIconTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTogglingComments, setIsTogglingComments] = useState(false);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    // Trigger Icon animations
    if (nextState) {
      setShowPlayIcon(true);
      if (hideIconTimeoutRef.current) clearTimeout(hideIconTimeoutRef.current);
      hideIconTimeoutRef.current = setTimeout(
        () => setShowPlayIcon(false),
        800,
      );
    } else {
      setShowPauseIcon(true);
      if (hideIconTimeoutRef.current) clearTimeout(hideIconTimeoutRef.current);
      hideIconTimeoutRef.current = setTimeout(
        () => setShowPauseIcon(false),
        800,
      );
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) setVolume(1);
    } else {
      setIsMuted(true);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add save logic here
    console.log("Save post:", post.uuid);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add report logic here
    console.log("Report post:", post.uuid);
  };

  const handleNotInterested = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add not interested logic here
    console.log("Not interested in post:", post.uuid);
  };

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add block logic here
    console.log("Block user:", post.user.uuid);
  };

  const handleToggleComments = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTogglingComments) return;

    setIsTogglingComments(true);
    try {
      const res = await fetch(`/api/vflix/${post.uuid}/toggle-comments`, {
        method: "POST",
      });
      const result = await res.json();

      if (result?.status) {
        toast.success(result.message);
        setVideos((prev) =>
          prev.map((v) =>
            v.uuid === post.uuid
              ? { ...v, allow_comments: result.data.allow_comments }
              : v,
          ),
        );
      } else {
        toast.error(result?.message || "Failed to toggle comments");
      }
    } catch (error) {
      console.error("Toggle comments error:", error);
      toast.error("An error occurred while toggling comments");
    } finally {
      setIsTogglingComments(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add delete logic here
    console.log("Delete post:", post.uuid);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(1, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleReady = () => {
    setIsBuffering(false);
  };

  const handleBuffer = () => {
    setIsBuffering(true);
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
  };

  const handleEnded = () => {
    playCountRef.current += 1;
    if (playCountRef.current < 3) {
      // Replay — seek back to start and keep playing
      playerRef.current?.seekTo(0);
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      // 3 plays done — show the modal
      setIsPlaying(false);
      setHasEnded(true);
    }
  };

  // Reset play count and ended state when video changes
  useEffect(() => {
    setHasEnded(false);
    setIsPlaying(true);
    setCurrentTime(0);
    playCountRef.current = 0;
  }, [post.uuid]);

  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Show controls when paused
    if (!isPlaying) {
      setShowControls(true);
    }
  }, [isPlaying]);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isVolumeDraggingRef = useRef(false);
  const [clickedMediaIndex, setClickedMediaIndex] = useState<number>(0);

  const seekToFraction = (fraction: number) => {
    const clamped = Math.max(0, Math.min(1, fraction));
    if (playerRef.current && duration) {
      playerRef.current.seekTo(clamped * duration, "seconds");
      setCurrentTime(clamped * duration);
    }
  };

  const getFractionFromEvent = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
  ) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    return (clientX - rect.left) / rect.width;
  };

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    seekToFraction(getFractionFromEvent(e));

    const onMouseMove = (ev: MouseEvent) => {
      if (isDraggingRef.current) seekToFraction(getFractionFromEvent(ev));
    };
    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleProgressTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    seekToFraction(getFractionFromEvent(e));

    const onTouchMove = (ev: TouchEvent) => {
      if (isDraggingRef.current) seekToFraction(getFractionFromEvent(ev));
    };
    const onTouchEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  };

  const getVolumeFraction = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!volumeBarRef.current) return 0;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handleVolumeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isVolumeDraggingRef.current = true;
    const frac = getVolumeFraction(e);
    setVolume(frac);
    if (frac > 0 && isMuted) setIsMuted(false);

    const onMouseMove = (ev: MouseEvent) => {
      if (isVolumeDraggingRef.current) {
        const f = getVolumeFraction(ev);
        setVolume(f);
        if (f > 0 && isMuted) setIsMuted(false);
      }
    };
    const onMouseUp = () => {
      isVolumeDraggingRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleVolumeTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    isVolumeDraggingRef.current = true;
    const frac = getVolumeFraction(e);
    setVolume(frac);
    if (frac > 0 && isMuted) setIsMuted(false);

    const onTouchMove = (ev: TouchEvent) => {
      if (isVolumeDraggingRef.current) {
        const f = getVolumeFraction(ev);
        setVolume(f);
        if (f > 0 && isMuted) setIsMuted(false);
      }
    };
    const onTouchEnd = () => {
      isVolumeDraggingRef.current = false;
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  };

  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  const handlePostClickWithVideoPause = (
    e: React.MouseEvent,
    mediaIndex?: number,
  ) => {
    e.stopPropagation();

    if (isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
        setClickedMediaIndex(mediaIndex ?? 0);
      }, 150);
    } else {
      setClickedMediaIndex(mediaIndex ?? 0);
    }
  };

  const mediaItem = Array.isArray(post?.media) ? post?.media[0] : post?.media;
  const videoUrl =
    mediaItem?.is_transcode_complete && mediaItem?.transcoded_media_url
      ? mediaItem.transcoded_media_url
      : mediaItem?.media_url;

  return (
    <>
      <div
        className="relative w-full h-full bg-black rounded-3xl overflow-hidden border border-gray-300 dark:border-border bg-transparent"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {" "}
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={isPlaying}
          muted={isMuted || volume === 0}
          volume={volume}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onEnded={handleEnded}
          progressInterval={50}
          style={{ position: "absolute", top: 0, left: 0 }}
          config={{
            file: {
              forceHLS: videoUrl?.includes(".m3u8"),
              attributes: {
                poster: mediaItem?.thumbnail || mediaItem?.media_thumbnail,
                playsInline: true,
                style: { objectFit: "cover", width: "100%", height: "100%" },
              },
              hlsOptions: {
                debug: false,
                // xhrSetup: function(xhr: XMLHttpRequest, url: string) {
                //   // You can add custom headers here if needed
                // }
              },
            },
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none z-10" />

        {/* Top left Volume Pill */}
        <div className="absolute top-4 left-4 z-40 flex items-center bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full p-2 pointer-events-auto shadow-sm group transition-all duration-300">
          <button
            onClick={toggleMute}
            className="transition-transform text-white/90 shrink-0"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-[18px] h-[18px]" />
            ) : (
              <Volume2 className="w-[18px] h-[18px]" />
            )}
          </button>

          <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center">
            <div
              ref={volumeBarRef}
              className="w-full pl-3 pr-1 py-2 cursor-pointer relative flex items-center"
              onMouseDown={handleVolumeMouseDown}
              onTouchStart={handleVolumeTouchStart}
            >
              <div className="w-20 h-1 bg-white/30 rounded-full relative">
                {/* Filled Volume */}
                <div
                  className="h-full bg-white rounded-full relative"
                  style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                >
                  {/* thumb */}
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-40 flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 w-10 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <FaEllipsisH className="size-5 text-white" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-1 px-[0.7rem] pt-2 pb-2 w-[240px] bg-background/95 backdrop-blur-xl border border-white/10 rounded-[22px] shadow-2xl z-[60] pointer-events-auto"
              side="bottom"
              align="end"
              sideOffset={12}
            >
              {post.user.uuid === user?.uuid ? (
                /* Own video menu */
                <div className="flex flex-col gap-0.5">
                  <div
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${isTogglingComments ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/5"}`}
                    onClick={handleToggleComments}
                  >
                    {isTogglingComments ? (
                      <Loader2 className="size-5 text-foreground/80 animate-spin" />
                    ) : (
                      <MessageCircleOff className="size-5 text-foreground/80 group-hover:text-foreground" />
                    )}
                    <span className="text-[15px] font-medium text-foreground/80 group-hover:text-foreground">
                      {isTogglingComments ? (post.allow_comments === false ? "Enabling..." : "Disabling...") : (post.allow_comments === false ? "Enable comment" : "Disable comment")}
                    </span>
                  </div>

                  <Separator className="bg-border/50 mx-2" />

                  <div
                    className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-red-500/10 rounded-2xl transition-all group"
                    onClick={handleDelete}
                  >
                    <Ban className="size-5 text-red-500 group-hover:text-red-400" />
                    <span className="text-[15px] font-medium text-red-500 group-hover:text-red-400">Delete</span>
                  </div>
                </div>
              ) : (
                /* Other user's video menu */
                <div className="flex flex-col gap-0.5">
                  <div
                    className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-white/5 rounded-2xl transition-all group"
                    onClick={handleSave}
                  >
                    <Bookmark className="size-5 text-foreground/80 group-hover:text-foreground" />
                    <span className="text-[15px] font-medium text-foreground/80 group-hover:text-foreground">Save</span>
                  </div>

                  <div
                    className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-white/5 rounded-2xl transition-all group"
                    onClick={handleNotInterested}
                  >
                    <CircleSlash className="size-5 text-foreground/80 group-hover:text-foreground" />
                    <span className="text-[15px] font-medium text-foreground/80 group-hover:text-foreground">Not interested</span>
                  </div>

                  <div
                    className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-white/5 rounded-2xl transition-all group"
                    onClick={handleReport}
                  >
                    <Info className="size-5 text-foreground/80 group-hover:text-foreground" />
                    <span className="text-[15px] font-medium text-foreground/80 group-hover:text-foreground">Report</span>
                  </div>

                  <div
                    className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-red-500/10 rounded-2xl transition-all group"
                    onClick={handleBlock}
                  >
                    <Ban className="size-5 text-red-500 group-hover:text-red-400" />
                    <span className="text-[15px] font-medium text-red-500 group-hover:text-red-400">Block</span>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        {/* Buffering Loader overlay */}
        <AnimatePresence>
          {isBuffering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/90 rounded-full animate-spin glow-shadow" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video ended overlay */}
        <AnimatePresence>
          {hasEnded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-4">
                {onNext && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext();
                    }}
                    className="flex items-center gap-2 bg-white text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors shadow-lg"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Play Next Video
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setHasEnded(false);
                    setCurrentTime(0);
                    playerRef.current?.seekTo(0);
                    playCountRef.current = 0;
                    setIsPlaying(true);
                  }}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-medium text-sm px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
                >
                  <CirclePlay className="w-4 h-4" />
                  Watch Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Transient Play/Pause icon overlay */}
        <AnimatePresence>
          {showPlayIcon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <CirclePlay className="w-8 h-8 text-white/90 drop-shadow-xl" />
            </motion.div>
          )}
          {showPauseIcon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <CirclePause className="w-8 h-8 text-white/90 drop-shadow-xl" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Clickable area for play/pause - only covers the video, not the bottom controls */}
        <button
          onClick={togglePlay}
          className="absolute inset-x-0 top-0 bottom-[160px] z-10"
        />
        {/* Bottom info */}
        <div className="absolute bottom-3 left-4 right-4 text-white z-30 pointer-events-auto">
          {/* User row */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <CustomAvatar
              src={post?.user?.profile_picture || ""}
              name={post?.user?.name || ""}
              className="size-10 border-foreground border-[1.5px]"
            />
            <span className="flex flex-row gap-x-2 items-center max-w-60">
              <span className="font-semibold text-sm truncate">
                {post?.user.name}
              </span>
              {!!post?.user?.verified_status && (
                <HiMiniCheckBadge className="size-5 text-green-600" />
              )}
            </span>
            {post?.user.uuid !== user?.uuid && (
              <FollowButton
                userId={post.user.uuid}
                isFollowed={post.is_followed}
                isFollowedBy={post.is_followed_by}
                postId={post.uuid}
                setVideos={setVideos}
              />
            )}
          </div>

          {/* Caption */}
          <div
            onClick={(e) => handlePostClickWithVideoPause(e)}
            className="cursor-pointer pointer-events-auto"
          >
            {post?.caption && <VflixText text={post.caption} />}
          </div>

          {/* Date */}
          {post?.created_at && (
            <p className="text-[10px] py-1 text-gray-300">
              {post.formatted_date}
            </p>
          )}

          {/* Actions row */}
          <div className="pointer-events-auto pb-3">
            <VflixActionButtons
              setVideos={setVideos}
              likeUnlikeVflix={(postId) =>
                likeUnlikeVflix(postId, post._source)
              }
              post={post}
              onCommentClick={onCommentClick}
              onShareClick={() => setIsShareOpen(true)}
            />
          </div>
        </div>
        {/* BOTTOM Scrubber (Full Width) */}
        <div className="absolute bottom-2 left-0 right-0 h-0.5 group/scrub z-40 pointer-events-auto transition-all hover:h-1">
          <div
            ref={progressBarRef}
            className="w-full h-full flex items-end cursor-pointer relative"
            onMouseDown={handleProgressMouseDown}
            onTouchStart={handleProgressTouchStart}
          >
            {/* Grab hit area */}
            <div className="absolute -top-3 bottom-0 left-0 right-0" />
            <div className="w-full h-full bg-white/20 relative">
              {/* Filled track */}
              <div
                className="h-full bg-white relative"
                style={{
                  width: duration
                    ? `${(currentTime / duration) * 100}%`
                    : "0%",
                }}
              >
                {/* Thumb dot (shows on hover) */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        postId={post.uuid}
      />
    </>
  );
}

// postId/comments/uuid/like
