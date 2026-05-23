"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface Props {
    open: boolean;
    onClose: () => void;
    media: IPostMedia[];
    initialIndex: number;
}

export default function MediaViewerModal({ open, onClose, media, initialIndex }: Props) {
    const [index, setIndex] = useState(initialIndex);

    useEffect(() => {
        if (open) setIndex(initialIndex);
    }, [open, initialIndex]);

    // Keyboard navigation
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") setIndex((prev) => Math.max(0, prev - 1));
            if (e.key === "ArrowRight") setIndex((prev) => Math.min(media.length - 1, prev + 1));
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, media.length, onClose]);

    if (!open) return null;

    const current = media[index];
    const hasMultiple = media.length > 1;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
                <X className="size-5 text-white" />
            </button>

            {/* Image */}
            <div
                className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {current.media_type === "video" ? (
                    <video
                        src={current.transcoded_media_url || current.media_url}
                        className="max-w-full max-h-[85vh] rounded-lg"
                        controls
                        autoPlay
                    />
                ) : (
                    <Image
                        src={current.transcoded_media_url || current.media_url}
                        alt="media"
                        width={1200}
                        height={900}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg"
                    />
                )}
            </div>

            {/* Prev/Next */}
            {hasMultiple && index > 0 && (
                <button
                    onClick={(e) => { e.stopPropagation(); setIndex((prev) => prev - 1); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <ChevronLeft className="size-6 text-white" />
                </button>
            )}
            {hasMultiple && index < media.length - 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); setIndex((prev) => prev + 1); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <ChevronRight className="size-6 text-white" />
                </button>
            )}

            {/* Dots */}
            {hasMultiple && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {media.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                            className={`rounded-full transition-all ${
                                i === index ? "size-2.5 bg-white" : "size-2 bg-white/40"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
