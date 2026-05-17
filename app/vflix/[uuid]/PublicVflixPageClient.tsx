"use client";

import { useState, useCallback } from "react";
import { useGuest } from "context/GuestContext";
import GuestLoginModal from "components/Auth/GuestLoginModal";
import VflixCard from "components/Dashboard/VFlix/VFlixCard";
import { toast } from "sonner";

// Minimal guest user — VFlixCard only uses user.uuid to hide the Follow button on own videos
const GUEST_USER: IUser = {
    uuid: "__guest__",
    name: "Guest",
    username: "guest",
    email: "",
    registration_type: "",
    account_type: "",
    phone_number: null,
    profile_picture: "",
    cover_photo: null,
    gender: null,
    dob: null,
    country: null,
    city: null,
    profession: null,
    bio: null,
    timezone: "",
    verified_status: 0,
    checkmark_verification_status: false,
    premium_verification_status: false,
    verification_badge: "",
    created_at: "",
    updated_at: "",
    deleted_at: null,
    online: false,
    last_online: null,
    is_private: false,
    has_two_factor_auth: false,
    status: "",
    address: null,
    latitude: null,
    longitude: null,
    referrer: null,
    referral_code: "",
    referral_count: 0,
    can_reset_password: false,
    followers: 0,
    following: 0,
    is_blocked: false,
    relationship: { is_self: false, is_following: false, is_followed_by: false },
    token: "",
};

interface Props {
    initialVideo: IVflix;
    currentPath: string;
}

export default function PublicVflixPageClient({ initialVideo, currentPath }: Props) {
    const { isGuest, openLoginModal } = useGuest();
    const [videos, setVideos] = useState<IVflix[]>([initialVideo]);
    const [isMuted, setIsMuted] = useState(true);

    // Intercept like — guests see login modal, authenticated users call the API
    const handleLikeUnlike = useCallback(async (postId: string, source?: string) => {
        if (isGuest) {
            openLoginModal();
            return;
        }
        // Optimistic update
        setVideos((prev) =>
            prev.map((v) => {
                if (v.uuid !== postId) return v;
                const isLiking = !v.is_liked;
                return {
                    ...v,
                    is_liked: isLiking,
                    likes_count: String(Math.max(0, Number(v.likes_count) + (isLiking ? 1 : -1))),
                };
            })
        );
        try {
            const url = source === "legacy"
                ? `/api/vflix/${postId}/like?source=legacy`
                : `/api/vflix/${postId}/like`;
            const res = await fetch(url, { method: "POST" });
            const result = await res.json();
            if (!result?.status) {
                setVideos([initialVideo]);
                toast.error(result?.message || "Failed to like video");
            }
        } catch {
            setVideos([initialVideo]);
        }
    }, [isGuest, openLoginModal, initialVideo]);

    // Intercept comment — guests see login modal
    const handleCommentClick = useCallback(() => {
        if (isGuest) {
            openLoginModal();
            return;
        }
        // Authenticated: no-op here since comments panel is handled inside VflixCard
    }, [isGuest, openLoginModal]);

    const video = videos[0];

    return (
        <>
            {/* Full-screen VFlix layout — centered under the navbar */}
            <div className="flex items-start justify-center w-full h-full pt-0">
                <div
                    className="relative aspect-[9/16] w-auto max-w-[420px] h-full max-h-[calc(100vh-64px)] rounded-2xl shadow-2xl overflow-hidden bg-black"
                >
                        <VflixCard
                            post={video}
                            user={GUEST_USER}
                            setVideos={setVideos}
                            likeUnlikeVflix={handleLikeUnlike}
                            onCommentClick={handleCommentClick}
                            isMuted={isMuted}
                            setIsMuted={setIsMuted}
                        />
                </div>
            </div>

            {/* Guest login modal */}
            <GuestLoginModal />
        </>
    );
}
