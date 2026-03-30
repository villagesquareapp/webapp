"use client";

import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileMetrics from "./ProfileMetrics";
import ProfilePosts from "./ProfilePosts";
import ProfileVflix from "./ProfileVflix";
import ProfileLikedPosts from "./ProfileLikedPosts";
import { Skeleton } from "components/ui/skeleton";

interface ProfilePageProps {
    username: string;
    isOwnProfile: boolean;
    initialProfile: IUserProfileResponse | null;
}

const ProfilePage = ({ username, isOwnProfile, initialProfile }: ProfilePageProps) => {
    const [activeTab, setActiveTab] = useState("posts");
    const profile = initialProfile;
    const loading = !profile;

    return (
        <div className="flex flex-row w-full h-full relative overflow-hidden">
            {/* Main Content Area */}
            <div className="w-full lg:w-[650px] shrink-0 border-r border-border h-full overflow-y-auto px-4 lg:px-6 pt-4 pb-8 no-scrollbar">
                {loading ? (
                    <div className="flex flex-col w-full pb-4 border-b border-border gap-4 mt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-[88px] w-[88px] rounded-full" />
                            </div>
                            <div className="flex flex-col items-end gap-4 self-start">
                                <Skeleton className="h-8 w-64 rounded-xl" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-4 w-48 mt-2" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ) : (
                    <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
                )}

                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isOwnProfile={isOwnProfile} />

                {/* Tab Content */}
                <div className="mt-4">
                    {activeTab === "posts" && profile && <ProfilePosts userId={profile.uuid} />}
                    {activeTab === "vflix" && profile && (
                        <ProfileVflix userId={profile.uuid} />
                    )}
                    {activeTab === "likes" && profile && (
                        <ProfileLikedPosts userId={profile.uuid} />
                    )}
                </div>
            </div>

            {/* Right Sidebar - Profile Metrics */}
            <div className="hidden lg:flex w-[400px] pt-4 px-4 lg:px-6 h-full overflow-hidden shrink-0">
                <div className="w-full h-full overflow-y-auto no-scrollbar pb-8">
                    {loading ? (
                        <div className="flex flex-col gap-4 w-full">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-40 w-full" />
                        </div>
                    ) : (
                        <ProfileMetrics profile={profile} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
