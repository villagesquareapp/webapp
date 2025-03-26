import GoLiveButton from "components/Dashboard/LiveStream/GoLiveButton";
import LiveStream from "components/Dashboard/LiveStream/LiveStream";
import LiveStreamCard from "components/Dashboard/LiveStream/LiveStreamCard";
import NotFoundResult from "components/Dashboard/Reusable/NotFoundResult";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import Link from "next/link";

const LiveStreamPage = () => {
  let showNotFoundResult = false;
  let showForYouLiveStreams = true;

  const liveStreamFilters = [
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

  const selectedFilter = liveStreamFilters[0];

  return (
    <div className="grid w-full relative pb-40">
      <div>
        <div className="border-b-[1.5px] bg-background fixed px-16 h-fit flex z-40 w-[calc(100%-280px)]">
          <div className="flex flex-row w-full">
            {/* @Todo Font is bold and primary border when selected */}
            <span className="py-3 px-5 text-lg border-b-4 border-primary font-semibold">
              For You
            </span>
            <span className="py-3 px-5 text-lg text-muted-foreground">Following</span>
          </div>
          <GoLiveButton />
        </div>
        {showForYouLiveStreams && (
          <div className="px-16 py-6 mt-[55px] min-h-[calc(100vh-150px)] flex flex-col">
            {showNotFoundResult && !showForYouLiveStreams && (
              <NotFoundResult
                title="No Live streams available at the moment"
                content={
                  <p>
                    Go Live to connect and engage with your <br /> audience!
                  </p>
                }
              />
            )}
            {showForYouLiveStreams && (
              <div className="flex flex-col gap-y-5">
                <p className="font-bold text-">Featured Lives</p>
                <div className="grid lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Link
                      href="/dashboard/live-streams/[livestream]"
                      as="/dashboard/live-streams/livestream"
                      key={index}
                    >
                      <LiveStreamCard />
                    </Link>
                  ))}
                </div>
                <div className="flex mt-10 gap-x-4 items-center w-full overflow-x-auto">
                  {liveStreamFilters.map((filter, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={cn(
                        "rounded-md ",
                        selectedFilter === filter && "border-2 border-primary/75"
                      )}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
                <div className="grid lg:grid-cols-4 gap-4">
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Link
                      href="/dashboard/live-streams/[livestream]"
                      as="/dashboard/live-streams/livestream"
                      key={index}
                    >
                      <LiveStreamCard />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStreamPage;
