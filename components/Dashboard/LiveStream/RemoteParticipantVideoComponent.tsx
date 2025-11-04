'use client';

import { useEffect, useState, useRef } from 'react';

interface RemoteParticipantVideoComponentProps {
  videoTrack: MediaStreamTrack;
  streamIdProp: string;
}

export default function RemoteParticipantVideoComponent({
  videoTrack,
  streamIdProp
}: RemoteParticipantVideoComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [streamId, setStreamId] = useState<string>("");

  useEffect(() => {
    if (videoTrack && videoRef.current) {
      const newStream = new MediaStream();
      newStream.addTrack(videoTrack);
      videoRef.current.srcObject = newStream;
      setVideoStream(newStream);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      // if (videoStream) {
      //   videoStream.getTracks().forEach((track) => track.stop());
      // }
    }
  }, [videoTrack]);

  useEffect(() => {
    setStreamId(streamIdProp);
  }, [streamIdProp]);

  return (
    <div className="flex flex-col items-center relative bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        id='remoteVideo'
        className="w-full h-full object-cover"
        controls
        autoPlay
        playsInline
      />
      <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-sm font-semibold">
        {streamId || "Remote Participant"}
      </div>
    </div>
  );
}