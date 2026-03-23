"use client";

import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileMetrics from "./ProfileMetrics";
import ProfilePosts from "./ProfilePosts";

interface ProfilePageProps {
    username: string;
    isOwnProfile: boolean;
}

const ProfilePage = ({ username, isOwnProfile }: ProfilePageProps) => {
    const [activeTab, setActiveTab] = useState("posts");

    return (
        <div className="flex flex-row w-full h-full relative overflow-hidden">
            {/* Main Content Area */}
            <div className="w-full lg:w-[650px] shrink-0 border-r border-border h-full overflow-y-auto px-4 lg:px-6 pt-4 pb-8 no-scrollbar">
                <ProfileHeader username={username} isOwnProfile={isOwnProfile} />
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isOwnProfile={isOwnProfile} />

                {/* Tab Content */}
                <div className="mt-4">
                    {activeTab === "posts" && <ProfilePosts />}
                    {activeTab === "vflix" && (
                        <div className="flex flex-col gap-4 text-center mt-10 text-muted-foreground">
                            <p>VFlix videos will go here...</p>
                        </div>
                    )}
                    {activeTab === "likes" && (
                        <div className="flex flex-col gap-4 text-center mt-10 text-muted-foreground">
                            <p>Liked posts will go here...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar - Profile Metrics */}
            <div className="hidden lg:flex w-[400px] pt-4 px-4 lg:px-6 h-full overflow-hidden shrink-0">
                <div className="w-full h-full overflow-y-auto no-scrollbar pb-8">
                    <ProfileMetrics />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
