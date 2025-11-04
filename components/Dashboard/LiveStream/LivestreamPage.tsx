"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import GoLiveButton from "./GoLiveButton";
import LiveStreamCard from "./LiveStreamCard";
import NotFoundResult from "../Reusable/NotFoundResult";
import { getFeaturedLivestreams } from "api/livestreams";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";

const LIVE_STREAM_FILTERS = [
  "Popular",
  "Sports",
  "Music",
  "Comedy",
  "Daily Life",
  "Business",
  "Fashion",
  "Movies",
  "Celebrities",
];

interface LivestreamHeaderProps {
  currentTab: "Explore" | "Connections";
  setCurrentTab: (tab: "Explore" | "Connections") => void;
}

const LiveStreamHeader = ({
  currentTab,
  setCurrentTab,
}: LivestreamHeaderProps) => (
  <div className="border-b-[1.5px] bg-background fixed px-16 h-fit flex z-40 w-[calc(100%-280px)]">
    <div className="flex flex-row w-full">
      {["Explore", "Connections"].map((tab) => (
        <span
          key={tab}
          className={cn(
            "py-3 px-5 text-lg font-semibold cursor-pointer transition-colors",
            currentTab === tab
              ? "border-b-4 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground/80"
          )}
          onClick={() => setCurrentTab(tab as "Explore" | "Connections")}
        >
          {tab}
        </span>
      ))}
    </div>
    <GoLiveButton />
  </div>
);

const LivestreamPage = () => {
  const [liveStreams, setLiveStreams] = useState<IFeaturedLivestream[] | null>(
    null
  );
  const [featuredLivestream, setFeaturedLivestream] = useState<
    IFeaturedLivestream[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<"Explore" | "Connections">(
    "Explore"
  );
  const [selectedFilter, setSelectedFilter] = useState(LIVE_STREAM_FILTERS);

  useEffect(() => {
    if (currentTab !== "Explore") {
      setLiveStreams(null);
      setFeaturedLivestream([]);
      setIsLoading(false);
      return;
    }

    const fetchLivestreams = async () => {
      setIsLoading(true);
      try {
        const page = 1;
        const response = await getFeaturedLivestreams(page);
        if (response.status && response.data) {
          const allStreams = response.data.data as IFeaturedLivestream[];
          setFeaturedLivestream(allStreams.slice(0, 4));
          setLiveStreams(allStreams.slice(4));
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
  }, [currentTab]);

  const showContent =
    currentTab === "Explore" && (liveStreams || featuredLivestream.length > 0);
  const showEmptyState = !isLoading && !showContent;

  return (
    <div className="grid w-full relative pb-40">
      <LiveStreamHeader currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="mt-[55px] min-h-[calc(100vh-150px)] px-16 py-6 flex flex-col">
        {isLoading && <LoadingSpinner />}

        {/* {showEmptyState && (
          <NotFoundResult
            title="No Live streams available at the moment"
            content={
              <p>
                Go Live to connect and engage with your <br /> audience.
              </p>
            }
          />
        )} */}

        {showEmptyState && (
          <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
            <NotFoundResult
              title="No Live streams available at the moment"
              content={
                <p className="text-center">
                  Go Live to connect and engage with your <br /> audience!
                </p>
              }
            />
          </div>
        )}

        {showContent && (
          <div>
            {featuredLivestream.length === 0 &&
            (!liveStreams || liveStreams.length === 0) ? (
              <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
                <NotFoundResult
                  title="No Live streams available at the moment"
                  content={
                    <p className="text-center">
                      Go Live to connect and engage with your <br /> audience!
                    </p>
                  }
                />
              </div>
            ) : (
              <>
                {/* Featured Lives Section */}
                {featuredLivestream.length > 0 && (
                  <div className="flex flex-col gap-y-5">
                    <p className="font-bold text-xl">Featured Lives</p>
                    <div className="grid lg:grid-cols-4 gap-4">
                      {featuredLivestream.map((stream) => (
                        <Link
                          href={`/dashboard/live-streams/${stream.uuid}`}
                          key={stream.uuid}
                          className="block transition-transform hover:scale-[1.02]"
                        >
                          <LiveStreamCard
                            title={stream.title}
                            username={stream.host.username}
                            name={stream.host.name}
                            profilePicture={stream.host.profile_picture}
                            coverImage={stream.cover}
                            viewerCount={stream.users}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Stream Filters */}
                <div className="flex mt-6 gap-x-4 items-center w-full overflow-x-auto">
                  {LIVE_STREAM_FILTERS.map((filter) => (
                    <Button
                      key={filter}
                      onClick={() =>
                        setSelectedFilter((prev) =>
                          prev.includes(filter)
                            ? prev.filter((f) => f !== filter)
                            : [...prev, filter]
                        )
                      }
                      variant="outline"
                      className={cn(
                        "rounded-md shrink-0",
                        selectedFilter.includes(filter) &&
                          "border-2 border-primary/75 font-semibold text-sm"
                      )}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>

                {/* General Lives Section */}
                {liveStreams && liveStreams.length > 0 && (
                  <div className="grid lg:grid-cols-4 gap-4">
                    {liveStreams.map((stream) => (
                      <Link
                        href={`/dashboard/live-streams/${stream.uuid}`}
                        key={stream.uuid}
                        className="block transition-transform hover:scale-[1.02]"
                      >
                        <LiveStreamCard
                          title={stream.title}
                          username={stream.host.username}
                          name={stream.host.name}
                          profilePicture={stream.host.profile_picture}
                          coverImage={stream.cover}
                          viewerCount={stream.users}
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivestreamPage;
