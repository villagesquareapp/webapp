"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { FaVideo, FaMicrophone } from "react-icons/fa";
import { createLivestream } from "api/livestreams";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import LiveCountdown from "./LiveCountdown";

interface LivePreviewProps {
  livestreamData: any;
}

const LivePreview = ({ livestreamData }: LivePreviewProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Initialize camera
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error("Media error:", err);
        setMediaError("Unable to access camera/microphone. Please allow permissions.");
      }
    };
    initMedia();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraActive(!isCameraActive);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicActive(!isMicActive);
    }
  };

  const handleStartLive = () => {
    setShowCountdown(true);
  };

  const handleCountdownComplete = async () => {
    setShowCountdown(false);
    setIsStarting(true);

    try {
      const formData = new FormData();
      formData.append("title", livestreamData.title || "Untitled Livestream");
      formData.append("category_id", livestreamData.category_id || "1");
      formData.append("start_date", livestreamData.start_date);
      formData.append("start_time", livestreamData.start_time);
      formData.append("privacy", livestreamData.privacy || "everyone");
      formData.append("comments_enabled", "true");
      formData.append("requests_enabled", "true");
      formData.append("questions_enabled", String(livestreamData.questions_enabled ?? false));
      formData.append("gifting_enabled", "true");

      const response = await createLivestream(formData);

      if (response.status && response.data) {
        localStorage.removeItem("pending_livestream");
        router.push(`/livestream/${response.data.uuid}`);
      } else {
        toast.error(response.message || "Failed to start livestream");
        setIsStarting(false);
      }
    } catch (error) {
      console.error("Error starting livestream:", error);
      toast.error("An error occurred while starting the livestream");
      setIsStarting(false);
    }
  };

  const handleCancel = () => {
    localStream?.getTracks().forEach((track) => track.stop());
    localStorage.removeItem("pending_livestream");
    router.push("/livestream");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar with stream info */}
      <div className="flex items-center gap-3 px-6 py-4 shrink-0">
        <CustomAvatar
          src={user?.profile_picture || ""}
          name={user?.name || "User"}
          className="size-10 border border-white/20"
        />
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-sm">{livestreamData?.title || "Untitled"}</span>
          <span className="bg-[#0D52D2] text-white text-[11px] font-semibold px-3 py-0.5 rounded-full">
            {formatFollowers(user?.followers)} Followers
          </span>
        </div>
      </div>

      {/* Camera Preview */}
      <div className="flex-1 relative mx-6 mb-6 rounded-2xl overflow-hidden bg-black">
        {mediaError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/60 text-sm text-center px-8">{mediaError}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror"
            style={{ transform: "scaleX(-1)" }}
          />
        )}

        {/* Countdown overlay */}
        {showCountdown && (
          <LiveCountdown onComplete={handleCountdownComplete} />
        )}

        {/* Start Live / Cancel buttons */}
        {!showCountdown && !isStarting && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 gap-3">
            <Button
              onClick={handleStartLive}
              disabled={!!mediaError}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 h-10 rounded-full"
            >
              Start Live
            </Button>
            <button
              onClick={handleCancel}
              className="text-white/70 hover:text-white text-sm border border-white/20 rounded-full px-6 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Camera/Mic controls */}
        {!showCountdown && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <button
              onClick={toggleCamera}
              className={`size-9 rounded-full flex items-center justify-center transition-colors ${
                isCameraActive ? "bg-white/10 text-white" : "bg-red-500/80 text-white"
              }`}
            >
              <FaVideo className="size-4" />
            </button>
            <button
              onClick={toggleMic}
              className={`size-9 rounded-full flex items-center justify-center transition-colors ${
                isMicActive ? "bg-white/10 text-white" : "bg-red-500/80 text-white"
              }`}
            >
              <FaMicrophone className="size-4" />
            </button>
          </div>
        )}
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

export default LivePreview;
