"use client";

import React, { useState } from "react";
import VflixFeed from "./VflixFeed";
import HotOnVflix from "./HotOnVflix";

const VFlixPage = ({ user }: { user: IUser }) => {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you",
  );
  const [videos, setVideos] = useState<IVflix[]>([]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar">
        {/* Tabs */}
        <div className="flex items-center shrink-0 pl-[268px]">
          <button
            onClick={() => setActiveTab("for-you")}
            className={`flex-1 md:flex-none px-4 py-3 text-sm font-medium transition-colors ${activeTab === "for-you"
              ? "text-foreground border-b-2 border-white"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Explore
          </button>

          <div className="h-4 w-px bg-white mx-2" />

          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 md:flex-none px-4 py-3 text-sm font-medium transition-colors ${activeTab === "following"
              ? "text-foreground border-b-2 border-white"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Connections
          </button>
        </div>

        {/* Feed */}
        <div className="flex py-6 pl-[268px]">
          <VflixFeed
            activeTab={activeTab}
            user={user}
            onVideosLoaded={setVideos}
          />
        </div>
      </div>

      {/* Right Sidebar — Hot on VFlix */}
      <div className="hidden lg:block w-[200px] shrink-0 h-full overflow-y-auto no-scrollbar pt-3 md:mr-16">
        <HotOnVflix videos={videos} />
      </div>
    </div>
  );
};

export default VFlixPage;
