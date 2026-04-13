"use client";

import React, { useState, useEffect } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { MdVerified } from "react-icons/md";
import { Skeleton } from "components/ui/skeleton";
import { toast } from "sonner";

interface BlockedUser {
    uuid: string;
    name: string;
    username: string;
    profile_picture: string;
    verified_status: number;
    verification_badge?: string;
}

const BlockedContent = ({ onCountChange }: { onCountChange?: (count: number) => void }) => {
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [unblocking, setUnblocking] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlocked = async () => {
            try {
                const res = await fetch("/api/users/blocked");
                const data = await res.json();
                if (data?.status && data?.data?.data) {
                    setBlockedUsers(data.data.data);
                    onCountChange?.(data.data.total ?? data.data.data.length);
                }
            } catch (error) {
                console.error("Failed to fetch blocked users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlocked();
    }, []);

    const handleUnblock = async (userId: string) => {
        if (unblocking) return;
        setUnblocking(userId);

        // Optimistic update
        setBlockedUsers((prev) => prev.filter((u) => u.uuid !== userId));
        onCountChange?.(blockedUsers.length - 1);

        try {
            const res = await fetch(`/api/users/${userId}/block`, { method: "POST" });
            const data = await res.json();
            if (!data?.status) {
                // Revert on failure
                const res2 = await fetch("/api/users/blocked");
                const data2 = await res2.json();
                if (data2?.status && data2?.data?.data) {
                    setBlockedUsers(data2.data.data);
                    onCountChange?.(data2.data.total ?? data2.data.data.length);
                }
                toast.error(data?.message || "Failed to unblock user");
            } else {
                toast.success("User unblocked successfully");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setUnblocking(null);
        }
    };

    return (
        <div className="max-w-[500px] pt-4 lg:pt-8 w-full mx-auto md:mx-0">
            <h2 className="text-[22px] text-foreground font-semibold mb-1">Blocked accounts</h2>
            <p className="text-muted-foreground text-sm mb-6">
                You can block users anytime from their profile.
            </p>

            <div className="flex flex-col gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-[42px] rounded-full" />
                                <div className="flex flex-col gap-1.5">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-9 w-20 rounded-full" />
                        </div>
                    ))
                ) : blockedUsers.length > 0 ? (
                    blockedUsers.map((user) => (
                        <div key={user.uuid} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CustomAvatar
                                    src={user.profile_picture}
                                    name={user.name}
                                    className="w-[42px] h-[42px]"
                                />
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-foreground text-[15px]">
                                            {user.name}
                                        </span>
                                        {!!user.verified_status && (
                                            <MdVerified className="text-green-500 w-[14px] h-[14px]" />
                                        )}
                                    </div>
                                    <span className="text-sm text-muted-foreground">@{user.username}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleUnblock(user.uuid)}
                                disabled={unblocking === user.uuid}
                                className="bg-[#dfdfdd] dark:bg-[#202022] text-foreground hover:bg-[#cfcfcd] dark:hover:bg-[#2C2C2E] border border-border rounded-full px-5 py-2 text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {unblocking === user.uuid ? "Unblocking..." : "Unblock"}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        No blocked accounts.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockedContent;
