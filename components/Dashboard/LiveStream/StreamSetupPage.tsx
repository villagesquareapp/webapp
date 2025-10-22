"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { createLivestream } from "api/livestreams";
import SponsorCard from "../Reusable/SponsorCard";

interface StreamSetupPageProps {
  featuredLivestreams: IFeaturedLivestream[];
}

const StreamSetupPage = ({
  featuredLivestreams,
}: StreamSetupPageProps) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [pendingLivestreamData, setPendingLivestreamData] = useState<any>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Load pending livestream data from localStorage
  useEffect(() => {
    setIsClient(true);
    const storedData = localStorage.getItem("pending_livestream");
    if (storedData) {
      setPendingLivestreamData(JSON.parse(storedData));
    } else {
      // No pending data, redirect back
      router.push("/dashboard/live-streams");
    }
  }, [router]);

  // Initialize media stream
  useEffect(() => {
    const startLocalStream = async () => {
      try {
        setMediaError(null);

        const constraints = {
          video: isCameraActive
            ? {
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                frameRate: { ideal: 30, min: 15 },
              }
            : false,
          audio: isMicActive
            ? {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              }
            : false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setLocalStream(stream);
        toast.success("Camera and microphone ready");
      } catch (error) {
        console.error("Error accessing media devices:", error);

        let errorMessage = "Failed to access camera/microphone";
        if (error instanceof Error) {
          if (error.name === "NotAllowedError") {
            errorMessage = "Please allow camera and microphone access";
          } else if (error.name === "NotFoundError") {
            errorMessage = "No camera or microphone found";
          } else if (error.name === "NotReadableError") {
            errorMessage =
              "Camera/microphone is being used by another application";
          }
        }

        setMediaError(errorMessage);
        toast.error(errorMessage);
      }
    };

    if (isClient) {
      startLocalStream();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
    };
  }, [isClient, isCameraActive, isMicActive]);

  

  const toggleCamera = () => {
    if (!localStream) return;
    const newCameraState = !isCameraActive;
    setIsCameraActive(newCameraState);

    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = newCameraState;
    }
  };

  const toggleMic = () => {
    if (!localStream) return;
    const newMicState = !isMicActive;
    setIsMicActive(newMicState);

    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = newMicState;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleStartLiveStream = async () => {
    if (!localStream) {
      toast.error("Please enable camera/microphone first");
      return;
    }

    if (!pendingLivestreamData) {
      toast.error("No stream data found. Please go back and create a stream.");
      return;
    }

    setIsStarting(true);

    try {
      console.log("Starting live stream with pending data...");

      const formData = new FormData();
      Object.keys(pendingLivestreamData).forEach((key) => {
        formData.append(key, pendingLivestreamData[key]);
      });

      const response = await createLivestream(formData);

      if (response.status && response.data) {
        console.log("Stream started! UUID:", response.data.uuid);
        console.log("Stream ID:", response.data.stream_id);

        // Clear pending data
        localStorage.removeItem("pending_livestream");

        // Store active livestream
        localStorage.setItem("active_livestream", JSON.stringify(response.data));

        // Redirect to the actual stream page
        // toast.success("Redirecting to live stream...");
        router.push(`/dashboard/live-streams/${response.data.uuid}`);
      } else {
        toast.error(response.message || "Failed to start livestream");
      }
    } catch (error) {
      console.error("Error starting stream:", error);
      toast.error("Failed to start stream");
    } finally {
      setIsStarting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">Stream Setup</p>
      </div>

      <div className="grid grid-cols-8 gap-x-4">
        {/* Left Column: Video Preview */}
        <div className="col-span-6 gap-y-4 flex flex-col">
          <div className="w-full h-[66dvh] relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
            {/* Media Error Display */}
            {mediaError && (
              <div className="absolute inset-0 z-20 bg-red-900/80 flex items-center justify-center text-white flex-col gap-y-3">
                <FaVideoSlash className="size-10" />
                <p className="text-xl font-medium">Media Access Error</p>
                <p className="text-sm text-center px-4">{mediaError}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover transform -scale-x-100"
              style={{
                display: isCameraActive && !mediaError ? "block" : "none",
              }}
            />

            {/* Camera Off Placeholder */}
            {(!isCameraActive || mediaError) && !mediaError && (
              <div className="absolute inset-0 z-10 bg-gray-800 flex items-center justify-center text-white flex-col gap-y-3">
                <FaVideoSlash className="size-10" />
                <p className="text-xl font-medium">Camera is Off</p>
              </div>
            )}

            {/* Control Bar */}
            <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-40">
              <div className="flex justify-between items-center">
                {/* Start Button */}
                <Button
                  onClick={handleStartLiveStream}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-x-2 px-6"
                  size="lg"
                  disabled={!localStream || !!mediaError || isStarting}
                >
                  <FaVideo className="size-4" />
                  {isStarting ? "Starting..." : "Start Live Stream"}
                </Button>

                {/* Media Toggles */}
                <div className="flex gap-x-3">
                  <button
                    onClick={toggleCamera}
                    className={`p-3 rounded-full transition-colors ${
                      isCameraActive
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    title={
                      isCameraActive ? "Turn Off Camera" : "Turn On Camera"
                    }
                  >
                    {isCameraActive ? (
                      <FaVideo className="size-5" />
                    ) : (
                      <FaVideoSlash className="size-5" />
                    )}
                  </button>
                  <button
                    onClick={toggleMic}
                    className={`p-3 rounded-full transition-colors ${
                      isMicActive
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    title={
                      isMicActive ? "Mute Microphone" : "Unmute Microphone"
                    }
                  >
                    {isMicActive ? (
                      <FaMicrophone className="size-5" />
                    ) : (
                      <FaMicrophoneSlash className="size-5" />
                    )}
                  </button>
                  {/* <button
                    onClick={toggleMute}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white"
                  >
                    {isMuted ? (
                      <FaVolumeMute className="size-5" />
                    ) : (
                      <FaVolumeUp className="size-5" />
                    )}
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Setup Info */}
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">
              Check your camera and microphone before going live. Once you click
              "Start Live Stream", you'll be visible to viewers.
            </p>
          </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="flex flex-col col-span-2 w-full gap-y-4">
          <div className="flex flex-col rounded-xl border w-full h-[66dvh] relative p-4">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📹</span>
                </div>
                <p className="font-semibold text-gray-600 mb-2">
                  Ready to go live?
                </p>
                <p className="text-sm text-gray-500">
                  Make sure your camera and microphone are working, then click
                  "Start Live Stream" to begin broadcasting.
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 w-full p-4">
              <SponsorCard sponsorType="liveStream" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamSetupPage;