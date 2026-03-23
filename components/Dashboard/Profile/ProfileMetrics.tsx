import React from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import Link from "next/link";

const ProfileMetrics = () => {
    return (
        <div className="w-full flex flex-col gap-4 mt-2 text-foreground">
            {/* Profile Metrics Card */}
            <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="text-base font-bold mb-4">Profile metrics</h2>

                {/* Engagement Section */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold mb-2">Engagement</h3>

                    {/* Chart Placeholder Area */}
                    <div className="flex items-center justify-between mb-4 bg-accent/50 p-3 rounded-lg">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground leading-tight">Engagement<br />summary</span>
                            <span className="text-xl font-bold mt-1">8.5%</span>
                            <span className="text-[10px] text-muted-foreground mt-1">Weekly breakdown</span>
                        </div>
                        {/* simple path placeholder for the chart */}
                        <div className="w-24 h-8 flex items-end ml-4">
                            <svg viewBox="0 0 100 30" className="w-full h-full stroke-[#0D52D2] fill-none" strokeWidth="2">
                                <path d="M0,20 Q10,25 20,20 T40,25 T60,15 T80,20 T100,10" />
                            </svg>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col bg-accent/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Total Likes</span>
                                <ArrowUp className="size-3 text-green-500" />
                            </div>
                            <div className="flex items-end justify-between mt-1">
                                <span className="font-bold">1,204</span>
                                <span className="text-[10px] text-green-500">+5.2%</span>
                            </div>
                        </div>

                        <div className="flex flex-col bg-accent/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Comments</span>
                                <ArrowUp className="size-3 text-green-500" />
                            </div>
                            <div className="flex items-end justify-between mt-1">
                                <span className="font-bold">89</span>
                                <span className="text-[10px] text-green-500">+1.8%</span>
                            </div>
                        </div>

                        <div className="flex flex-col bg-accent/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Shares</span>
                                <ArrowDown className="size-3 text-red-500" />
                            </div>
                            <div className="flex items-end justify-between mt-1">
                                <span className="font-bold">45</span>
                                <span className="text-[10px] text-red-500">-0.5%</span>
                            </div>
                        </div>

                        <div className="flex flex-col bg-accent/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">New followers</span>
                                <ArrowUp className="size-3 text-green-500" />
                            </div>
                            <div className="flex items-end justify-between mt-1">
                                <span className="font-bold">15</span>
                                <span className="text-[10px] text-green-500">+15%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audience Insights Section */}
                <div>
                    <h3 className="text-sm font-bold mb-3">Audience insights</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative size-16 rounded-full border-[6px] border-[#0D52D2]/20 flex items-center justify-center">
                            {/* fake pie chart border using a secondary absolute div */}
                            <div className="absolute inset-0 rounded-full border-[6px] border-[#0D52D2] border-r-transparent border-t-transparent rotate-45" />
                            <span className="text-xs font-bold relative z-10">76%</span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="size-3 bg-[#0D52D2] rounded-full" />
                                <span className="font-bold text-sm">17 - 34</span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">Top audience age bracket</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mutual Connections Card */}
            <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold">Mutual Connections</h2>
                    <Link href="#" className="text-xs text-[#0D52D2] flex items-center hover:underline">
                        See all <ChevronRight className="size-3 ml-1" />
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {[
                        { name: "Adanna Linus", handle: "@adalinus", img: "" },
                        { name: "Jadesola Hampton", handle: "@jadesola_hampton", img: "" },
                        { name: "Jerry Samson", handle: "@sexyyjerry", img: "" },
                        { name: "Jerry Samson", handle: "@sexyyjerry", img: "" }
                    ].map((user, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CustomAvatar src={user.img} name={user.name[0]} className="size-10" />
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.handle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileMetrics;
