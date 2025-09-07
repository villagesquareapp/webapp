import { Button } from "components/ui/button";
import { useEffect, useState, useRef } from "react";
import { CgEyeAlt } from "react-icons/cg";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import ReactPlayer from "react-player";
import { set } from "zod";

const PostVideo = ({
  src,
  media,
  showEchoButtons,
  isPlayingVideo,
  setIsPlayingVideo,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  className = "",
  isGloballyMuted,
  setGlobalMuteState,
}: {
  media: IPostMedia;
  src: string;
  currentVideoPlaying: string;
  setCurrentVideoPlaying: (mediaID: string) => void;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (playing: boolean) => void;
  showEchoButtons?: boolean;
  className?: string;
  isGloballyMuted: boolean;
  setGlobalMuteState: (muted: boolean) => void;
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Video starts loading
  const playerRef = useRef<ReactPlayer>(null);
  // Track if the user has manually paused the video
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // A single, reliable source for play/pause state for this specific video
  const isThisPlaying = currentVideoPlaying === media.uuid && isPlayingVideo;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // This video is in the viewport, so it should play
          if (!isManuallyPaused) {
            setCurrentVideoPlaying(media.uuid);
            setIsPlayingVideo(true);
          }
        } else {
          // This video is NOT in the viewport, it should be paused
          // Only pause if this video was the one currently playing
          if (currentVideoPlaying === media.uuid) {
            setCurrentVideoPlaying("");
            setIsPlayingVideo(false);
          }
        }
      },
      {
        threshold: 0.8,
      }
    );

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, [media.uuid, setCurrentVideoPlaying, setIsPlayingVideo, currentVideoPlaying]);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThisPlaying) {
      // If it's playing, clicking should pause it
      setCurrentVideoPlaying("");
      setIsPlayingVideo(false);
      setIsManuallyPaused(true); // User manually paused
    } else {
      // If it's paused, clicking should play it
      setCurrentVideoPlaying(media.uuid);
      setIsPlayingVideo(true);
      setIsManuallyPaused(false); // User manually played
    }
  };

  return (
    <div
      ref={videoRef}
      className={`w-full relative rounded-xl overflow-hidden bg-black ${className}`}
    >
      <ReactPlayer
        ref={playerRef}
        url={media.transcoded_media_url || src}
        playing={isThisPlaying}
        loop={true}
        muted={isGloballyMuted}
        width="100%"
        height="100%"
        playsinline
        light={false}
        pip={false}
        onBuffer={() => setIsLoading(true)}
        onBufferEnd={() => setIsLoading(false)}
        config={{
          file: {
            attributes: {
              playsInline: true,
              loop: true,
              style: { width: "100%", height: "100%" },
            },
            forceHLS: (media.transcoded_media_url || src)?.endsWith(".m3u8"),
            hlsOptions: {
              enableLowLatencyMode: true,
              backBufferLength: 90,
              maxBufferLength: 30,
              maxMaxBufferLength: 600,
              maxBufferSize: 60 * 1000 * 1000,
              maxBufferHole: 0.5,
              lowLatencyMode: true,
              liveDurationInfinity: true,
              liveBackBufferLength: 0,
              progressive: true,
            },
          },
        }}
      />

      {/* Loading spinner overlay */}
      {isLoading && isThisPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200">
          <ImSpinner2 className="text-white text-4xl animate-spin" />
        </div>
      )}

      {/* Play/Pause button overlay - Only show when video is NOT playing */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          isThisPlaying && !isLoading ? "opacity-0" : "opacity-100 bg-black/20"
        }`}
        onClick={handleVideoClick}
      >
        {isThisPlaying && !isLoading ? (
          <FaPause className="text-white text-4xl opacity-80" />
        ) : (
          <FaPlay className="text-white text-4xl opacity-80" />
        )}
      </div>

      {/* Mute/Unmute Button - Placed at a new location to not interfere */}
      <Button
        onClick={() => setGlobalMuteState(!isGloballyMuted)}
        className="absolute bottom-4 right-4 rounded-full p-2 z-20 bg-gray-800/50 text-white"
      >
        {isGloballyMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </Button>

      {showEchoButtons && (
        <>
          <Button className="absolute bottom-4 right-4 rounded-full text-foreground text-xs font-semibold py-1 z-10">
            Explore More Livestreams
          </Button>
          <div className="rounded-full bg-muted-foreground absolute top-4 right-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs z-10">
            <CgEyeAlt className="size-4" />
            <span className="font-semibold">107</span>
          </div>
        </>
      )}
    </div>
  );
};

export default PostVideo;

// import { Button } from "components/ui/button";
// import { useEffect, useState, useRef } from "react";
// import { CgEyeAlt } from "react-icons/cg";
// import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa"; // Import new icons
// import { ImSpinner2 } from "react-icons/im";
// import ReactPlayer from "react-player";

// const PostVideo = ({
//   src,
//   media,
//   showEchoButtons,
//   isPlayingVideo,
//   setIsPlayingVideo,
//   currentVideoPlaying,
//   setCurrentVideoPlaying,
//   className = "",
//   isGloballyMuted,
//   setGlobalMuteState,
// }: {
//   media: IPostMedia;
//   src: string;
//   currentVideoPlaying: string;
//   setCurrentVideoPlaying: (mediaID: string) => void;
//   isPlayingVideo: boolean;
//   setIsPlayingVideo: (playing: boolean) => void;
//   showEchoButtons?: boolean;
//   className?: string;
//   isGloballyMuted: boolean;
//   setGlobalMuteState: (muted: boolean) => void;
// }) => {
//   // const [isPlaying, setIsPlaying] = useState<boolean>(true);
//   const videoRef = useRef<HTMLDivElement>(null);
//   const playerRef = useRef<ReactPlayer>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const isThisPlaying = currentVideoPlaying === media.uuid && isPlayingVideo;

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const [entry] = entries;
//         if (!entry.isIntersecting && currentVideoPlaying === media.uuid) {
//           handlePause();
//           setIsPlayingVideo(false);
//           setCurrentVideoPlaying("");
//         }
//       },
//       {
//         threshold: 0.5,
//         rootMargin: "50px 0px",
//       }
//     );
//     const currentVideoRef = videoRef.current;
//     if (currentVideoRef) {
//       observer.observe(currentVideoRef);
//     }
//     return () => {
//       if (currentVideoRef) {
//         observer.unobserve(currentVideoRef);
//       }
//     };
//   }, [media.uuid, currentVideoPlaying]);

//   const handlePlay = () => {
//     // setIsPlaying(true);
//     setIsPlayingVideo(true);
//     setCurrentVideoPlaying(media.uuid);
//   };

//   const handlePause = () => {
//     // setIsPlaying(false);
//     setIsPlayingVideo(false);
//     setCurrentVideoPlaying("");
//   };

//   const handleVideoClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (currentVideoPlaying === media.uuid && isPlayingVideo) {
//       // handlePause();
//       setIsPlayingVideo(false);
//       setCurrentVideoPlaying("");
//     } else {
//       // handlePlay();
//       setIsPlayingVideo(true);
//       setCurrentVideoPlaying(media.uuid);
//     }
//   };

//   // When currentVideoPlaying changes, pause this video if it's not the current one
//   useEffect(() => {
//     if (currentVideoPlaying !== media.uuid && isPlayingVideo) {
//       handlePause();
//       setIsPlayingVideo(false);
//     }
//   }, [currentVideoPlaying, media.uuid, isPlayingVideo]); // Added isPlaying dependency

//   return (
//     <div
//       ref={videoRef}
//       className={`w-full relative rounded-xl overflow-hidden bg-black ${className}`}
//     >
//       <ReactPlayer
//         ref={playerRef}
//         url={media.transcoded_media_url || src}
//         playing={currentVideoPlaying === media.uuid && isPlayingVideo}
//         loop={true}
//         muted={isGloballyMuted}
//         // controls={true}
//         width="100%"
//         height="100%"
//         playsinline
//         light={false}
//         pip={false}
//         onBuffer={() => setIsLoading(true)}
//         onBufferEnd={() => setIsLoading(false)}
//         config={{
//           file: {
//             attributes: {
//               playsInline: true,
//               // muted: true, // You can leave this as true for initial load, or match the state
//               // autoPlay: true,
//               loop: true,
//               style: { width: "100%", height: "100%" },
//             },
//             forceHLS: (media.transcoded_media_url || src)?.endsWith(".m3u8"),
//             hlsOptions: {
//               enableLowLatencyMode: true,
//               backBufferLength: 90,
//               maxBufferLength: 30,
//               maxMaxBufferLength: 600,
//               maxBufferSize: 60 * 1000 * 1000,
//               maxBufferHole: 0.5,
//               lowLatencyMode: true,
//               liveDurationInfinity: true,
//               liveBackBufferLength: 0,
//               progressive: true,
//             },
//           },
//         }}
//       />

//       {isLoading && currentVideoPlaying === media.uuid && isPlayingVideo && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200">
//           <ImSpinner2 className="text-white text-4xl animate-spin" />
//         </div>
//       )}

//       <div
//         className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
//           currentVideoPlaying === media.uuid
//             ? "opacity-0"
//             : "opacity-100 bg-black/20"
//         }`}
//         onClick={handleVideoClick}
//       >
//         {isThisPlaying ? (
//           <FaPause className="text-white text-4xl opacity-80" />
//         ) : (
//           <FaPlay className="text-white text-4xl opacity-80" />
//         )}{" "}
//       </div>

//       {/* Mute/Unmute Button - Placed at a new location to not interfere */}
//       <Button
//         onClick={() => setGlobalMuteState(!isGloballyMuted)}
//         className="absolute bottom-4 right-4 rounded-full p-2 z-20 bg-gray-800/50 text-white"
//       >
//         {isGloballyMuted ? <FaVolumeMute /> : <FaVolumeUp />}
//       </Button>

//       {showEchoButtons && (
//         <>
//           <Button className="absolute bottom-4 right-4 rounded-full text-foreground text-xs font-semibold py-1 z-10">
//             Explore More Livestreams
//           </Button>
//           <div className="rounded-full bg-muted-foreground absolute top-4 right-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs z-10">
//             <CgEyeAlt className="size-4" />
//             <span className="font-semibold">107</span>
//           </div>
//           {/* <div className="rounded-full bg-red-600 absolute top-4 left-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs z-10">
//             <div className="flex items-center gap-x-[2px] h-[12px]">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className={`w-[3px] bg-white rounded-full h-[4px] ${
//                     isPlaying ? `animate-wave-${i}` : ""
//                   }`}
//                   style={{
//                     animationDelay: `${(i - 1) * 0.2}s`,
//                   }}
//                 />
//               ))}
//             </div>
//           </div> */}
//         </>
//       )}
//     </div>
//   );
// };

// export default PostVideo;

// import { Button } from "components/ui/button";
// import { useEffect, useState, useRef } from "react";
// import { CgEyeAlt } from "react-icons/cg";
// import { FaPlay, FaPause } from "react-icons/fa";
// import ReactPlayer from "react-player";

// const PostVideo = ({
//   src,
//   media,
//   showEchoButtons = true,
//   isPlayingVideo,
//   setIsPlayingVideo,
//   currentVideoPlaying,
//   setCurrentVideoPlaying,
//   className = "",
// }: {
//   media: IPostMedia;
//   src: string;
//   currentVideoPlaying: string;
//   setCurrentVideoPlaying: (mediaID: string) => void;
//   isPlayingVideo: boolean;
//   setIsPlayingVideo: (playing: boolean) => void;
//   showEchoButtons?: boolean;
//   className?: string;
// }) => {
//   const [isPlaying, setIsPlaying] = useState<boolean>(true);
//   const videoRef = useRef<HTMLDivElement>(null);
//   const playerRef = useRef<ReactPlayer>(null);

//   // Set up intersection observer to detect when video is in viewport
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const [entry] = entries;
//         // If the video is no longer visible, pause it.
//         // This is the key change: we check for visibility and update the isPlaying state.
//         if (!entry.isIntersecting && isPlaying) {
//           handlePause();
//         } else if (entry.isIntersecting && !isPlaying && currentVideoPlaying === media.uuid) {
//           // Optional: If the video comes back into view and it's the current one,
//           // you could potentially resume playing here, though the current logic handles it well.
//         }
//       },
//       {
//         threshold: 0.5, // 50% of the video must be visible
//         rootMargin: "50px 0px", // Add some margin to pre-load/pause
//       }
//     );
//     const currentVideoRef = videoRef.current;
//     if (currentVideoRef) {
//       observer.observe(currentVideoRef);
//     }
//     return () => {
//       if (currentVideoRef) {
//         observer.unobserve(currentVideoRef);
//       }
//     };
//   }, [media.uuid, isPlaying, currentVideoPlaying]); // Added currentVideoPlaying to dependencies

//   // Handle play state
//   const handlePlay = () => {
//     setIsPlaying(true);
//     setIsPlayingVideo(true);
//     setCurrentVideoPlaying(media.uuid);
//   };

//   // Handle pause state
//   const handlePause = () => {
//     setIsPlaying(false);
//     setIsPlayingVideo(false);
//     setCurrentVideoPlaying("");
//   };

//   // Handle user click to play/pause
//   const handleVideoClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (isPlaying) {
//       handlePause();
//     } else {
//       handlePlay();
//     }
//   };

//   // When currentVideoPlaying changes, pause this video if it's not the current one
//   useEffect(() => {
//     if (currentVideoPlaying !== media.uuid && isPlaying) {
//       handlePause();
//     }
//   }, [currentVideoPlaying, media.uuid]);

//   return (
//     <div
//       ref={videoRef}
//       className={`w-full relative rounded-xl overflow-hidden bg-black ${className}`}
//     >
//       {/* ReactPlayer - base layer */}
//       <ReactPlayer
//         ref={playerRef}
//         url={media.transcoded_media_url || src}
//         playing={isPlaying} // The key fix: use the isPlaying state here
//         loop={true}
//         muted={true}
//         controls={true}
//         width="100%"
//         height="100%"
//         playsinline
//         light={false}
//         pip={false}
//         config={{
//           file: {
//             attributes: {
//               playsInline: true,
//               muted: true,
//               autoPlay: true,
//               loop: true,
//               style: { width: "100%", height: "100%" },
//             },
//             forceHLS: (media.transcoded_media_url || src)?.endsWith(".m3u8"),
//             hlsOptions: {
//               enableLowLatencyMode: true,
//               backBufferLength: 90,
//               maxBufferLength: 30,
//               maxMaxBufferLength: 600,
//               maxBufferSize: 60 * 1000 * 1000,
//               maxBufferHole: 0.5,
//               lowLatencyMode: true,
//               liveDurationInfinity: true,
//               liveBackBufferLength: 0,
//               progressive: true,
//             },
//           },
//         }}
//       />

//       {/* Play/Pause overlay - excluding bottom control area */}
//       <div
//         className={`absolute inset-x-0 top-0 bottom-[45px] flex items-center justify-center bg-black/20 transition-opacity duration-200 ${
//           isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
//         }`}
//         onClick={handleVideoClick}
//       >
//         {isPlaying ? (
//           <FaPause className="text-white text-4xl opacity-80" />
//         ) : (
//           <FaPlay className="text-white text-4xl opacity-80" />
//         )}
//       </div>

//       {showEchoButtons && (
//         <>
//           <Button className="absolute bottom-4 right-4 rounded-full text-foreground text-xs font-semibold py-1 z-10">
//             Explore More Livestreams
//           </Button>
//           <div className="rounded-full bg-muted-foreground absolute top-4 right-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs z-10">
//             <CgEyeAlt className="size-4" />
//             <span className="font-semibold">107</span>
//           </div>
//           {/* Echo - For sound wave */}
//           <div className="rounded-full bg-red-600 absolute top-4 left-4 px-2 py-1 flex flex-row items-center gap-x-1 text-xs z-10">
//             <div className="flex items-center gap-x-[2px] h-[12px]">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className={`w-[3px] bg-white rounded-full h-[4px] ${
//                     isPlaying ? `animate-wave-${i}` : ""
//                   }`}
//                   style={{
//                     animationDelay: `${(i - 1) * 0.2}s`,
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PostVideo;
