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
import {Separator} from "components/ui/separator";
import { FaEllipsisH } from "react-icons/fa";

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
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(true);
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
    setMuted(!muted);
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

  const [clickedMediaIndex, setClickedMediaIndex] = useState<number>(0);

  const handlePostClickWithVideoPause = (
    e: React.MouseEvent,
    mediaIndex?: number
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

  const videoUrl = post.media?.transcoded_media_url || post.media?.media_url;

  return (
    <div 
      className="relative w-full h-full bg-black rounded-xl overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={isPlaying}
        muted={muted}
        loop
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={handleDuration}
        onReady={handleReady}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
        style={{ position: 'absolute', top: 0, left: 0 }}
        config={{
          file: {
            attributes: {
              poster: post.media?.media_thumbnail,
              playsInline: true,
            },
            hlsOptions: {
              forceHLS: true,
              debug: false,
              // xhrSetup: function(xhr: XMLHttpRequest, url: string) {
              //   // You can add custom headers here if needed
              // }
            }
          }
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

      {/* Clickable area for play/pause - excludes bottom controls */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-200"
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
      <div className="absolute bottom-4 left-4 right-4 text-white z-20 pointer-events-auto">
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
            <button className="ml-2 px-3 py-1 rounded bg-[#0D1E34] text-xs font-medium hover:bg-[#0D1E34]/80">
              Follow
            </button>
          )}
        </div>

        {/* Date */}
        {post?.created_at && (
          <p className="text-[10px] py-1 text-gray-300 mt-1">
            {post.formatted_date}
          </p>
        )}

        {/* Caption */}
        <div
          onClick={(e) => handlePostClickWithVideoPause(e)}
          className="cursor-pointer pointer-events-auto"
        >
          {post?.caption && <VflixText text={post.caption} />}
        </div>

        {/* Actions row */}
        <div className="pointer-events-auto">
          <VflixActionButtons
            setVideos={setVideos}
            likeUnlikeVflix={likeUnlikeVflix}
            post={post}
            onCommentClick={onCommentClick}
          />
        </div>

        {/* Progress + volume + timer */}
        <div className="flex items-center gap-2 text-xs text-gray-300 pointer-events-auto">
          <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{
                width: duration ? `${(currentTime / duration) * 100}%` : "0%",
              }}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <button onClick={toggleMute} className="hover:scale-110 transition-transform pointer-events-auto">
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

// postId/comments/uuid/like