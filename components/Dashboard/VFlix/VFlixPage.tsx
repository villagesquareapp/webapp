"use client";

import React, { useState } from 'react'
import VflixFeed from './VflixFeed';

const VFlixPage = ({ user }: { user: IUser }) => {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  return (
    <div className="flex flex-col w-full h-full">
      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-700">
        <button
          onClick={() => setActiveTab("for-you")}
          className={`flex-1 md:flex-none px-6 py-3 text-sm font-medium transition-colors ${activeTab === "for-you"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 md:flex-none px-6 py-3 text-sm font-medium transition-colors ${activeTab === "following"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Connections
        </button>
      </div>

      {/* Feed */}
      <div className="flex justify-center py-6">
        <VflixFeed activeTab={activeTab} user={user} />
      </div>
    </div>
  );
}

export default VFlixPage