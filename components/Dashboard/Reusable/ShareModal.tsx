"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "components/ui/dialog";
import { IoClose, IoSearch } from "react-icons/io5";
import { FaFacebookF, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { IoMdLink } from "react-icons/io";
import { RiSearchLine } from "react-icons/ri";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { toast } from "sonner";

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
    postId?: string;
    shareUrl?: string;
    user?: IUser
}

// Placeholder users — replace with real followers/friends data
const PLACEHOLDER_USERS = [
    { id: "1", name: "Michael Jordan", avatar: "" },
    { id: "2", name: "Maren Herwitz", avatar: "" },
    { id: "3", name: "Maren Herwitz", avatar: "" },
    { id: "4", name: "Skylar Kenter", avatar: "" },
    { id: "5", name: "Michael Jordan", avatar: "" },
    { id: "6", name: "Maren Herwitz", avatar: "" },
    { id: "7", name: "Maren Herwitz", avatar: "" },
    { id: "8", name: "Skylar Kenter", avatar: "" },
];

const ShareModal = ({ open, onClose, postId, shareUrl }: ShareModalProps) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const toggleUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId],
        );
    };

    const handleCopyLink = () => {
        const url = shareUrl || window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
    };

    const handleShareFacebook = () => {
        const url = shareUrl || window.location.href;
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank",
        );
    };

    const handleShareWhatsApp = () => {
        const url = shareUrl || window.location.href;
        window.open(
            `https://wa.me/?text=${encodeURIComponent(url)}`,
            "_blank",
        );
    };

    const handleShareX = () => {
        const url = shareUrl || window.location.href;
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
            "_blank",
        );
    };

    const handlePost = () => {
        toast.success("Shared successfully");
        onClose();
        setSelectedUsers([]);
        setSearchValue("");
    };

    const filteredUsers = PLACEHOLDER_USERS.filter((u) =>
        u.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[550px] w-full p-0 rounded-[20px] overflow-hidden border border-white/10 bg-[#1C1C1E] shadow-2xl [&>button:last-child]:hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <h2 className="text-[16px] font-bold text-white">Share</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <IoClose className="text-white/70 size-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-5 pb-4">
                    <div className="relative">
                        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full bg-[#2C2C2E] h-9 pl-9 pr-4 text-[13px] text-white placeholder:text-white/40 rounded-lg outline-none border-none ring-0 focus:ring-0"
                        />
                    </div>
                </div>

                {/* User Grid */}
                <div className="pb-4">
                    <div className="grid grid-cols-4 gap-y-4">
                        {filteredUsers.map((user) => {
                            const isSelected = selectedUsers.includes(user.id);
                            return (
                                <button
                                    key={user.id}
                                    onClick={() => toggleUser(user.id)}
                                    className="flex flex-col items-center gap-1.5 group"
                                >
                                    <div
                                        className={`relative rounded-full transition-all ${isSelected
                                                ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1C1C1E]"
                                                : ""
                                            }`}
                                    >
                                        <CustomAvatar
                                            src={"https://cdn-assets.villagesquare.io/profile_pictures/default_user.png"}
                                            name={user.name}
                                            className="size-14 border-none"
                                        />
                                    </div>
                                    <span className="text-[10px] text-white/70 text-center leading-tight line-clamp-1 max-w-[70px]">
                                        {user.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Action Icons Row */}
                <div className="px-5 pb-4">
                    <div className="flex items-center justify-between">
                        {/* Search */}
                        <button
                            className="flex flex-col items-center gap-1.5"
                            onClick={() => {
                                /* future search action */
                            }}
                        >
                            <div className="size-10 rounded-full bg-[#2C2C2E] flex items-center justify-center">
                                <RiSearchLine className="text-white size-[18px]" />
                            </div>
                            <span className="text-[10px] text-white/70">Search</span>
                        </button>

                        {/* Copy Link */}
                        <button
                            className="flex flex-col items-center gap-1.5"
                            onClick={handleCopyLink}
                        >
                            <div className="size-10 rounded-full bg-[#2C2C2E] flex items-center justify-center">
                                <IoMdLink className="text-white size-[18px]" />
                            </div>
                            <span className="text-[10px] text-white/70">Copy Link</span>
                        </button>

                        {/* Facebook */}
                        <button
                            className="flex flex-col items-center gap-1.5"
                            onClick={handleShareFacebook}
                        >
                            <div className="size-10 rounded-full bg-[#2C2C2E] flex items-center justify-center">
                                <FaFacebookF className="text-white size-[16px]" />
                            </div>
                            <span className="text-[10px] text-white/70">Facebook</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                            className="flex flex-col items-center gap-1.5"
                            onClick={handleShareWhatsApp}
                        >
                            <div className="size-10 rounded-full bg-[#2C2C2E] flex items-center justify-center">
                                <FaWhatsapp className="text-white size-[18px]" />
                            </div>
                            <span className="text-[10px] text-white/70">WhatsApp</span>
                        </button>

                        {/* X (Twitter) */}
                        <button
                            className="flex flex-col items-center gap-1.5"
                            onClick={handleShareX}
                        >
                            <div className="size-10 rounded-full bg-[#2C2C2E] flex items-center justify-center">
                                <FaXTwitter className="text-white size-[16px]" />
                            </div>
                            <span className="text-[10px] text-white/70">X</span>
                        </button>
                    </div>
                </div>

                {/* Post Button */}
                <div className="px-5 pb-5 flex justify-end">
                    <button
                        onClick={handlePost}
                        className="bg-[#094DB5] hover:bg-[#0a5ed4] text-white px-8 h-[38px] rounded-full font-semibold text-[14px] transition-colors"
                    >
                        Post
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;
