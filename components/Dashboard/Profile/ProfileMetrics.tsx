"use client";

import React, { useState, useEffect } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Skeleton } from "components/ui/skeleton";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";

interface ProfileMetricsProps {
    profile: IUserProfileResponse;
    isOwnProfile: boolean;
}

const ProfileMetrics = ({ profile, isOwnProfile }: ProfileMetricsProps) => {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                if (isOwnProfile) {
                    // Same endpoint as RightSidebar "Who to Connect With"
                    const res = await fetch("/api/users/suggestions");
                    const data = await res.json();
                    if (data?.status && data?.data) {
                        setUsers(data.data.slice(0, 5));
                    }
                } else {
                    const res = await fetch(`/api/users/${profile.uuid}/mutual-connections?page=1`);
                    const data = await res.json();
                    if (data?.status && data?.data?.data) {
                        setUsers(data.data.data.slice(0, 5));
                    }
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [profile.uuid, isOwnProfile]);

    const handleFollow = async (userId: string) => {
        const target = users.find((u) => u.uuid === userId);
        const wasFollowing = target?.is_followed;
        setUsers((prev) =>
            prev.map((u) => u.uuid === userId ? { ...u, is_followed: !wasFollowing } : u)
        );
        try {
            const endpoint = wasFollowing
                ? `/api/users/${userId}/unfollow`
                : `/api/users/${userId}/follow`;
            await fetch(endpoint, { method: "POST" });
        } catch {
            setUsers((prev) =>
                prev.map((u) => u.uuid === userId ? { ...u, is_followed: wasFollowing } : u)
            );
        }
    };

    const title = isOwnProfile ? "Who to Connect With" : "Mutual Connections";
    const emptyText = isOwnProfile ? "No suggestions available." : "No mutual connections found.";

    return (
        <div className="w-full flex flex-col gap-4 mt-2 text-foreground">
            <div className="bg-background rounded-xl border border-border p-5">
                <h2 className="text-sm font-bold mb-4">{title}</h2>

                <div className="flex flex-col gap-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-10 rounded-full" />
                                    <div className="flex flex-col gap-1.5">
                                        <Skeleton className="h-3.5 w-28" />
                                        <Skeleton className="h-2.5 w-20" />
                                    </div>
                                </div>
                                {isOwnProfile && <Skeleton className="h-8 w-16 rounded-full" />}
                            </div>
                        ))
                    ) : users.length > 0 ? (
                        users.map((user, i) => (
                            <div key={user.uuid || i} className="flex items-center justify-between">
                                <div
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => router.push(`/u/${user.username}`)}
                                >
                                    <CustomAvatar
                                        src={user.profile_picture || ""}
                                        name={user.name || ""}
                                        className="size-10"
                                    />
                                    <div className="flex flex-col leading-tight max-w-[130px]">
                                        <span className="text-sm font-bold truncate hover:underline">{user.name}</span>
                                        <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
                                    </div>
                                </div>

                                {/* Follow button only for own profile */}
                                {isOwnProfile && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleFollow(user.uuid)}
                                        className={`h-8 rounded-full px-4 text-xs font-semibold shrink-0 ${
                                            user.is_followed
                                                ? "bg-transparent border border-border text-foreground hover:bg-accent"
                                                : "bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white"
                                        }`}
                                    >
                                        {user.is_followed ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            {emptyText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileMetrics;
