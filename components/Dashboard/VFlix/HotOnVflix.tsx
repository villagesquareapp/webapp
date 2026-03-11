"use client";

import { useState, useEffect } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Heart } from "lucide-react";
import { IoStatsChart } from "react-icons/io5";
import { PiHeartFill } from "react-icons/pi";

interface HotOnVflixProps {
  videos: IVflix[];
}

const HotOnVflix = ({ videos }: HotOnVflixProps) => {
  const hotVideos = videos.slice(0, 4);

  if (hotVideos.length === 0) return null;

  return (
    <div className="w-[160px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">🔥</span>
        <h3 className="text-[15px] font-bold text-white">Hot on VFlix</h3>
      </div>

      {/* Video Cards */}
      <div className="flex flex-col gap-4">
        {hotVideos.map((video) => {
          const thumbnail =
            video.media?.media_thumbnail || video.media?.media_url || "";
          const userName = video.user?.name || "Unknown";
          const userAvatar = video.user?.profile_picture || "";
          const caption = video.caption || "";
          const likes = video.likes_count || "0";
          const views = video.views_count || "0";
          const date = video.formatted_date || "";

          return (
            <div
              key={video.uuid}
              className="relative w-full rounded-2xl overflow-hidden bg-black/20 cursor-pointer group"
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

                {/* User avatar overlay top-right */}
                {/* <div className="absolute top-2 right-2">
                                    <CustomAvatar
                                        src={userAvatar}
                                        name={userName}
                                        className="size-8 border-2 border-background"
                                    />
                                </div> */}

                {/* Bottom overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
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
                    <p className="text-[11px] text-white/80 line-clamp-1 mb-1">
                      {caption}
                    </p>
                    <p className="text-[10px] text-white/50">{date}</p>
                  </div>
                  {/* Stats row */}
                  <div className="flex items-center justify-between gap-4 px-3 py-">
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
