"use client";

import { useState, useEffect } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Heart } from "lucide-react";
import { IoStatsChart } from "react-icons/io5";
import { PiHeartFill } from "react-icons/pi";

interface HotOnVflixProps {
  onVideoSelect: (video: IVflix) => void;
}

const HotOnVflix = ({ onVideoSelect }: HotOnVflixProps) => {
  const [hotVideos, setHotVideos] = useState<IVflix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotVideos = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/vflix?mode=hot");
        const response = await res.json();
        if (response?.status) {
          // The endpoint might return the array directly or in a paginated structure
          const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
          const slicedVideos = data.slice(0, 5);
          setHotVideos(slicedVideos);

          // Track impressions for the displayed hot videos
          if (slicedVideos.length > 0) {
            const videoIds = slicedVideos.map((v: IVflix) => v.uuid);
            fetch("/api/vflix/hot/impression", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ videoIds }),
            }).catch((err) => console.error("Failed to track hot vflix impression:", err));
          }
        }
      } catch (error) {
        console.error("Failed to fetch hot videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotVideos();
  }, []);

  if (loading) {
    return (
      <div className="w-[160px]">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">🔥</span>
          <h3 className="text-[15px] font-bold text-foreground">Hot on VFlix</h3>
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black/20">
              <div className="w-full h-full animate-pulse bg-white/5" />
              <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-white/10 animate-pulse" />
                  <div className="h-3 w-16 bg-white/10 animate-pulse rounded" />
                </div>
                <div className="h-2 w-full bg-white/10 animate-pulse rounded" />
                <div className="h-2 w-1/2 bg-white/10 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hotVideos.length === 0) return null;

  return (
    <div className="w-[160px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🔥</span>
        <h3 className="text-[15px] font-bold text-foreground">Hot on VFlix</h3>
      </div>

      {/* Video Cards */}
      <div className="flex flex-col gap-1">
        {hotVideos.map((video) => {
          const mediaItem = Array.isArray(video.media) ? video.media[0] : video.media;
          const thumbnail =
            mediaItem?.thumbnail || mediaItem?.media_thumbnail || mediaItem?.media_url || "";
          const userName = video.user?.name || "Unknown";
          const userAvatar = video.user?.profile_picture || "";
          const caption = video.caption || "";
          const likes = video.likes_count || "0";
          const views = video.views_count || "0";
          // const date = video.formatted_date || "";

          return (
            <div
              key={video.uuid}
              onClick={() => onVideoSelect(video)}
              className="relative w-full rounded-xl overflow-hidden bg-black/20 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-[200px]">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Bottom overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CustomAvatar
                        src={userAvatar}
                        name={userName}
                        className="size-6 border-none"
                      />
                      <span className="text-[13px] font-semibold text-white truncate">
                        {userName}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/80 line-clamp-1 mb-0">
                      {caption}
                    </p>
                    {/* <p className="text-[10px] text-white/50">{date}</p> */}
                  </div>
                  {/* Stats row */}
                  <div className="flex items-center justify-between gap-4 p-0">
                    <div className="flex items-center gap-1.5">
                      <PiHeartFill size={13} className="" />
                      <span className="text-[12px] text-white font-medium">
                        {formatCount(likes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IoStatsChart size={13} className="text-white" />
                      <span className="text-[12px] text-white font-medium">
                        {formatCount(views)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function formatCount(count: string | number): string {
  const num = typeof count === "string" ? parseInt(count, 10) : count;
  if (isNaN(num)) return "0";
  if (num >= 1000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

export default HotOnVflix;
