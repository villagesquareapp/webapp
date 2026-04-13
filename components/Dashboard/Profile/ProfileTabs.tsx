import React from "react";
import { Grid, Heart, LayoutGrid, MonitorPlay } from "lucide-react";

interface ProfileTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOwnProfile: boolean;
}

const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile }: ProfileTabsProps) => {
    const tabs = [
        { id: "posts", label: "Posts", icon: <LayoutGrid className="size-4" /> },
        { id: "vflix", label: "VFlix", icon: <MonitorPlay className="size-4" /> },
    ];

    if (isOwnProfile) {
        tabs.push({ id: "likes", label: "Likes", icon: <Heart className="size-4" /> });
    }

    return (
        <div className="flex items-center w-full mt-6 border-b border-border">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 pb-3 text-sm font-medium transition-colors border-b-[3px] -mb-[1.5px]
            ${activeTab === tab.id
                            ? "text-foreground border-[#0D52D2]"
                            : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                        }
          `}
                >
                    <div className="flex items-center gap-2">
                        {tab.label} {tab.icon}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ProfileTabs;
