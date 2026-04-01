"use client";

import React, { useState, useEffect } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "components/ui/skeleton";
import { useRouter } from "next/navigation";

interface ProfileMetricsProps {
    profile?: IUserProfileResponse;
}

const ProfileMetrics = ({ profile }: ProfileMetricsProps) => {
    const router = useRouter();
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await fetch("/api/users/suggestions");
                const data = await res.json();
                if (data?.status && data?.data) {
                    setSuggestions(data.data.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    return (
        <div className="w-full flex flex-col gap-4 mt-2 text-foreground">
            {/* Mutual Connections Card */}
            <div className="bg-background rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold">Mutual Connections</h2>
                    <Link href="#" className="text-xs text-[#0D52D2] flex items-center hover:underline">
                        See all <ChevronRight className="size-3 ml-1" />
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="size-10 rounded-full" />
                                <div className="flex flex-col gap-1.5">
                                    <Skeleton className="h-3.5 w-28" />
                                    <Skeleton className="h-2.5 w-20" />
                                </div>
                            </div>
                        ))
                    ) : suggestions.length > 0 ? (
                        suggestions.map((user, i) => (
                            <div
                                key={user.uuid || i}
                                className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                                onClick={() => {
                                    const scrollContainer = document.getElementById("social-main-scroll");
                                    if (scrollContainer) {
                                        sessionStorage.setItem("social-scroll-pos", String(scrollContainer.scrollTop));
                                    }
                                    router.push(`/u/${user.username}`);
                                }}
                            >
                                <CustomAvatar
                                    src={user.profile_picture || ""}
                                    name={user.name || ""}
                                    className="size-10"
                                />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-bold line-clamp-1">{user.name}</span>
                                    <span className="text-xs text-muted-foreground line-clamp-1">@{user.username}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            No mutual connections found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileMetrics;
