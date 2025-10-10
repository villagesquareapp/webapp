"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import {
  FaVolumeUp,
  FaVolumeMute,
  FaPlay,
  FaPause,
  FaFlag,
  FaSignOutAlt,
  FaHeart,
} from "react-icons/fa";
import { BiSolidGift } from "react-icons/bi";
import { VSChatAsk } from "components/icons/village-square";
import LiveFeaturedPreviewCard from "./LiveFeaturedPreviewCard";
import SponsorCard from "../Reusable/SponsorCard";
import { toast } from "sonner";
import { CgEye } from "react-icons/cg";
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor";

interface LivestreamViewerProps {
  streamData: any;
  featuredLivestreams: IFeaturedLivestream[];
  currentUserId?: string;
}

const LivestreamViewer = ({
  streamData,
  featuredLivestreams,
  currentUserId,
}: LivestreamViewerProps) => {
  const router = useRouter();
  const websocketRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const webRTCAdaptorRef = useRef<WebRTCAdaptor | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(streamData?.users || 0);
  const [streamDuration, setStreamDuration] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [streamEnded, setStreamEnded] = useState(false);
  const [isStreamPaused, setIsStreamPaused] = useState(false);
  const [comments, setComments] = useState<
    Array<{
      id: number;
      user: { name: string; avatar: string };
      message: string;
      timestamp: number;
    }>
  >([]);

  const hlsUrl = streamData?.livestream_room_stream_url;

  /* Initialize chat WebSocket */
  const initializeChatWebSocket = () => {
    try {
      const streamUuid = streamData?.uuid;
      const wsUrl = `wss://origin-streaming-server.villagesquare.io/Livestream/websocket?stream=${streamUuid}`;
      console.log("Viewer connecting to chat:", wsUrl);

      websocketRef.current = new WebSocket(wsUrl);

      websocketRef.current.onopen = () => {
        console.log("✅ Viewer chat connected");

        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          websocketRef.current.send(
            JSON.stringify({
              type: "viewer_joined",
              stream_id: streamUuid,
              user_id: currentUserId || "viewer_" + Date.now(),
              role: "viewer",
            })
          );
        }
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received chat message:", data);
          switch (data.type) {
            case "comment":
            case "message":
              setComments((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  user: {
                    name: data.user?.name || data.username || "Anonymous",
                    avatar: data.user?.avatar || "/images/vs-logo.webp",
                  },
                  message: data.message || data.text,
                  timestamp: Date.now(),
                },
              ]);
              break;
            case "viewer_count":
            case "viewers":
              setViewerCount(data.count || data.viewers || 0);
              break;
            case "stream_paused":
              console.log("Stream paused by host");
              setIsStreamPaused(true);
              toast.info("Host paused the stream");
              // Pause ReactPlayer
              setIsPaused(true);
              break;

            case "stream_resumed":
              console.log("Stream resumed by host");
              setIsStreamPaused(false);
              toast.success("Stream resumed!");
              // Resume ReactPlayer
              setIsPaused(false);
              break;
            case "stream_duration":
              setStreamDuration(data.duration || 0);
              break;
            case "stream_ended":
              setStreamEnded(true);
              toast.info("Stream has ended");
              if (webRTCAdaptorRef.current) {
                webRTCAdaptorRef.current.stop(streamData?.stream_id);
                webRTCAdaptorRef.current.closeStream();
              }
              router.push("/dashboard/live-streams");
              break;
          }
        } catch (error) {
          console.error("Error parsing chat message:", error);
        }
      };
    } catch (error) {
      console.error("Failed to connect chat:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    initializeChatWebSocket();
  }, []);

  const toggleMute = () => setIsMuted((prev) => !prev);
  const togglePlay = () => setIsPaused((prev) => !prev);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && websocketRef.current) {
      const message = {
        type: "comment",
        stream_id: streamData?.uuid || streamData?.id,
        user_id: currentUserId || "anonymous",
        message: newComment,
        timestamp: Date.now(),
      };
      websocketRef.current.send(JSON.stringify(message));
      setComments((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: { name: "You", avatar: "/images/default-avatar.webp" },
          message: newComment,
          timestamp: Date.now(),
        },
      ]);
      setNewComment("");
    }
  };

  const handleLeaveStream = () => {
    websocketRef.current?.send(
      JSON.stringify({
        type: "leave",
        stream_id: streamData?.uuid || streamData?.id,
      })
    );
    router.push("/dashboard/live-streams");
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0
      ? `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h`;
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">
          {streamData?.title || "Live Discussion"}
        </p>
        <div className="flex items-center gap-x-2">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Live
          </span>
          <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm flex items-center gap-x-1">
            <CgEye /> {viewerCount.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-x-4">
        <div className="col-span-6 gap-y-4 flex flex-col">
          <div className="w-full h-[66dvh] relative rounded-xl overflow-hidden bg-black">
            {streamError && (
              <div className="absolute inset-0 z-20 bg-red-900/80 flex flex-col justify-center items-center text-white gap-y-2">
                <p className="font-semibold text-lg">
                  Cannot connect to stream
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-white text-black"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Stream Paused Overlay */}
            {isStreamPaused && (
              <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center text-white flex-col gap-y-3">
                <div className="animate-pulse">⏸️</div>
                <p className="text-xl font-semibold">Stream Paused</p>
                <p className="text-sm text-gray-300">
                  Host will be back shortly
                </p>
              </div>
            )}

            {/* ReactPlayer */}
            <ReactPlayer
              ref={playerRef}
              url={hlsUrl}
              playing={!isPaused}
              muted={isMuted}
              controls={false}
              onReady={() => {
                toast.success("Connected to stream!");
                setIsConnecting(false);
              }}
              onError={(err) => {
                console.error("Stream playback error:", err);
                setStreamError("Failed to play stream. Host may not be live.");
                setIsConnecting(false);
              }}
              width="100%"
              height="100%"
              config={{
                file: {
                  forceHLS: true,
                  hlsOptions: {
                    enableWorker: true,
                    lowLatencyMode: true,
                  },
                },
              }}
              onProgress={(state) => {
                setStreamDuration(Math.floor(state.playedSeconds));
              }}
              onBuffer={() => setIsConnecting(true)}
              onBufferEnd={() => setIsConnecting(false)}
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <Button
                    onClick={togglePlay}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isPaused ? <FaPlay /> : <FaPause />}
                  </Button>
                  <Button
                    onClick={toggleMute}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </Button>
                  <span className="text-white text-sm">
                    {formatDuration(streamDuration)}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 px-3 py-1"
                  >
                    <FaFlag className="mr-1" /> Report
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 px-3 py-1"
                    onClick={handleLeaveStream}
                  >
                    <FaSignOutAlt className="mr-1" /> Leave
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-3 px-1">
            <CustomAvatar
              src={
                streamData?.host?.profile_picture ||
                "/images/default-avatar.webp"
              }
              className="border-2 size-[52px]"
              name={streamData?.host?.name || "Host"}
            />
            <div className="flex flex-col">
              <span className="flex items-center gap-x-2">
                <p className="font-semibold">
                  {streamData?.host?.name || "Host Name"}
                </p>
                {streamData?.host?.checkmark_verification_status && (
                  <HiMiniCheckBadge className="size-5 text-green-600" />
                )}
              </span>
              <p className="text-muted-foreground text-sm">
                @{streamData?.host?.username || "username"}
              </p>
            </div>
          </div>

          <div className="flex flex-col mt-4 gap-y-4">
            <p className="font-semibold">Featured Lives</p>
            <div className="grid lg:grid-cols-4 gap-4">
              {featuredLivestreams?.slice(0, 4).map((stream) => (
                <LiveFeaturedPreviewCard
                  key={stream.uuid}
                  featuredLivestreamData={stream}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex flex-col col-span-2 w-full gap-y-4">
          <div className="flex flex-col rounded-xl border w-full h-[66dvh] relative">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>No comments yet</p>
                  <p className="text-sm">Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-x-2">
                    <CustomAvatar
                      src={comment.user.avatar}
                      className="size-8 shrink-0"
                      name={comment.user.name}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-x-2 mb-1">
                        <p className="font-semibold text-sm truncate">
                          {comment.user.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm break-words">{comment.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t">
              <form onSubmit={handleCommentSubmit} className="flex gap-x-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add comment..."
                  className="flex-1"
                />
                <div className="flex gap-x-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="p-2"
                  >
                    <VSChatAsk className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="p-2"
                  >
                    <BiSolidGift className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="p-2"
                  >
                    <FaHeart className="size-4 text-red-500" />
                  </Button>
                </div>
              </form>
            </div>

            <div className="absolute bottom-16 w-full p-4 pointer-events-none">
              <div className="pointer-events-auto">
                <SponsorCard sponsorType="liveStream" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {streamEnded && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Stream Ended</h3>
            <p className="text-muted-foreground mb-6">
              The host has ended this live stream. Thank you for watching!
            </p>
            <Button
              onClick={() => router.push("/dashboard/live-streams")}
              className="w-full"
            >
              Back to Live Streams
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestreamViewer;
