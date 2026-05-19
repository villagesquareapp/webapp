"use client";

import React, { useState } from "react";
import VflixFeed from "./VflixFeed";
import HotOnVflix from "./HotOnVflix";

const VFlixPage = React.memo(({ user }: { user: IUser }) => {
  const [activeTab, setActiveTab] = useState<"explore" | "connections">("explore");
  const [videos, setVideos] = useState<IVflix[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<IVflix | undefined>(undefined);

  const handleHotVideoSelect = (video: IVflix) => {
    setSelectedVideo(video);
  };

  return (
    <div className="flex w-full h-full overflow-hidden relative">
      {/* Left Navigation Tabs — desktop only */}
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

      {/* Mobile tab bar */}
      <div className="lg:hidden absolute top-3 left-1/2 -translate-x-1/2 z-10 flex gap-6">
        <button
          onClick={() => setActiveTab("explore")}
          className={`text-sm font-semibold pb-1 transition-all ${activeTab === "explore"
            ? "text-foreground border-b-2 border-[#0D52D2]"
            : "text-muted-foreground border-b-2 border-transparent"
            }`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab("connections")}
          className={`text-sm font-semibold pb-1 transition-all ${activeTab === "connections"
            ? "text-foreground border-b-2 border-[#0D52D2]"
            : "text-muted-foreground border-b-2 border-transparent"
            }`}
        >
          Connections
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex justify-center lg:justify-start h-full overflow-y-auto no-scrollbar relative">
        <div className="flex py-0 lg:py-6 w-full h-full">
          <VflixFeed
            activeTab={activeTab}
            user={user}
            onVideosLoaded={setVideos}
            selectedVideo={selectedVideo}
          />
        </div>
      </div>

      {/* Right Sidebar — Hot on VFlix — desktop only */}
      <div className="hidden lg:block shrink-0 h-full overflow-y-auto no-scrollbar pt-3 mr-4 lg:mr-16">
        <HotOnVflix onVideoSelect={handleHotVideoSelect} />
      </div>
    </div>
  );
});

VFlixPage.displayName = "VFlixPage";

export default VFlixPage;
