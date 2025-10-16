"use client";

import React, {useState} from 'react'
import VflixFeed from './VflixFeed';

const VFlixPage = ({user}: {user: IUser}) => {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  return (
    <div className="flex flex-col w-full h-full">
      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-700">
        <button
          onClick={() => setActiveTab("for-you")}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === "for-you"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400"
          }`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === "following"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400"
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