"use client";

import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Separator } from "components/ui/separator";
import Image from "next/image";
import { FaHeart, FaCommentAlt } from "react-icons/fa";
import { BiMessageRounded } from "react-icons/bi";
import { TbDots } from "react-icons/tb";
import { Skeleton } from "components/ui/skeleton";

function formatCount(count: string | number): string {
  const num = typeof count === "string" ? parseInt(count, 10) : count;
  if (isNaN(num)) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

const RightSidebar = () => {
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/posts/trending?window=24h&page=1&limit=4");
        const data = await res.json();
        if (data?.status && data?.data?.data) {
          setTrendingPosts(data.data.data);
        }
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/api/users/suggestions");
        const data = await res.json();
        if (data?.status && data?.data) {
          setSuggestedUsers(data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching user suggestions:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollow = async (userId: string) => {
    // Optimistic UI Update
    setSuggestedUsers((prev) =>
      prev.map((user) =>
        user.uuid === userId ? { ...user, is_followed: !user.is_followed } : user
      )
    );

    try {
      const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
      const data = await res.json();

      // If the API returns a success, we can optionally resync with the server value
      if (data?.status && data?.data?.is_followed !== undefined) {
        setSuggestedUsers((prev) =>
          prev.map((user) =>
            user.uuid === userId ? { ...user, is_followed: data.data.is_followed } : user
          )
        );
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Revert the optimistic update on failure
      setSuggestedUsers((prev) =>
        prev.map((user) =>
          user.uuid === userId ? { ...user, is_followed: !user.is_followed } : user
        )
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 sticky top-24 pb-12 h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden no-scrollbar">
      {/* Hot Trends Section */}
      <div className="w-full border border-border rounded-[20px] flex flex-col">
        <div className="px-3 py-2 border-b border-border">
          <h3 className="font-bold flex items-center gap-2 text-base text-foreground">
            <span className="text-xl">🔥</span> Hot Trends
          </h3>
        </div>

        <div className="pb-2 flex flex-col">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-3 flex flex-col border-b border-border pb-3 py-3">
                <div className="flex items-center gap-x-2 mb-2">
                  <Skeleton className="size-10 rounded-full bg-accent" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24 bg-accent" />
                    <Skeleton className="h-2 w-16 bg-accent" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full bg-accent mb-1" />
                <Skeleton className="h-4 w-2/3 bg-accent mb-3" />
              </div>
            ))
          ) : trendingPosts.length > 0 ? (
            trendingPosts.map((post, idx) => {
              const userAvatar = post.user?.profile_picture || "";
              const userName = post.user?.name || "Unknown";
              const userHandle = post.user?.username || "unknown";
              const content = post.caption || "";
              // const formattedTime = post.formatted_time || "";
              const likes = post.likes_count || 0;
              const comments = post.replies_count || 0;
              const postImage = post.media?.[0]?.media_thumbnail || post.media?.[0]?.media_url || "";

              const handleTrendClick = () => {
                const event = new CustomEvent("openSocialPostDetails", {
                  detail: post,
                });
                window.dispatchEvent(event);
              };

              return (
                <div
                  key={post.uuid || idx}
                  className="px-3 flex flex-col border-b border-border pb-3 cursor-pointer hover:bg-accent transition-colors"
                  onClick={handleTrendClick}
                >
                  <div className="flex justify-between items-start my-2">
                    <div className="flex items-center gap-x-2">
                      <CustomAvatar
                        src={userAvatar}
                        name={userName}
                        className="size-10"
                      />
                      <div className="flex flex-col leading-tight">
                        <p className="font-semibold text-sm flex items-center gap-1">
                          {userName}{" "}
                          {/* <span className="text-muted-foreground font-normal text-xs">
                            • {formattedTime}
                          </span> */}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{userHandle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-3 leading-relaxed line-clamp-3">
                        {content.split(" ").map((word: string, i: number) =>
                          word.startsWith("#") || word.startsWith("@") ? (
                            <span key={i} className="text-blue-500">
                              {word}{" "}
                            </span>
                          ) : (
                            word + " "
                          ),
                        )}
                      </p>
                      <div className="flex items-center gap-4 text-muted-foreground text-xs font-medium">
                        <div className="flex items-center gap-1.5 focus:outline-none cursor-pointer">
                          <FaHeart className="size-3.5" /> {formatCount(likes)}
                        </div>
                        <div className="flex items-center gap-1.5 focus:outline-none cursor-pointer">
                          <BiMessageRounded className="size-4" /> {formatCount(comments)}
                        </div>
                      </div>
                    </div>
                    {postImage && (
                      <div className="w-24 h-[70px] shrink-0 relative rounded-lg overflow-hidden my-auto bg-black/20">
                        <Image
                          src={postImage}
                          alt="post media"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No trending posts available.
            </div>
          )}

          {!isLoading && trendingPosts.length > 0 && (
            <Button
              variant="link"
              className="text-blue-500 justify-start px-3 text-sm font-medium"
            >
              View more
            </Button>
          )}
        </div>
      </div>

      {/* Who to Connect With Section */}
      <div className="w-full border border-border rounded-[20px] flex flex-col p-5">
        <h3 className="font-bold mb-5 text-base text-foreground">
          Who to Connect With
        </h3>

        <div className="flex flex-col gap-y-4">
          {isLoadingSuggestions ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <Skeleton className="size-10 rounded-full bg-accent" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-24 bg-accent" />
                    <Skeleton className="h-2 w-16 bg-accent" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[72px] rounded-full bg-accent" />
              </div>
            ))
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((person, idx) => (
              <div key={person.uuid || idx} className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <CustomAvatar src={person.profile_picture || ""} name={person.name} className="size-10" />
                  <div className="flex flex-col leading-tight">
                    <p className="font-semibold text-sm line-clamp-1">{person.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      @{person.username}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleFollow(person.uuid)}
                  className={`h-8 rounded-full px-5 text-xs font-semibold ${person.is_followed
                    ? "bg-transparent border border-border text-foreground hover:bg-accent"
                    : "bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white"
                    }`}
                >
                  {person.is_followed ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4">No suggestions available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
