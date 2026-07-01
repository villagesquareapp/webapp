"use client";

import { useState, useRef, useEffect } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Button } from "components/ui/button";
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaHeart, FaPlay, FaShareAlt } from "react-icons/fa";
import { IoPersonAdd, IoSend, IoGift, IoLogOutOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineReport } from "react-icons/md";
import { BiChevronUp } from "react-icons/bi";
import SponsorCard from "../Reusable/SponsorCard";

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

interface CoHostLiveViewProps {
  streamData: any;
  user: IUser;
  hostInfo: {
    name: string;
    username: string;
    avatar: string;
  };
}

const CoHostLiveView = ({ streamData, user, hostInfo }: CoHostLiveViewProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: { name: hostInfo.name, username: hostInfo.username, avatar: hostInfo.avatar, isHost: true, isVerified: true },
      message: `Hi, everyone, I'm the founder of ${hostInfo.username}, follow for more beauty tips`,
      time: "2m ago",
      type: "message",
    },
  ]);
  const [comment, setComment] = useState("");
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [viewerCount, setViewerCount] = useState(streamData?.users || 0);
  const [heartCount, setHeartCount] = useState(0);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(Date.now());

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

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendComment = () => {
    if (!comment.trim()) return;
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      user: { name: user.name, username: user.username, avatar: user.profile_picture || "", isVerified: true },
      message: comment,
      time: "now",
      type: "message",
    };
    setMessages((prev) => [...prev, newMsg]);
    setComment("");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <CustomAvatar
            src={hostInfo.avatar}
            name={hostInfo.name}
            className="size-10 border-2 border-white/20"
          />
          <div>
            <p className="text-white font-semibold text-sm">{hostInfo.name}</p>
            <p className="text-white/50 text-xs">{formatFollowers(streamData?.host?.followers_count)} Followers</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="size-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-background" />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-white/70">
            <FaHeart className="size-3.5 text-red-500" />
            <span className="text-xs font-medium">{formatCount(heartCount || streamData?.likes_count || "32.1K")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/70">
            <IoPersonAdd className="size-3.5" />
            <span className="text-xs font-medium">{formatCount(viewerCount || 107)}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex px-6 pb-4 gap-4 overflow-hidden">
        {/* Video section */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Video container — split view */}
          <div className="relative flex-1 rounded-2xl overflow-hidden bg-black">
            <div className="flex w-full h-full">
              {/* Host video */}
              <div className="relative flex-1 border-r border-black/50">
                <div className="absolute top-3 left-3 z-20">
                  <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <IoPersonAdd className="size-3" /> Host
                  </span>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  <p className="text-white/30 text-sm">Host Video</p>
                </div>
              </div>
              {/* Co-host (self) video */}
              <div className="relative flex-1">
                <div className="absolute top-3 right-3 z-20">
                  <span className="text-white text-xs font-medium">{user.name}</span>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                  <p className="text-white/30 text-sm">Your Video</p>
                </div>
              </div>
            </div>

            {/* Timer and controls overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
              <span className="text-white/90 text-sm font-mono bg-black/40 backdrop-blur-sm rounded-md px-2.5 py-1">
                {elapsedTime}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCameraMuted(!isCameraMuted)}
                  className={`size-9 rounded-full flex items-center justify-center transition-colors ${
                    isCameraMuted ? "bg-white/20 text-white/60" : "bg-white/10 text-white"
                  }`}
                >
                  {isCameraMuted ? <FaVideoSlash className="size-4" /> : <FaVideo className="size-4" />}
                </button>
                <button
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`size-9 rounded-full flex items-center justify-center transition-colors ${
                    isMicMuted ? "bg-white/20 text-white/60" : "bg-white/10 text-white"
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

          {/* Co-host action buttons */}
          <div className="flex items-center gap-2 pb-2">
            <Button variant="outline" size="sm" className="rounded-full text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5">
              <HiOutlineUserGroup className="size-3.5" />
              Request to join
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5">
              <IoGift className="size-3.5 text-red-400" />
              Send Gift
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5">
              <FaShareAlt className="size-3" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs h-8 border-white/10 text-white/80 hover:text-white gap-1.5">
              <MdOutlineReport className="size-3.5" />
              Report
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs h-8 border-white/10 text-red-400 hover:text-red-300 hover:border-red-400/30 gap-1.5">
              <IoLogOutOutline className="size-3.5" />
              Exit live
            </Button>
          </div>
        </div>

        {/* Chat panel */}
        <div className="w-[300px] shrink-0 flex flex-col bg-transparent rounded-xl overflow-hidden">
          {/* Chat header */}
          <div className="px-4 py-3">
            <h3 className="text-white font-semibold text-sm">Ask me Anything – LIVE 🔥</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 space-y-4 no-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2.5">
                <CustomAvatar
                  src={msg.user.avatar}
                  name={msg.user.name}
                  className="size-8 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  {msg.type === "join" ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/80 text-xs font-medium">{msg.user.name}</span>
                      <span className="text-white/40 text-xs italic">Joined</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="text-white text-xs font-semibold">{msg.user.username}</span>
                        {msg.user.isHost && (
                          <span className="bg-blue-500/20 text-blue-400 text-[9px] font-bold px-1.5 py-0.5 rounded">Host</span>
                        )}
                        {msg.user.isVerified && (
                          <span className="text-green-500 text-xs">●</span>
                        )}
                        <span className="text-white/40 text-[10px]">{msg.time}</span>
                        {msg.user.isHost && msg.id === "1" && (
                          <span className="text-yellow-400 text-[10px]">📌</span>
                        )}
                      </div>
                      <p className="text-white/70 text-xs leading-relaxed">{msg.message}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Expand indicator */}
          <div className="flex justify-center py-1">
            <BiChevronUp className="text-white/40 size-5" />
          </div>

          {/* Comment input */}
          <div className="px-3 pb-3 flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              placeholder="Add comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
            />
            <button
              onClick={handleSendComment}
              disabled={!comment.trim()}
              className="size-9 rounded-full bg-[#0D52D2] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[#0D52D2]/80 transition-colors shrink-0"
            >
              <IoSend className="size-4" />
            </button>
          </div>

          {/* Sponsor/Ad card */}
          <div className="px-3 pb-3">
            <SponsorCard sponsorType="liveStream" />
          </div>
        </div>
      </div>
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

export default CoHostLiveView;
