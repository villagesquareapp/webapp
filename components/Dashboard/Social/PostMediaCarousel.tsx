"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import PostVideo from "./PostVideo";
import MediaViewerModal from "./MediaViewerModal";

interface Props {
    media: IPostMedia[];
    currentVideoPlaying: string;
    setCurrentVideoPlaying: (id: string) => void;
    isPlayingVideo: boolean;
    setIsPlayingVideo: (playing: boolean) => void;
}

export default function PostMediaCarousel({
    media,
    currentVideoPlaying,
    setCurrentVideoPlaying,
    isPlayingVideo,
    setIsPlayingVideo,
}: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const hasMultiple = media.length > 1;

    const goNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => Math.min(prev + 1, media.length - 1));
    };

    const goPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const openViewer = (index: number) => {
        // Only open viewer for images, not videos
        if (media[index].media_type !== "video") {
            setViewerIndex(index);
            setViewerOpen(true);
        }
    };

    const currentMedia = media[currentIndex];

    return (
        <>
            <div className="relative w-full rounded-xl overflow-hidden bg-black/5 dark:bg-black/20">
                {/* Media display — constrained height */}
                <div className="relative w-full max-h-[500px] overflow-hidden">
                    {currentMedia.media_type === "video" ? (
                        <PostVideo
                            media={currentMedia}
                            src={currentMedia.transcoded_media_url || currentMedia.media_url}
                            currentVideoPlaying={currentVideoPlaying}
                            setCurrentVideoPlaying={setCurrentVideoPlaying}
                            isPlayingVideo={isPlayingVideo}
                            setIsPlayingVideo={setIsPlayingVideo}
                            isGloballyMuted={isMuted}
                            setGlobalMuteState={setIsMuted}
                            className="w-full max-h-[500px] aspect-[4/5]"
                        />
                    ) : (
                        <div
                            className="cursor-pointer"
                            onClick={() => openViewer(currentIndex)}
                        >
                            <Image
                                src={currentMedia.transcoded_media_url || currentMedia.media_url}
                                alt="post media"
                                width={800}
                                height={600}
                                className="w-full max-h-[500px] object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Prev/Next arrows — only for multiple media */}
                {hasMultiple && currentIndex > 0 && (
                    <button
                        onClick={goPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
                    >
                        <ChevronLeft className="size-5 text-white" />
                    </button>
                )}
                {hasMultiple && currentIndex < media.length - 1 && (
                    <button
                        onClick={goNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
                    >
                        <ChevronRight className="size-5 text-white" />
                    </button>
                )}
            </div>

            {/* Dot indicators — below the media */}
            {hasMultiple && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                    {media.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`rounded-full transition-all ${
                                i === currentIndex
                                    ? "size-2 bg-[#0D52D2]"
                                    : "size-1.5 bg-muted-foreground/40"
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Full-screen image viewer modal */}
            <MediaViewerModal
                open={viewerOpen}
                onClose={() => setViewerOpen(false)}
                media={media}
                initialIndex={viewerIndex}
            />
        </>
    );
}
