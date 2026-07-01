"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Button } from "components/ui/button";
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaHeart, FaUserPlus, FaPlay, FaEllipsisH } from "react-icons/fa";
import { IoPersonAdd, IoSend, IoClose } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineSettings } from "react-icons/md";
import { BiChevronUp } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { Dialog, DialogContent } from "components/ui/dialog";
import { endLivestream } from "api/livestreams";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import SponsorCard from "../Reusable/SponsorCard";
import HostControlModals from "./HostControlModals";
import { useMessageWebSocket } from "context/MessageWebSocketContext";
import { useSession } from "next-auth/react";

interface CoHost {
  uuid: string;
  name: string;
  username: string;
  avatar: string;
}

interface ChatMessage {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    isHost?: boolean;
    isVerified?: boolean;
  };
  message: string;
  time: string;
  type: "message" | "join";
}

interface HostLiveViewProps {
  streamData: any;
  user: IUser;
}

const HostLiveView = ({ streamData, user }: HostLiveViewProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: { name: streamData?.host?.name || "Host", username: streamData?.host?.username || "host", avatar: streamData?.host?.profile_picture || "", isHost: true, isVerified: true },
      message: `Hi, everyone, I'm the founder of ${streamData?.host?.username}, follow for more beauty tips`,
      time: "2m ago",
      type: "message",
    },
    {
      id: "2",
      user: { name: "vegasofvegas", username: "vegasofvegas", avatar: "", isVerified: true },
      message: "Wow! This is awesomeee",
      time: "5m ago",
      type: "message",
    },
    {
      id: "3",
      user: { name: "mira", username: "mira", avatar: "" },
      message: "Wow! This is awesomeee",
      time: "1m ago",
      type: "message",
    },
    {
      id: "4",
      user: { name: "vegasofvegas", username: "vegasofvegas", avatar: "", isVerified: true },
      message: "Wow! This is awesomeee",
      time: "5m ago",
      type: "message",
    },
    {
      id: "5",
      user: { name: "vegasofvegas", username: "vegasofvegas", avatar: "", isVerified: true },
      message: "Wow! This is awesomeee",
      time: "5m ago",
      type: "message",
    },
    {
      id: "6",
      user: { name: "mira", username: "mira", avatar: "" },
      message: "Wow! This is awesomeee",
      time: "1m ago",
      type: "message",
    },
    {
      id: "7",
      user: { name: "vegasofvegas", username: "vegasofvegas", avatar: "", isVerified: true },
      message: "Wow! This is awesomeee",
      time: "5m ago",
      type: "message",
    },
    {
      id: "8",
      user: { name: "Olaide", username: "olaide", avatar: "" },
      message: "",
      time: "",
      type: "join",
    },
  ]);
  const [comment, setComment] = useState("");
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [viewerCount, setViewerCount] = useState(streamData?.users || 0);
  const [heartCount, setHeartCount] = useState(0);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [coHosts, setCoHosts] = useState<CoHost[]>([]);
  const [modalView, setModalView] = useState<"management" | "add-cohost" | "invite-users" | "requests" | null>(null);
  const [modalShowBack, setModalShowBack] = useState(false);
  const [showEndLiveModal, setShowEndLiveModal] = useState(false);
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [selectedViewer, setSelectedViewer] = useState<any>(null);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(Date.now());
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [useFallbackVideo, setUseFallbackVideo] = useState(false);

  // A public sample video for testing when camera isn't available
  const FALLBACK_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  // Initialize camera/mic
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Could not access camera/mic, using fallback video:", err);
        setUseFallbackVideo(true);
      }
    };
    initMedia();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Toggle camera track — don't unmount the video, just disable the track
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => { t.enabled = !isCameraMuted; });
    }
  }, [isCameraMuted]);

  // Toggle mic track
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => { t.enabled = !isMicMuted; });
    }
  }, [isMicMuted]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const secs = String(diff % 60).padStart(2, "0");
      setElapsedTime(`${hrs}:${mins}:${secs}`);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Pause when both camera and mic are muted
  useEffect(() => {
    setIsPaused(isCameraMuted && isMicMuted);
  }, [isCameraMuted, isMicMuted]);

  // ─── Livestream WebSocket subscription ───
  const { sendMessage, subscribe, isConnected } = useMessageWebSocket();

  useEffect(() => {
    if (!isConnected || !streamData?.livestream_room_id) return;

    // Subscribe to the livestream room channel
    const subscribePayload = {
      action: "subscribe",
      channel: "livestream_room",
      channelId: streamData.livestream_room_id,
      userId: user.uuid,
      metadata: {
        role: "host",
        user_type: "user",
        name: user.name || "Host",
        profile_picture: user.profile_picture,
      },
    };

    console.log("[Livestream WS] Subscribing to room:", subscribePayload);
    sendMessage(subscribePayload);
  }, [isConnected, streamData?.livestream_room_id]);

  // Listen for incoming livestream events
  useEffect(() => {
    const unsubscribe = subscribe((data: any) => {
      // Only handle livestream events
      if (!data.event || !data.event.startsWith("livestream-")) return;

      console.log("[Livestream WS] Event received:", data.event, data);

      switch (data.event) {
        case "livestream-comments":
          if (data.message && data.user) {
            setMessages((prev) => [
              ...prev,
              {
                id: String(Date.now() + Math.random()),
                user: {
                  name: data.user.name,
                  username: data.user.username || data.user.name,
                  avatar: data.user.profile_picture || "",
                  isVerified: !!data.user.verified_status,
                },
                message: data.message,
                time: "now",
                type: "message",
              },
            ]);
          }
          break;

        case "livestream-likes":
          console.log("[Livestream WS] Like from:", data.user?.name);
          setHeartCount((prev) => prev + 1);
          break;

        case "livestream-views":
          console.log("[Livestream WS] Viewer count:", data.total_count);
          if (data.total_count !== undefined) {
            setViewerCount(data.total_count);
          }
          break;

        case "livestream-questions":
          console.log("[Livestream WS] New question:", data);
          break;

        case "livestream-answers":
          console.log("[Livestream WS] Answer:", data);
          break;

        case "livestream-gift-notification":
          console.log("[Livestream WS] Gift received:", data);
          break;

        default:
          console.log("[Livestream WS] Unknown event:", data.event, data);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendComment = () => {
    if (!comment.trim()) return;
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      user: { name: user.name, username: user.username, avatar: user.profile_picture || "", isHost: true, isVerified: true },
      message: comment,
      time: "now",
      type: "message",
    };
    setMessages((prev) => [...prev, newMsg]);

    // Publish comment via WebSocket
    if (isConnected && streamData?.livestream_room_id) {
      sendMessage({
        action: "publish",
        channel: "livestream_room",
        event: "livestream-comments",
        channelId: streamData.livestream_room_id,
        message: comment,
        userId: user.uuid,
        user: {
          name: user.name,
          username: user.username,
          profile_picture: user.profile_picture,
        },
      });
      console.log("[Livestream WS] Comment sent:", comment);
    }

    setComment("");
  };

  const handleResume = () => {
    setIsCameraMuted(false);
    setIsMicMuted(false);
  };

  const openModal = (view: "management" | "add-cohost" | "invite-users" | "requests", withBack: boolean = false) => {
    setModalView(view);
    setModalShowBack(withBack);
  };

  const handleEndLive = async () => {
    if (!streamData?.uuid) return;
    setIsEndingSession(true);
    try {
      const response = await endLivestream(streamData.uuid);
      if (response.status) {
        setShowEndLiveModal(false);
        window.location.href = "/livestream";
      } else {
        toast.error(response.message || "Failed to end livestream");
      }
    } catch (error) {
      console.error("Error ending livestream:", error);
      toast.error("An error occurred");
    } finally {
      setIsEndingSession(false);
    }
  };

  // Dummy viewers for the modal
  const DUMMY_VIEWERS = [
    { uuid: "1", name: "Idowu Adedamola", avatar: "", followers: "5.4k" },
    { uuid: "2", name: "Khoko_Lagos", avatar: "", followers: "8.7k" },
    { uuid: "3", name: "LakeBradson", avatar: "", followers: "500" },
    { uuid: "4", name: "VEGAS", avatar: "", followers: "12.3k" },
    { uuid: "5", name: "Ohhyinn", avatar: "", followers: "1.1k" },
    { uuid: "6", name: "Karire Josiah", avatar: "", followers: "70k" },
    { uuid: "7", name: "OLÁDÉ Beauty", avatar: "", followers: "3.2k" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center px-6 py-3 shrink-0 gap-4">
        {/* Host info pill */}
        <div className="flex items-center gap-2.5 bg-white/5 rounded-full pl-1.5 pr-4 py-1.5">
          <CustomAvatar
            src={streamData?.host?.profile_picture || user.profile_picture || ""}
            name={streamData?.host?.name || user.name}
            className="size-9 border border-white/10"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-semibold text-[13px]">{streamData?.host?.name || user.name}</span>
            <span className="text-white/50 text-[11px]">{formatFollowers(streamData?.host?.followers_count)} Followers</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="size-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-background" />
            ))}
          </div>
          <div className="flex items-center gap-1 text-white/70">
            <FaHeart className="size-3 text-red-500" />
            <span className="text-xs font-medium">{formatCount(heartCount || streamData?.likes_count || "32.1K")}</span>
          </div>
          <div className="flex items-center gap-1 text-white/70 cursor-pointer hover:text-white transition-colors" onClick={() => setShowViewersModal(true)}>
            <IoPersonAdd className="size-3" />
            <span className="text-xs font-medium">{formatCount(viewerCount || 107)}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex px-6 pb-4 gap-4 overflow-hidden">
        {/* Video section */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Video container */}
          <div className="relative flex-1 rounded-2xl overflow-hidden bg-black">
            {/* Split view when co-host is present */}
            {coHosts.length > 0 ? (
              <div className="flex w-full h-full">
                {/* Host video */}
                <div className="relative flex-1 border-r border-black/50">
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <IoPersonAdd className="size-3" /> Host
                    </span>
                  </div>
                  {useFallbackVideo ? (
                    <video autoPlay playsInline muted loop className={`w-full h-full object-cover ${isCameraMuted ? "hidden" : ""}`} src={FALLBACK_VIDEO_URL} />
                  ) : (
                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isCameraMuted ? "hidden" : ""}`} style={{ transform: "scaleX(-1)" }} />
                  )}
                  {isCameraMuted && (
                    <div className="w-full h-full relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-cover bg-center blur-md opacity-40" style={{ backgroundImage: `url(${streamData?.host?.profile_picture || user.profile_picture || ""})` }} />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="relative flex flex-col items-center gap-2 z-10">
                        <CustomAvatar src={streamData?.host?.profile_picture || user.profile_picture || ""} name={user.name} className="size-12 border-2 border-white/20" />
                        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-0.5">
                          <FaVideoSlash className="size-3 text-white/70" />
                          <span className="text-white/80 text-[10px] font-medium">Camera Off</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Co-host video */}
                <div className="relative flex-1">
                  <div className="absolute top-3 right-3 z-20">
                    <span className="text-white text-xs font-medium">{coHosts[0].name}</span>
                  </div>
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                    <CustomAvatar src={coHosts[0].avatar} name={coHosts[0].name} className="size-16" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Single host view */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <IoPersonAdd className="size-3" /> Host
                  </span>
                </div>

                {/* Video element — always mounted, hidden via CSS when camera off */}
                {useFallbackVideo ? (
                  <video
                    autoPlay
                    playsInline
                    muted
                    loop
                    className={`w-full h-full object-cover ${isCameraMuted ? "hidden" : ""}`}
                    src={FALLBACK_VIDEO_URL}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isCameraMuted ? "hidden" : ""}`}
                    style={{ transform: "scaleX(-1)" }}
                  />
                )}

                {/* Camera off state — blurred profile picture background + badge */}
                {isCameraMuted && (
                  <div className="w-full h-full relative flex items-center justify-center">
                    {/* Blurred background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-md opacity-40"
                      style={{ backgroundImage: `url(${streamData?.host?.profile_picture || user.profile_picture || ""})` }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                    {/* Center content */}
                    <div className="relative flex flex-col items-center gap-2 z-10">
                      <CustomAvatar
                        src={streamData?.host?.profile_picture || user.profile_picture || ""}
                        name={streamData?.host?.name || user.name}
                        className="size-14 border-2 border-white/20"
                      />
                      <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <FaVideoSlash className="size-3 text-white/70" />
                        <span className="text-white/80 text-xs font-medium">Camera Off</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Paused overlay */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                <button
                  onClick={handleResume}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
                    <FaPlay className="size-4 ml-0.5" />
                  </div>
                  <span className="text-sm font-medium">Live paused</span>
                </button>
              </div>
            )}

            {/* Timer and controls overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
              <span className="text-white/90 text-sm font-mono bg-black/40 backdrop-blur-sm rounded-md px-2.5 py-1">
                {elapsedTime}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCameraMuted(!isCameraMuted)}
                  className={`size-9 rounded-full flex items-center justify-center transition-colors ${
                    isCameraMuted
                      ? "bg-white/20 text-white/60"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {isCameraMuted ? <FaVideoSlash className="size-4" /> : <FaVideo className="size-4" />}
                </button>
                <button
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`size-9 rounded-full flex items-center justify-center transition-colors ${
                    isMicMuted
                      ? "bg-white/20 text-white/60"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {isMicMuted ? <FaMicrophoneSlash className="size-4" /> : <FaMicrophone className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Stream title */}
          <div className="flex items-center gap-2">
            <IoPersonAdd className="text-white/60 size-4" />
            <span className="text-white font-medium text-sm">{streamData?.title || "Untitled Stream"}</span>
          </div>

          {/* Host action buttons */}
          <div className="flex items-center gap-2 pb-2">
            <Button variant="outline" size="sm" onClick={() => openModal("requests")} className="rounded-full text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5">
              <HiOutlineUserGroup className="size-3.5" />
              Requests
            </Button>
            <Button variant="outline" size="sm" onClick={() => openModal("add-cohost")} className="rounded-full text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5">
              <FaUserPlus className="size-3.5" />
              Add Co-host
            </Button>
            <Button variant="outline" size="sm" onClick={() => openModal("invite-users")} className="rounded-full text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5">
              <IoPersonAdd className="size-3.5" />
              Invite users
            </Button>
            <Button variant="outline" size="sm" onClick={() => openModal("management")} className="rounded-full text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5">
              <MdOutlineSettings className="size-3.5" />
              Interaction control
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowEndLiveModal(true)} className="rounded-full text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5">
              <FiLogOut className="size-3.5" />
              End live
            </Button>
          </div>
        </div>

        {/* Chat panel */}
        <div className="w-[280px] shrink-0 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="py-2">
            <h3 className="text-white font-semibold text-sm">Ask me Anything – LIVE 🔥</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <CustomAvatar
                  src={msg.user.avatar}
                  name={msg.user.name}
                  className="size-7 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  {msg.type === "join" ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/80 text-xs font-medium">{msg.user.name}</span>
                      <span className="text-white/40 text-xs italic">Joined</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1 flex-wrap mb-0.5">
                        <span className="text-white text-xs font-semibold">{msg.user.username}</span>
                        {msg.user.isHost && (
                          <span className="bg-blue-500/20 text-blue-400 text-[8px] font-bold px-1.5 py-0.5 rounded">Host</span>
                        )}
                        {msg.user.isVerified && (
                          <span className="text-green-500 text-[10px]">●</span>
                        )}
                        <span className="text-white/40 text-[10px]">{msg.time}</span>
                        {msg.user.isHost && msg.id === "1" && (
                          <span className="text-yellow-400 text-[10px]">📌</span>
                        )}
                      </div>
                      <p className="text-white/70 text-[11px] leading-relaxed">{msg.message}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Expand indicator */}
          <div className="flex justify-center py-1">
            <BiChevronUp className="text-white/40 size-4" />
          </div>

          {/* Comment input */}
          <div className="flex items-center gap-2 pb-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              placeholder="Add comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/20"
            />
            <button
              onClick={handleSendComment}
              disabled={!comment.trim()}
              className="size-8 rounded-full bg-[#0D52D2] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[#0D52D2]/80 transition-colors shrink-0"
            >
              <IoSend className="size-3.5" />
            </button>
          </div>

          {/* Sponsor/Ad card */}
          <div className="pt-1">
            <SponsorCard sponsorType="liveStream" />
          </div>
        </div>
      </div>

      {/* Host Control Modals */}
      <HostControlModals
        open={modalView !== null}
        onClose={() => setModalView(null)}
        initialView={modalView}
        showBack={modalShowBack}
        streamUuid={streamData?.uuid}
      />

      {/* End Live Confirmation Modal */}
      <Dialog open={showEndLiveModal} onOpenChange={setShowEndLiveModal}>
        <DialogContent className="!max-w-[420px] w-full p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#1C1C1E] shadow-2xl [&>button:last-child]:hidden">
          <div className="flex flex-col items-center px-6 pt-6 pb-6">
            <button onClick={() => setShowEndLiveModal(false)} className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded-full">
              <IoClose className="text-white/70 size-5" />
            </button>
            <h2 className="text-lg font-bold text-white mb-1">End Livestream</h2>
            <p className="text-sm text-[#8E8E93] mb-6">Are you sure you want to end this live stream?</p>
            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={handleEndLive}
                disabled={isEndingSession}
                variant="outline"
                className="w-full h-11 rounded-xl border-white/10 text-white font-medium"
              >
                {isEndingSession ? "Ending..." : "Yes, End"}
              </Button>
              <Button
                onClick={() => setShowEndLiveModal(false)}
                className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Viewers Modal */}
      <Dialog open={showViewersModal} onOpenChange={setShowViewersModal}>
        <DialogContent className="!max-w-[450px] w-full p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#1C1C1E] shadow-2xl [&>button:last-child]:hidden max-h-[500px]">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-base font-bold text-white">Viewers · {viewerCount || 107}</h2>
              <button onClick={() => setShowViewersModal(false)} className="p-1 hover:bg-white/5 rounded-full">
                <IoClose className="text-white/70 size-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 pb-3">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 h-9">
                <IoPersonAdd className="text-white/40 size-3.5 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search for viewers"
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 outline-none"
                />
              </div>
            </div>

            {/* Viewer list */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <div className="flex flex-col gap-3">
                {DUMMY_VIEWERS.map((viewer) => (
                  <div key={viewer.uuid} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CustomAvatar src={viewer.avatar} name={viewer.name} className="size-10" />
                      <div>
                        <p className="text-white text-sm font-medium">{viewer.name}</p>
                        <p className="text-[#8E8E93] text-xs">{viewer.followers} followers</p>
                      </div>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                          <FaEllipsisH className="text-white/50 size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0 bg-[#2C2C2E] border border-white/10 rounded-xl" align="end" sideOffset={4}>
                        <div className="p-4 flex items-center gap-3 border-b border-white/5">
                          <CustomAvatar src={viewer.avatar} name={viewer.name} className="size-10" />
                          <div>
                            <p className="text-white text-sm font-semibold">{viewer.name}</p>
                            <p className="text-[#8E8E93] text-xs">@{viewer.name.toLowerCase().replace(/\s+/g, "")}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-0">
                          <button className="flex flex-col items-center gap-1.5 py-4 hover:bg-white/5 transition-colors border-r border-b border-white/5">
                            <IoPersonAdd className="size-4 text-white/70" />
                            <span className="text-[11px] text-white/70">Add as co-host</span>
                          </button>
                          <button className="flex flex-col items-center gap-1.5 py-4 hover:bg-white/5 transition-colors border-b border-white/5">
                            <span className="text-[11px] text-red-400 font-medium">⚠ Report</span>
                          </button>
                          <button className="flex flex-col items-center gap-1.5 py-4 hover:bg-white/5 transition-colors border-r border-white/5">
                            <IoPersonAdd className="size-4 text-white/70" />
                            <span className="text-[11px] text-white/70">Remove from live</span>
                          </button>
                          <button className="flex flex-col items-center gap-1.5 py-4 hover:bg-white/5 transition-colors">
                            <span className="text-[11px] text-red-400 font-medium">⛔ Block</span>
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function formatFollowers(count: number | string | undefined): string {
  if (!count) return "0";
  const num = typeof count === "string" ? parseInt(count, 10) : count;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

function formatCount(count: number | string): string {
  if (!count) return "0";
  const num = typeof count === "string" ? parseInt(count, 10) : count;
  if (isNaN(num)) return String(count);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

export default HostLiveView;
