"use client";

import React, { useState } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { MdVerified } from "react-icons/md";

// Mock data for blocked accounts as requested
const initialBlockedUsers = [
    {
        id: "1",
        name: "Chioma Nelson",
        username: "finegalchi_",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1bf3c9?q=80&w=150&auto=format&fit=crop",
        verified: false,
    },
    {
        id: "2",
        name: "Komolafe Jason",
        username: "jay_kmf",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
        verified: true,
    },
    {
        id: "3",
        name: "Design Zone",
        username: "thedesignzoneafrica",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
        verified: false,
    },
    {
        id: "4",
        name: "Nedu Awu",
        username: "thened.a",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        verified: false,
    },
    {
        id: "5",
        name: "Segun Adeniyi",
        username: "segun_adewire",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop",
        verified: false,
    },
    {
        id: "6",
        name: "Zainab Aliyu",
        username: "zee_aliyu",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
        verified: false,
    }
];

const BlockedContent = () => {
    const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);

    const handleUnblock = (id: string) => {
        // Optimistic UI update
        setBlockedUsers(blockedUsers.filter(user => user.id !== id));
    };

    return (
        <div className="max-w-[500px] pt-4 lg:pt-8 w-full mx-auto md:mx-0">
            <h2 className="text-[22px] text-foreground font-semibold mb-1">Blocked accounts</h2>
            <p className="text-muted-foreground text-sm mb-6">You can block users anytime from their profile.</p>

            <div className="flex flex-col gap-6">
                {blockedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CustomAvatar
                                src={user.image}
                                name={user.name}
                                className="w-[42px] h-[42px]"
                            />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-foreground text-[15px]">{user.name}</span>
                                    {user.verified && (
                                        <MdVerified className="text-green-500 w-[14px] h-[14px]" />
                                    )}
                                </div>
                                <span className="text-sm text-muted-foreground">@{user.username}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleUnblock(user.id)}
                            className="bg-[#dfdfdd] dark:bg-[#202022] text-foreground hover:bg-[#2C2C2E] border border-border rounded-full px-5 py-2 text-[13px] font-medium transition-colors"
                        >
                            Unblock
                        </button>
                    </div>
                ))}

                {blockedUsers.length === 0 && (
                    <div className="text-center text-muted-foreground py-10">
                        No blocked accounts.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockedContent;
