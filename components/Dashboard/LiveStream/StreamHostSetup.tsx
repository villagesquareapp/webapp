"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Separator } from "components/ui/separator";
import LiveFeaturedPreviewCard from "./LiveFeaturedPreviewCard";
import SponsorCard from "../Reusable/SponsorCard";
import { VSChatAsk } from "components/icons/village-square";
import { BiSolidGift } from "react-icons/bi";
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaEllipsisH,
  FaVolumeUp,
  FaVolumeMute,
  FaUserPlus,
  FaHeart,
} from "react-icons/fa";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { toast } from "sonner";
import { CgEye } from "react-icons/cg";
import {
  createLivestream,
  endLivestream,
  saveStreamToPosts,
} from "api/livestreams";
import LiveStreamDialog from "./LiveStreamDialog";
import { init } from "next/dist/compiled/webpack/webpack";

interface StreamHostSetupProps {
  streamData: any;
  featuredLivestreams: IFeaturedLivestream[];
  isHost: boolean;
}

// Stream states: 'setup' -> 'live'
type StreamState = "setup" | "live";

const StreamHostSetup = ({
  streamData: initialStreamData,
  featuredLivestreams,
  isHost,
}: StreamHostSetupProps) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const webRTCAdaptorRef = useRef<WebRTCAdaptor | null>(null);
  const [streamData, setStreamData] = useState(initialStreamData);
  const [pendingLivestreamData, setPendingLivestreamData] = useState<any>(null);
  const [streamState, setStreamState] = useState<StreamState>("setup");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [streamSummary, setStreamSummary] = useState<IEndLivestream | null>(
    null
  );
  const [isEndingStream, setIsEndingStream] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [viewerCount, setViewerCount] = useState<number>(
    streamData?.users ?? 0
  );
  const [streamDuration, setStreamDuration] = useState(0);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: { name: "John Abraham", avatar: "/images/vs-logo.webp" },
      message:
        "Actually I am waiting for this podcast for so literally like soo long",
      timestamp: Date.now() - 300000,
    },
  ]);

  // Load pending livestream data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("pending_livestream");
    if (storedData) {
      setPendingLivestreamData(JSON.parse(storedData));
      console.log("Loaded pending livestream data:", JSON.parse(storedData));
    }
  }, []);

  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    console.log("InitializeWebSocket called");
    console.log("websocket.current: ", websocketRef.current);

    if (websocketRef.current) {
      console.log("Websocket already exists, skipping initialization");
      return;
    }

    if (!streamData?.stream_id) {
      console.error("No stream_id available for WebSocket");
      toast.error("Cannot connect to chat: Stream not started");
      return;
    }

    try {
      const streamId = streamData?.stream_id;
      const wsUrl = `wss://origin-streaming-server.villagesquare.io/Livestream/websocket?stream=${streamId}`;

      // const wsUrl = getWebSocketURL(streamUuid);
      websocketRef.current = new WebSocket(wsUrl);
      console.log("Attempting WebSocket connection to:", wsUrl);
      websocketRef.current = new WebSocket(wsUrl);

      console.log(
        "Websocket created. ReadyState:",
        websocketRef.current.readyState
      );

      websocketRef.current.onopen = () => {
        console.log("Websocket OPEN event fired!");
        console.log("WebSocket connected to Villagesquare streaming server");
        console.log("Websocket readyState: ", websocketRef.current?.readyState);
        console.log("Stream UUID: ", streamData?.uuid);
        console.log("Stream ID: ", streamId);

        // toast.success("Connected to chat");

        // Send initial connection message
        const joinMessage = {
          type: "join",
          stream_id: streamId,
          user_id: streamData?.host.uuid || "host",
          role: "host",
        };
        console.log("Sending join message:", joinMessage);

        websocketRef.current?.send(JSON.stringify(joinMessage));
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Chat message:", data);

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
              setViewerCount(data.users || data.viewers || 0);
              break;

            case "viewer_joined":
              setViewerCount((prev) => prev + 1);
              toast.info("New viewer joined");
              break;

            case "viewer_left":
              setViewerCount((prev) => Math.max(0, prev - 1));
              break;

            case "gift":
              toast.success(`${data.sender} sent a gift!`);
              break;
          }
        } catch (error) {
          console.error("Error parsing chat message:", error);
        }
      };
      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("Chat connection error");
      };

      websocketRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        if (streamState === "live") {
          toast.info("Chat disconnected. Attempting to reconnect...");
          // Attempt to reconnect after 3 seconds
          setTimeout(() => {
            if (streamState === "live") {
              initializeWebSocket();
            }
          }, 3000);
        }
      };
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      toast.error("Failed to connect to chat server");
    }
  };

  // Initialize WebRTC peer connection with TURN server
  const initializeAntMediaAdaptor = () => {
    const roomId = streamData?.livestream_room_id;
    const streamId = streamData?.stream_id;

    if (!roomId || !streamId) {
      console.error("Missing room ID or stream ID");
      toast.error("Stream configuration error");
      return;
    }

    console.log("Initializing Ant Media Adaptor");
    console.log("Room ID:", roomId);
    console.log("Stream ID:", streamId);

    const pc_config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:13.247.98.246:3478",
          username: "fyUH6cJl",
          credential: "bQt47NdzodCu",
        },
      ],
    };

    const sdpConstraints = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false,
    };

    const mediaConstraints = {
      video: {
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 },
        frameRate: { ideal: 30, min: 15 },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };

    webRTCAdaptorRef.current = new WebRTCAdaptor({
      websocket_url:
        "wss://origin-streaming-server.villagesquare.io/Livestream/websocket",
      mediaConstraints: mediaConstraints,
      peerconnection_config: pc_config,
      sdp_constraints: sdpConstraints,
      localVideoId: "localVideo",
      isPlayMode: false,
      debug: true,

      callback: (info: string, obj: any) => {
        console.log("Ant Media callback:", info, obj);

        if (info === "initialized") {
          console.log("Ant Media WebRTC Adaptor initialized");
          // toast.success("Streaming initialized");

          // Join room and publish
          console.log(`Joining room: ${roomId} with stream: ${streamId}`);
          if (webRTCAdaptorRef.current) {
            webRTCAdaptorRef.current.joinRoom(roomId, streamId);
          }
        } else if (info === "joinedTheRoom") {
          console.log("Joined room successfully:", obj);
          toast.success("Joined streaming room");

          // Start publishing to the room
          console.log(`Publishing stream: ${streamId}`);
          webRTCAdaptorRef.current?.publish(
            streamId,
            undefined,
            undefined,
            undefined,
            streamId,
            roomId
          );
        } else if (info === "publish_started") {
          console.log("Publishing started:", obj);
          toast.success("Now broadcasting live!");
          setStreamState("live");
        } else if (info === "publish_finished") {
          console.log("Stream publish finished");
          toast.info("Stream ended");
          handleEndSessionClick();
        } else if (info === "ice_connection_state_changed") {
          console.log("ICE connection state:", obj.state);
        } else if (info === "updated_stats") {
          // Handle stream stats if needed
        } else if (info === "data_received") {
          console.log("Data channel message:", obj);
        }
      },

      callbackError: (error: string, message: any) => {
        console.error("❌ Ant Media error:", error, message);

        if (error === "no_stream_exist") {
          toast.error("Stream does not exist");
        } else if (error === "publishTimeoutError") {
          toast.error("Stream publish timeout. Please try again.");
        } else if (error === "WebSocketNotConnected") {
          toast.error("Connection failed. Please check your internet.");
          return;
        } else {
          toast.error(`Streaming error: ${error}`);
        }
      },
    });
  };

  // Initialize media stream with enhanced error handling
  useEffect(() => {
    setIsClient(true);

    const startLocalStream = async () => {
      try {
        setMediaError(null);

        // Request higher quality video for streaming
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

    if (isHost) {
      startLocalStream();
    }

    return () => {
      // Cleanup function
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
            console.log(`Cleanup: Stopped ${track.kind} track`);
          }
        });
      }
      if (webRTCAdaptorRef.current) {
        try {
          webRTCAdaptorRef.current.stop;
          webRTCAdaptorRef.current.closeWebSocket();
        } catch (error) {
          console.error("Error stopping adaptor:", error);
        }
      }
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {  
  if (
    streamData?.stream_id &&
    streamData?.livestream_room_id &&
    streamState === "setup" &&
    localStream &&
    isHost
  ) {
    console.log("🚀 Auto-starting stream on /:uuid page");
    console.log("Stream ID:", streamData.stream_id);
    console.log("Room ID:", streamData.livestream_room_id);
    
    // Start the initialization
    try {
      initializeWebSocket();
      initializeAntMediaAdaptor();
      // Don't set streamState here - let Ant Media callback do it when "publish_started"
    } catch (error) {
      console.error("Error auto-starting stream:", error);
      toast.error("Failed to start stream automatically");
    }
  }
}, [streamData?.stream_id, streamData?.livestream_room_id, streamState, localStream, isHost]);

  // Stream duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (streamState === "live") {
      interval = setInterval(() => {
        setStreamDuration((prev) => {
          const newDuration = prev + 1;

          // Send duration update to viewers every 5 seconds
          if (newDuration % 5 === 0 && websocketRef.current) {
            websocketRef.current.send(
              JSON.stringify({
                type: "stream_duration",
                duration: newDuration,
                stream_id: streamData?.stream_id,
              })
            );
          }

          return newDuration;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [streamState, streamData]);

  // Detect when host leaves/returns to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Host navigated away or minimized tab
        console.log("Host left the stream page");

        if (streamState === "live") {
          // Pause local video
          if (videoRef.current) {
            videoRef.current.pause();
          }

          // Notify backend that stream is paused
          if (
            websocketRef.current &&
            websocketRef.current.readyState === WebSocket.OPEN
          ) {
            websocketRef.current.send(
              JSON.stringify({
                type: "stream_paused",
                stream_id: streamData?.stream_id,
                user_id: streamData?.host?.uuid || "host",
                reason: "host_left_page",
              })
            );
          }

          toast.info("Stream paused while you're away");
        }
      } else {
        // Host returned to the stream page
        console.log("Host returned to stream page");

        if (streamState === "live") {
          // Resume local video
          if (videoRef.current) {
            videoRef.current.play();
          }

          // Notify backend that stream resumed
          if (
            websocketRef.current &&
            websocketRef.current.readyState === WebSocket.OPEN
          ) {
            websocketRef.current.send(
              JSON.stringify({
                type: "stream_resumed",
                stream_id: streamData?.stream_id,
                user_id: streamData?.host?.uuid || "host",
              })
            );
          }

          // toast.success("Stream resumed");
        }
      }
    };

    // Listen for page visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [streamState, streamData]);

  // Handle before page unload (closing tab or navigating away)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (streamState === "live") {
        // Warn user before leaving
        e.preventDefault();
        e.returnValue =
          "Your livestream is active. Are you sure you want to leave?";

        // Send pause notification
        if (websocketRef.current) {
          websocketRef.current.send(
            JSON.stringify({
              type: "stream_paused",
              stream_id: streamData?.stream_id,
              reason: "host_left_page",
            })
          );
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [streamState, streamData]);

  const toggleCamera = () => {
    if (!localStream) return;

    const newCameraState = !isCameraActive;
    setIsCameraActive(newCameraState);

    // Toggle in Ant Media stream
    if (webRTCAdaptorRef.current) {
      if (newCameraState) {
        // Turn camera ON
        webRTCAdaptorRef.current.turnOnLocalCamera(streamData?.stream_id ?? "");
      } else {
        // Turn camera OFF
        webRTCAdaptorRef.current.turnOffLocalCamera(
          streamData?.stream_id ?? ""
        );
      }
    }

    // Also toggle local preview
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = newCameraState;
    }

    // Notify viewers
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      websocketRef.current.send(
        JSON.stringify({
          type: "camera_toggled",
          camera_active: newCameraState,
          stream_id: streamData?.stream_id,
        })
      );
    }
  };

  const toggleMic = () => {
    if (!localStream) return;

    const newMicState = !isMicActive;
    setIsMicActive(newMicState);

    // Toggle in Ant Media stream
    if (webRTCAdaptorRef.current) {
      if (newMicState) {
        // Unmute
        webRTCAdaptorRef.current.unmuteLocalMic();
      } else {
        // Mute
        webRTCAdaptorRef.current.muteLocalMic();
      }
    }

    // Also toggle local preview
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = newMicState;
    }

    // Notify viewers
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      websocketRef.current.send(
        JSON.stringify({
          type: "mic_toggled",
          mic_active: newMicState,
          stream_id: streamData?.stream_id,
        })
      );
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Stream actions

  // const handleStartLiveStream = async () => {
  //   if (!localStream) {
  //     toast.error("Please enable camera/microphone first");
  //     return;
  //   }

  //   console.log("Starting live stream with Ant Media...");
  //   console.log("Stream data:", streamData);

  //   // setStreamState("live");
  //   toast.success("Live stream started!");

  //   // Initialize WebSocket first and wait for it to connect
  //   console.log("Calling initializeWebSocket()...");
  //   initializeWebSocket();

  //   initializeAntMediaAdaptor();

  //   console.log("Stream started for:", streamData?.uuid);
  // };

  const handleStartLiveStream = async () => {
    if (!localStream) {
      toast.error("Please enable camera/microphone first");
      return;
    }

    // ✅ Check if we have pending data (coming from Go Live modal)
    if (!streamData && pendingLivestreamData) {
      console.log("🚀 Starting live stream with pending data...");

      try {
        // Create FormData from pending data
        const formData = new FormData();
        Object.keys(pendingLivestreamData).forEach((key) => {
          formData.append(key, pendingLivestreamData[key]);
        });

        // ✅ NOW call /livestreams/start
        const response = await createLivestream(formData); // This calls /livestreams/start

        console.log("Start Livestream Response:", response);

        if (response.status && response.data) {
          console.log("Stream started! Stream ID:", response.data.stream_id);

          // ✅ Clear localStorage
          localStorage.removeItem("pending_livestream");

          // ✅ Set the stream data
          setStreamData(response.data);

          // ✅ Store active livestream
          localStorage.setItem(
            "active_livestream",
            JSON.stringify(response.data)
          );

          await new Promise((resolve) => setTimeout(resolve, 100));

          toast.success("Live stream started!");
          router.push(`/dashboard/live-streams/${response.data.uuid}`)
          // ✅ Initialize WebSocket
          initializeWebSocket();

          // ✅ Initialize Ant Media
          initializeAntMediaAdaptor();

          setStreamState("live");
        } else {
          toast.error(response.message || "Failed to start livestream");
        }
      } catch (error) {
        console.error("Error starting stream:", error);
        toast.error("Failed to start stream");
      }
    }
    // ✅ If streamData already exists (coming from existing stream)
    else if (streamData && streamData.stream_id) {
      console.log("🚀 Resuming existing stream...");
      initializeWebSocket();
      initializeAntMediaAdaptor();
      setStreamState("live");
      toast.success("Live stream started!");
    } else {
      toast.error(
        "No livestream data found. Please go back and create a stream."
      );
    }
  };

  // Show end session confirmation dialog
  const handleEndSessionClick = () => {
    setShowEndDialog(true);
  };

  // Actually end the stream
  // const handleConfirmEndSession = async () => {
  //   setShowEndDialog(false);
  //   setIsEndingStream(true);

  //   try {
  //     const streamUuid = streamData?.uuid;
  //     const streamId = streamData?.stream_id;

  //     const response = await endLivestream(streamUuid);

  //     if (response.status && response.data) {
  //       console.log("Stream ended successfully:", response.data);
  //       setStreamSummary(response.data);

  //       // Stop Ant Media publishing
  //       if (webRTCAdaptorRef.current) {
  //         webRTCAdaptorRef.current.stop(streamId);
  //         webRTCAdaptorRef.current.closeWebSocket();
  //       }

  //       // Stop local media
  //       if (localStream) {
  //         localStream.getTracks().forEach((track) => {
  //           track.stop();
  //         });
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = null;
  //         }
  //         setLocalStream(null);
  //       }

  //       // Notify viewers via WebSocket
  //       if (
  //         websocketRef.current &&
  //         websocketRef.current.readyState === WebSocket.OPEN
  //       ) {
  //         websocketRef.current.send(
  //           JSON.stringify({
  //             type: "stream_ended",
  //             stream_id: streamId,
  //             message: "Host has ended the live stream",
  //             ended_at: new Date().toISOString(),
  //           })
  //         );

  //         await new Promise((resolve) => setTimeout(resolve, 1000));
  //       }

  //       // Close WebSocket
  //       if (websocketRef.current) {
  //         websocketRef.current.close();
  //         websocketRef.current = null;
  //       }

  //       setStreamState("setup");
  //       setStreamDuration(0);

  //       // Clear localStorage
  //       localStorage.removeItem("active_livestream");

  //       // Show summary dialog
  //       setShowSummaryDialog(true);
  //     } else {
  //       toast.error(response.message || "Failed to end stream");
  //     }
  //   } catch (error) {
  //     console.error("Error ending stream:", error);
  //     toast.error("Failed to end stream");
  //   } finally {
  //     setIsEndingStream(false);
  //   }
  // };

  const handleConfirmEndSession = async () => {
    setShowEndDialog(false);
    setIsEndingStream(true);

    try {
      const streamUuid = streamData?.uuid;
      const streamId =
        streamData?.livestream_room_stream_id || streamData?.stream_id;

      // FIRST: Notify viewers via WebSocket BEFORE doing anything else
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        console.log("Sending stream_ended message to viewers");
        websocketRef.current.send(
          JSON.stringify({
            type: "stream_ended",
            stream_uuid: streamUuid,
            stream_id: streamId,
            message: "The host has ended this live stream",
            ended_at: new Date().toISOString(),
          })
        );

        // ✅ Wait to ensure message is sent before closing
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Now end the stream via API
      const response = await endLivestream(streamUuid);

      if (response.status && response.data) {
        console.log("Stream ended successfully:", response.data);
        setStreamSummary(response.data);

        // Stop Ant Media publishing
        if (webRTCAdaptorRef.current) {
          webRTCAdaptorRef.current.stop(streamId);
          webRTCAdaptorRef.current.closeWebSocket();
        }

        // Stop local media
        if (localStream) {
          localStream.getTracks().forEach((track) => {
            track.stop();
          });
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
          setLocalStream(null);
        }

        setStreamState("setup");
        setStreamDuration(0);

        // Clear localStorage
        localStorage.removeItem("active_livestream");

        // ✅ Close WebSocket AFTER everything is done
        if (websocketRef.current) {
          websocketRef.current.close();
          websocketRef.current = null;
        }

        // Show summary dialog
        setShowSummaryDialog(true);
      } else {
        toast.error(response.message || "Failed to end stream");
      }
    } catch (error) {
      console.error("Error ending stream:", error);
      toast.error("Failed to end stream");
    } finally {
      setIsEndingStream(false);
    }
  };

  // Handle discard button click
  const handleDiscardClick = () => {
    setShowSummaryDialog(false);
    setShowDiscardDialog(true);
  };

  // Confirm discard
  const handleConfirmDiscard = () => {
    setShowDiscardDialog(false);
    router.push("/dashboard/live-streams");
  };

  // Save to posts
  const handleSaveToposts = async () => {
    try {
      const roomId = streamData?.livestream_room_id;
      const response = await saveStreamToPosts(roomId);

      if (response.status) {
        setShowSummaryDialog(false);
        setShowSuccessDialog(true);
      } else {
        toast.error(response.message || "Failed to save stream");
      }
    } catch (error) {
      console.error("Error saving stream:", error);
      toast.error("Failed to save stream");
    }
  };

  // After success dialog
  const handleSuccessOkay = () => {
    setShowSuccessDialog(false);
    router.push("/dashboard/live-streams");
  };

  // Chat functions
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: {
          name: streamData?.host?.name || "Host",
          avatar: streamData?.host?.profile_picture || "/images/vs-logo.webp",
        },
        message: newComment,
        timestamp: Date.now(),
      };

      // Add to local state immediately for instant feedback
      setComments((prev) => [...prev, comment]);
      setNewComment("");

      // Send to WebSocket server for broadcast to viewers
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        websocketRef.current.send(
          JSON.stringify({
            type: "comment",
            stream_id: streamData?.stream_id,
            user_id: streamData?.host?.id || "host",
            username: streamData?.host?.username || "host",
            message: comment.message,
            timestamp: comment.timestamp,
          })
        );
      } else {
        console.warn("WebSocket not connected. Message not sent to server.");
      }
    }
  };

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "now";
    return `${minutes}m`;
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">
          {streamData?.title ||
            "Behind the Scenes: Exclusive Live Tour | Live Discussion"}
        </p>
      </div>

      <div className="grid grid-cols-8 gap-x-4">
        {/* Left Column: Video Preview/Stream */}
        <div className="col-span-6 gap-y-4 flex flex-col">
          <div className="w-full h-[66dvh] relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
            {/* Live Badge - only show when live */}
            {streamState === "live" && (
              <div className="absolute top-4 left-4 z-30 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Live
              </div>
            )}

            {/* Viewer Count - when live */}
            {streamState === "live" && (
              <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-x-1">
                <CgEye /> {viewerCount}
              </div>
            )}

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
              muted={streamState !== "live" || isMuted}
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
                {/* Stream Control */}

                {streamState === "live" && (
                  <div className="flex items-center gap-x-2">
                    <span className="text-white text-sm font-medium">
                      {formatDuration(streamDuration)}
                    </span>
                    <Button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                      size="sm"
                    >
                      {isMuted ? (
                        <FaVolumeMute className="size-4" />
                      ) : (
                        <FaVolumeUp className="size-4" />
                      )}
                    </Button>
                  </div>
                )}

                {/* Media Toggles - always available for host */}
                {isHost && (
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
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Host Info and Actions */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-x-3">
              <CustomAvatar
                src={
                  streamData?.host?.profile_picture || "/images/vs-logo.webp"
                }
                className="border-2 size-[52px]"
                name={streamData?.host?.name || "Michael Jordan"}
              />
              <div className="flex flex-col">
                <span className="flex items-center gap-x-2">
                  <p className="font-semibold">
                    {streamData?.host?.name || "Michael Jordan"}
                  </p>
                  {/* <HiMiniCheckBadge className="size-5 text-green-600" /> */}
                </span>
                <p className="text-muted-foreground text-sm">
                  @{streamData?.host?.username || "michael_jorddd"}
                </p>
              </div>
            </div>

            {/* Host Actions Menu */}
            {isHost && streamState === "live" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 p-0">
                    <FaEllipsisH className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 w-[350px] place-items-center text-center"
                  side="top"
                  align="end"
                >
                  <div className="p-4 cursor-pointer hover:bg-accent">
                    Add Cohost
                  </div>
                  <Separator />
                  <div className="p-4 cursor-pointer hover:bg-accent">
                    Turn Off Commenting
                  </div>
                  <Separator />
                  <div className="p-4 cursor-pointer hover:bg-accent">
                    Turn Off Questions
                  </div>
                  <Separator />
                  <div
                    className="p-4 text-red-500 font-semibold cursor-pointer hover:bg-red-50"
                    onClick={handleEndSessionClick}
                  >
                    End Session
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Featured Lives */}
          <div className="flex flex-col mt-4 gap-y-4">
            <p className="font-semibold">Featured Lives</p>
            <div className="grid lg:grid-cols-4 gap-4">
              {featuredLivestreams
                ?.slice(0, 4)
                .map((featuredLivestreamData) => (
                  <div key={featuredLivestreamData.uuid}>
                    <LiveFeaturedPreviewCard
                      featuredLivestreamData={featuredLivestreamData}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Chat/Setup Panel */}
        <div className="flex flex-col col-span-2 w-full gap-y-4">
          <div className="flex flex-col rounded-xl border w-full h-[66dvh] relative">
            {/* Setup State */}
            {streamState === "setup" && (
              <>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <p className="font-semibold text-gray-600 mb-2">
                      Comments will appear here once the
                    </p>
                    <p className="font-semibold text-gray-600 mb-4">
                      live session begins.
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 w-full p-4">
                  <SponsorCard sponsorType="liveStream" />
                </div>
              </>
            )}

            {/* Live State - Show Chat */}
            {streamState === "live" && (
              <>
                {/* Info Banner */}
                <div className="p-4 bg-blue-500/10 border-b">
                  <div className="flex items-start gap-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm text-blue-600 font-medium">
                      Your video streaming is live now. You can add co-host and
                      invite others to join this live streaming.
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {comments.map((comment) => (
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
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatTimestamp(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm break-words leading-relaxed">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleCommentSubmit} className="space-y-3">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add comment..."
                      className="w-full"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-x-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="p-2 w-8 h-8"
                        >
                          <VSChatAsk className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="p-2 w-8 h-8"
                        >
                          <FaUserPlus className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="p-2 w-8 h-8"
                        >
                          <BiSolidGift className="size-4" />
                        </Button>
                      </div>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for potential video processing */}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={1920}
        height={1080}
      />

      {/* End Session Confirmation Dialog */}
      <LiveStreamDialog
        open={showEndDialog}
        onOpenChange={setShowEndDialog}
        trigger={<span />} // Empty trigger since we control it with state
        title="End Session?"
        contentClassName="max-w-md h-auto"
        footer={
          <div className="flex gap-x-3">
            <Button
              onClick={() => setShowEndDialog(false)}
              variant="outline"
              className="flex-1"
              disabled={isEndingStream}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmEndSession}
              className="flex-1 bg-white text-black hover:bg-gray-200"
              disabled={isEndingStream}
            >
              {isEndingStream ? "Ending..." : "Yes, End"}
            </Button>
          </div>
        }
      >
        <p className="text-center py-6">
          Are you sure you want to end this live stream?
        </p>
      </LiveStreamDialog>

      {/* Stream Summary Dialog */}
      {showSummaryDialog && streamSummary && (
        <LiveStreamDialog
          trigger={<span />}
          open={showSummaryDialog}
          onOpenChange={setShowSummaryDialog}
          title="Save Live Stream"
          contentClassName="max-w-md h-auto"
          footer={
            <div className="flex gap-x-3">
              <Button
                onClick={handleDiscardClick}
                variant="outline"
                className="flex-1"
              >
                Discard
              </Button>
              <Button
                onClick={handleSaveToposts}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save To Posts
              </Button>
            </div>
          }
        >
          <div className="py-4">
            <div className="flex justify-center my-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-center mb-2">
              Live Stream Ended
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-6">
              Your live stream has ended. Check the summary for user attendance,
              duration, and gifts received.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-x-2 text-muted-foreground">
                  <span>⏱️</span>
                  <span>Live Stream Duration:</span>
                </div>
                <span className="font-semibold">
                  {streamSummary.livestream_duration}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-x-2 text-muted-foreground">
                  <span>👥</span>
                  <span>Attended Users:</span>
                </div>
                <span className="font-semibold">
                  {streamSummary.livestream_users}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-x-2 text-muted-foreground">
                  <span>🎁</span>
                  <span>Gifts Received:</span>
                </div>
                <span className="font-semibold">
                  {streamSummary.gifts_received}
                </span>
              </div>
            </div>
          </div>
        </LiveStreamDialog>
      )}

      {/* Discard Confirmation Dialog */}
      {showDiscardDialog && (
        <LiveStreamDialog
          open={showDiscardDialog}
          onOpenChange={setShowDiscardDialog}
          trigger={<span />}
          title="Discard Live Stream?"
          contentClassName="max-w-md h-auto"
          footer={
            <div className="flex gap-x-3">
              <Button
                onClick={() => setShowDiscardDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDiscard}
                className="flex-1 bg-white text-black hover:bg-gray-200"
              >
                Yes, Discard
              </Button>
            </div>
          }
        >
          <p className="text-center py-6">
            Are you sure you want to discard this live stream?
          </p>
        </LiveStreamDialog>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <LiveStreamDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          trigger={<span />}
          title={null}
          contentClassName="max-w-md h-auto"
          removeFooterBorder
          footer={
            <Button
              onClick={handleSuccessOkay}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              Okay
            </Button>
          }
        >
          <div className="py-4">
            <div className="flex justify-center my-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center relative">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {/* Decorative dots */}
                <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-300 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-300 rounded-full"></div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-center mb-2">
              Live Stream Saved Successfully!
            </h2>
            <p className="text-muted-foreground text-sm text-center">
              Your live stream has been successfully saved to your posts.
            </p>
          </div>
        </LiveStreamDialog>
      )}
    </div>
  );
};

export default StreamHostSetup;

// const testWs = new WebSocket("wss://origin-streaming-server.villagesquare.io/Livestream/websocket");
// testWs.onopen = () => console.log("WORKS!");
// testWs.onerror = (e) => console.error("FAILED:", e);
// testWs.onclose = (e) => console.log("CLOSED. Code:", e.code);
