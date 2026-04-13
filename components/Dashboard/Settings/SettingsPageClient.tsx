"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronRight, ArrowUpRight, LogOut } from "lucide-react";
import EditProfileContent from "./EditProfileContent";
import VerificationContent from "./VerificationContent";
import RateUsContent from "./RateUsContent";
import ChangePasswordContent from "./ChangePasswordContent";
import BlockedContent from "./BlockedContent";
import DeactivateAccountContent from "./DeactivateAccountContent";

const SettingsPageClient = () => {
    const [activeTab, setActiveTab] = useState("edit_profile");
    const [blockedCount, setBlockedCount] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/users/blocked-count")
            .then((r) => r.json())
            .then((data) => {
                if (data?.status && data?.data?.count !== undefined) {
                    setBlockedCount(data.data.count);
                }
            })
            .catch(() => {});
    }, []);

    const menuSections = [
        {
            title: "ACCOUNT",
            items: [
                { id: "edit_profile", label: "Edit Profile", icon: ChevronRight },
                { id: "verification", label: "Verification", icon: ChevronRight },
                { id: "change_password", label: "Change Password", icon: ChevronRight },
                { id: "blocked", label: "Blocked", icon: ChevronRight, badge: blockedCount !== null ? String(blockedCount) : undefined },
                { id: "deactivate", label: "Deactivate / Delete Account", icon: ChevronRight },
            ],
        },
        {
            title: "HELP & SUPPORT",
            items: [
                { id: "faqs", label: "FAQs", icon: ChevronRight },
                { id: "about", label: "About Us", icon: ArrowUpRight, external: true },
                { id: "support", label: "Contact / Support", icon: ArrowUpRight, external: true },
            ],
        },
        {
            title: "LEGAL",
            items: [
                { id: "privacy", label: "Privacy Policy", icon: ArrowUpRight, external: true },
                { id: "terms", label: "Terms & Condition", icon: ArrowUpRight, external: true },
                { id: "eula", label: "EULA for VillageSquare", icon: ArrowUpRight, external: true },
            ],
        },
        {
            title: "APP & REFERENCE",
            items: [
                { id: "rate", label: "Rate Us", icon: ChevronRight },
                { id: "signout", label: "Sign Out", icon: ChevronRight },
            ],
        },
    ];

    return (
        <div className="flex w-full h-[calc(100vh-80px)] overflow-hidden text-white pt-2 bg-background">
            {/* Left Sidebar */}
            <div className="w-[320px] lg:w-[500px] h-full overflow-y-auto border-r border-border flex flex-col pr-4 pl-2 pb-10">

                {/* Menu Sections */}
                {menuSections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                        <h3 className="text-xs font-semibold text-muted-foreground my-3 uppercase tracking-wider mx-2">
                            {section.title}
                        </h3>
                        <div className="flex flex-col border border-border rounded-xl overflow-hidden">
                            {section.items.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <React.Fragment key={item.id}>
                                        <button
                                            onClick={() => {
                                                if ('external' in item && item.external) return; // Might handle external routing differently
                                                if (item.id === 'signout') {
                                                    // handle sign out
                                                    return;
                                                }
                                                setActiveTab(item.id)
                                            }}
                                            className={`flex items-center justify-between px-4 py-3.5 text-sm transition-colors ${isActive ? "bg-[#eaeae8] dark:bg-[#252528] font-medium" : "hover:bg-[#eaeae8] dark:hover:bg-[#202022] text-[#E0E0E0]"
                                                }`}
                                        >
                                            <span className="flex items-center text-foreground">
                                                {item.label}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {'badge' in item && item.badge && (
                                                    <span className="text-xs font-bold text-foreground pr-1.5">{item.badge}</span>
                                                )}
                                                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                                            </div>
                                        </button>
                                        {index < section.items.length - 1 && (
                                            <div className="h-px bg-border" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 h-full overflow-y-auto px-2 lg:px-4 py-0 pb-16">
                {activeTab === "edit_profile" && <EditProfileContent />}
                {activeTab === "verification" && <VerificationContent />}
                {activeTab === "rate" && <RateUsContent />}
                {activeTab === "change_password" && <ChangePasswordContent />}
                {activeTab === "blocked" && (
                    <BlockedContent onCountChange={(count) => setBlockedCount(count)} />
                )}
                {activeTab === "deactivate" && <DeactivateAccountContent />}
                {activeTab !== "edit_profile" && activeTab !== "verification" && activeTab !== "rate" && activeTab !== "change_password" && activeTab !== "blocked" && activeTab !== "deactivate" && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        {activeTab} content coming soon
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPageClient;
