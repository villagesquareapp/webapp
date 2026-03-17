"use client";

import React, { useState } from "react";
import VflixFeed from "./VflixFeed";
import HotOnVflix from "./HotOnVflix";

const VFlixPage = React.memo(({ user }: { user: IUser }) => {
  const [activeTab, setActiveTab] = useState<"explore" | "connections">("explore");
  const [videos, setVideos] = useState<IVflix[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

  return (
    <div className="flex w-full h-full overflow-hidden relative">
      {/* Left Navigation Tabs */}
      <div className="hidden lg:flex flex-col items-start gap-3 absolute left-5 top-1/2 -translate-y-1/2 z-10 w-48">
        <button
          onClick={() => setActiveTab("explore")}
          className={`text-left text-base transition-all ${activeTab === "explore"
            ? "text-foreground font-bold border-b-[3px] border-[#0D52D2] pb-1"
            : "text-muted-foreground hover:text-foreground pb-1 border-b-[3px] border-transparent font-medium"
            }`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab("connections")}
          className={`text-left text-base transition-all ${activeTab === "connections"
            ? "text-foreground font-bold border-b-[3px] border-[#0D52D2] pb-1"
            : "text-muted-foreground hover:text-foreground pb-1 border-b-[3px] border-transparent font-medium"
            }`}
        >
          Connections
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar">
        {/* Feed */}
        <div className="flex py-6 lg:ml-[268px]">
          <VflixFeed
            activeTab={activeTab}
            user={user}
            onVideosLoaded={setVideos}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>

      {/* Right Sidebar — Hot on VFlix */}
      <div className="hidden lg:block shrink-0 h-full overflow-y-auto no-scrollbar pt-3 mr-4 lg:mr-16">
        <HotOnVflix videos={videos} onVideoSelect={setSelectedIndex} />
      </div>
    </div>
  );
});

VFlixPage.displayName = "VFlixPage";

export default VFlixPage;
