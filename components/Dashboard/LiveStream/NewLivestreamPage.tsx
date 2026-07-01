"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import NotFoundResult from "../Reusable/NotFoundResult";
import { getFeaturedLivestreams } from "api/livestreams";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { useDataCache } from "context/DataCacheContext";
import { FaVideo } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import GoLiveSetupModal from "./GoLiveSetupModal";

const CATEGORIES = [
  "Popular",
  "Sports",
  "Music",
  "Comedy",
  "Lifestyle",
  "Tech",
  "Education",
  "Entertainment",
  "Finance",
];

const NewLivestreamPage = () => {
  const { getCachedData, setCachedData, isCacheValid } = useDataCache();
  const [liveStreams, setLiveStreams] = useState<IFeaturedLivestream[]>([]);
  const [featuredStreams, setFeaturedStreams] = useState<IFeaturedLivestream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);

  useEffect(() => {
    const cacheKey = "livestreams-explore-new";
    const cached = getCachedData<{ featured: IFeaturedLivestream[]; streams: IFeaturedLivestream[] }>(cacheKey);
    if (cached && isCacheValid(cacheKey, 5)) {
      setFeaturedStreams(cached.featured);
      setLiveStreams(cached.streams);
      setIsLoading(false);
      return;
    }

    const fetchLivestreams = async () => {
      setIsLoading(true);
      try {
        const response = await getFeaturedLivestreams(20);
        if (response.status && response.data) {
          const allStreams = (response.data.data as IFeaturedLivestream[]) || [];
          const featured = allStreams.slice(0, 3);
          const streams = allStreams.slice(3);
          setFeaturedStreams(featured);
          setLiveStreams(streams);
          setCachedData(cacheKey, { featured, streams });
        } else {
          toast.error(response.message || "Failed to fetch livestreams.");
        }
      } catch (error) {
        console.error("Fetch error", error);
        toast.error("An error occurred while fetching livestreams.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLivestreams();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  const hasContent = featuredStreams.length > 0 || liveStreams.length > 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Featured Livestream</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.location.href = "/livestream/summary"}
            variant="outline"
            className="border-white/10 text-white/70 rounded-full px-4 h-9 text-sm font-medium"
          >
            View Summary
          </Button>
          <Button
            onClick={() => setIsGoLiveOpen(true)}
            className="bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white rounded-full px-5 h-9 text-sm font-medium flex items-center gap-2"
          >
            <FaVideo className="size-3.5" />
            Go Live
          </Button>
        </div>
      </div>

      {!hasContent && (
        <div className="flex justify-center items-center flex-1">
          <NotFoundResult
            title="No livestreams available"
            content={
              <p className="text-center">
                Go Live to connect and engage with your <br /> audience!
              </p>
            }
          />
        </div>
      )}

      {hasContent && (
        <>
          {/* Featured Section — Hero layout */}
          {featuredStreams.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6 h-[280px]">
              {/* Main featured (large left) */}
              <Link
                href={`/livestream/${featuredStreams[0].uuid}`}
                className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group"
              >
                <Image
                  src={featuredStreams[0].cover || "/images/beautiful-image.webp"}
                  alt={featuredStreams[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Host info */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <CustomAvatar
                    src={featuredStreams[0].host?.profile_picture || ""}
                    name={featuredStreams[0].host?.name || ""}
                    className="size-9 border-2 border-white/30"
                  />
                  <div>
                    <p className="text-white text-sm font-semibold">{featuredStreams[0].host?.username}</p>
                    {/* <p className="text-white/70 text-xs">{formatFollowers(featuredStreams[0].host?.)} Followers</p> */}
                  </div>
                </div>
                {/* Live badge */}
                <span className="absolute top-4 left-4 mt-12 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Live
                </span>
                {/* Viewer count */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <IoPersonAdd className="text-white size-3.5" />
                  <span className="text-white text-xs font-medium">{formatViewers(featuredStreams[0].users)}</span>
                </div>
              </Link>

              {/* Right side (stacked) */}
              <div className="flex flex-col gap-3">
                {featuredStreams.slice(1, 3).map((stream) => (
                  <Link
                    key={stream.uuid}
                    href={`/livestream/${stream.uuid}`}
                    className="relative flex-1 rounded-2xl overflow-hidden group"
                  >
                    <Image
                      src={stream.cover || "/images/beautiful-image.webp"}
                      alt={stream.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <CustomAvatar
                        src={stream.host?.profile_picture || ""}
                        name={stream.host?.name || ""}
                        className="size-7 border border-white/30"
                      />
                      <div>
                        <p className="text-white text-xs font-semibold">{stream.host?.username}</p>
                        {/* <p className="text-white/60 text-[10px]">{formatFollowers(stream.host?.followers_count)} Followers</p> */}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <IoPersonAdd className="text-white size-3" />
                      <span className="text-white text-[10px] font-medium">{formatViewers(stream.users)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Category Filters */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedCategory === cat
                    ? "border-white bg-white/10 text-white"
                    : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live Streams Grid */}
          {liveStreams.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {liveStreams.map((stream) => (
                <Link
                  key={stream.uuid}
                  href={`/livestream/${stream.uuid}`}
                  className="relative rounded-2xl overflow-hidden h-[220px] group"
                >
                  <Image
                    src={stream.cover || "/images/beautiful-image.webp"}
                    alt={stream.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {/* Live badge */}
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Live
                  </span>
                  {/* Viewer count */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <IoPersonAdd className="text-white size-3" />
                    <span className="text-white text-[10px] font-medium">{formatViewers(stream.users)}</span>
                  </div>
                  {/* Bottom info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-medium truncate mb-1.5">{stream.title}</p>
                    <div className="flex items-center gap-2">
                      <CustomAvatar
                        src={stream.host?.profile_picture || ""}
                        name={stream.host?.name || ""}
                        className="size-6 border border-white/30"
                      />
                      <span className="text-white/80 text-xs">{stream.host?.username}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Go Live Setup Modal */}
      <GoLiveSetupModal open={isGoLiveOpen} onClose={() => setIsGoLiveOpen(false)} />
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

function formatViewers(count: number | string | undefined): string {
  if (!count) return "0";
  const num = typeof count === "string" ? parseInt(count, 10) : count;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

export default NewLivestreamPage;
