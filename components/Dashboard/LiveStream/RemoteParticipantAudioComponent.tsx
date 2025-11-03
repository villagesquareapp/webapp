import { useEffect, useRef, useState } from 'react';

interface RemoteParticipantAudioComponentProps {
  audioTrack: MediaStreamTrack;
}

export default function RemoteParticipantAudioComponent({
  audioTrack,
}: RemoteParticipantAudioComponentProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (audioTrack && videoRef.current) {
      const newStream = new MediaStream();
      newStream.addTrack(audioTrack);
      videoRef.current.srcObject = newStream;
      setAudioStream(newStream);
    }
  }, [audioTrack]);

  

  return (
    <div style={{display: 'none'}} className="flex flex-col items-center relative bg-gray-900 rounded-lg overflow-hidden">
      <video ref={videoRef} autoPlay playsInline controls id='remoteVideo' />
      {/* <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-sm font-semibold">
        {'Remote Participant'}
      </div> */}
    </div>
  );
}

