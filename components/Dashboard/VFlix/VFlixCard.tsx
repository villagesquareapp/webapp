"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
  CirclePause,
  CirclePlay,
  VolumeX,
  Volume2,
  MoreVertical,
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

function FollowButton({
  userId,
  isFollowed,
  postId,
  setVideos,
}: {
  userId: string;
  isFollowed: boolean;
  postId: string;
  setVideos: React.Dispatch<React.SetStateAction<IVflix[]>>;
}) {
  const [following, setFollowing] = useState(isFollowed);
  const [loading, setLoading] = useState(false);

  // Sync with prop changes (e.g. when navigating between videos)
  useEffect(() => {
    setFollowing(isFollowed);
  }, [isFollowed]);

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    const newFollowing = !following;
    // Optimistic update
    setFollowing(newFollowing);
    setLoading(true);

    try {
      const endpoint = newFollowing
        ? `/api/users/${userId}/follow`
        : `/api/users/${userId}/unfollow`;
      const res = await fetch(endpoint, { method: "POST" });
      const result = await res.json();

      if (!result?.status) {
        // Revert on failure
        setFollowing(!newFollowing);
        toast.error(result?.message || "Action failed");
      } else {
        // Update the parent videos state so follow status persists
        setVideos((prev) =>
          prev.map((v) =>
            v.user.uuid === userId ? { ...v, is_followed: newFollowing } : v,
          ),
        );
      }
    } catch (error) {
      // Revert on error
      setFollowing(!newFollowing);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`ml-2 px-3 py-1 rounded text-xs font-medium transition-colors ${following
        ? "bg-white/10 text-white/80 hover:bg-white/20"
        : "bg-[#0D1E34] hover:bg-[#0D1E34]/80"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {following ? "Following" : "Follow"}
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
}

export default function VflixCard({
  post,
  user,
  setVideos,
  likeUnlikeVflix,
  onCommentClick,
  isMuted,
  setIsMuted,
}: Props) {
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
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

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add block logic here
    console.log("Block user:", post.user.uuid);
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
  const isDraggingRef = useRef(false);
  const [clickedMediaIndex, setClickedMediaIndex] = useState<number>(0);

  const seekToFraction = (fraction: number) => {
    const clamped = Math.max(0, Math.min(1, fraction));
    if (playerRef.current && duration) {
      playerRef.current.seekTo(clamped * duration, "seconds");
      setCurrentTime(clamped * duration);
    }
  };

  const getFractionFromEvent = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
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
        className="relative w-full h-full bg-black rounded-xl overflow-hidden border border-gray-300 dark:border-border bg-transparent"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {" "}
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={isPlaying}
          muted={isMuted}
          loop
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-4 right-4 z-30">
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
              className="p-0 w-[200px]"
              side="bottom"
              align="end"
              sideOffset={8}
            >
              <div
                className="p-4 cursor-pointer hover:bg-accent text-center text-sm font-medium"
                onClick={handleSave}
              >
                Save
              </div>
              <Separator className="bg-gray-700" />
              <div
                className="p-4 cursor-pointer hover:bg-accent text-center text-sm font-medium"
                onClick={handleReport}
              >
                Report
              </div>
              <Separator className="bg-gray-700" />
              <div
                className="p-4 cursor-pointer hover:bg-accent text-center text-sm font-medium"
                onClick={handleBlock}
              >
                Block
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <LoadingSpinner />
          </div>
        )}
        {/* Clickable area for play/pause - only covers the video, not the bottom controls */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 bottom-[120px] flex items-center justify-center z-10 transition-opacity duration-200"
        >
          {(showControls || !isPlaying) && !isBuffering && (
            <>
              {isPlaying ? (
                <CirclePause className="w-8 h-8 text-white/80 drop-shadow-lg" />
              ) : (
                <CirclePlay className="w-8 h-8 text-white/80 drop-shadow-lg" />
              )}
            </>
          )}
        </button>
        {/* Bottom info */}
        <div className="absolute bottom-10 left-4 right-4 text-white z-30 pointer-events-auto">
          {/* User row */}
          <div className="flex items-center gap-2 pointer-events-auto">
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
            </span>
            {post?.user.uuid !== user?.uuid && (
              <FollowButton
                userId={post.user.uuid}
                isFollowed={post.is_followed}
                postId={post.uuid}
                setVideos={setVideos}
              />
            )}
          </div>

          {/* Caption */}
          <div
            onClick={(e) => handlePostClickWithVideoPause(e)}
            className="cursor-pointer pointer-events-auto mt-1"
          >
            {post?.caption && <VflixText text={post.caption} />}
          </div>

          {/* Date */}
          {post?.created_at && (
            <p className="text-[10px] py-1 text-gray-300 mt-1">
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
        {/* Progress + volume + timer */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 pt-6 z-40 pointer-events-auto bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-4 text-xs text-gray-300 pointer-events-auto">
            {/* Scrubber */}
            <div
              ref={progressBarRef}
              className="flex-1 h-4 flex items-center cursor-pointer group relative"
              onMouseDown={handleProgressMouseDown}
              onTouchStart={handleProgressTouchStart}
            >
              {/* Track background */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                <div className="w-full h-1 bg-gray-600/80 rounded-full relative">
                  {/* Filled track */}
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
                  {/* Thumb dot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-transform duration-150 ease-out group-hover:scale-125"
                    style={{ left: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-medium text-white/90">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button
                onClick={toggleMute}
                className="hover:scale-110 transition-transform pointer-events-auto text-white"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
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
