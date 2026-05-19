"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGuest } from "context/GuestContext";
import PostDetails from "components/Dashboard/Social/PostDetails";
import SocialMainWrapper from "components/Dashboard/Social/SocialMainWrapper";

interface Props {
    initialPost: IPost;
    user: IUser | null;
    currentPath: string;
}

// Dummy user for rendering PostDetails when guest (it only uses user for avatar in reply box)
const GUEST_USER: IUser = {
    uuid: "", name: "Guest", username: "guest", email: "",
    registration_type: "", account_type: "", phone_number: null,
    profile_picture: "", cover_photo: null, gender: null, dob: null,
    country: null, city: null, profession: null, bio: null,
    timezone: "", verified_status: 0, checkmark_verification_status: false,
    premium_verification_status: false, verification_badge: "",
    created_at: "", updated_at: "", deleted_at: null,
    online: false, last_online: null, is_private: false,
    has_two_factor_auth: false, status: "", address: null,
    latitude: null, longitude: null, referrer: null,
    referral_code: "", referral_count: 0, can_reset_password: false,
    followers: 0, following: 0, is_blocked: false,
    relationship: { is_self: false, is_following: false, is_followed_by: false },
    token: "",
};

export default function PublicPostPageClient({ initialPost, user, currentPath }: Props) {
    const router = useRouter();
    const { isGuest, openLoginModal } = useGuest();
    const [post, setPost] = useState<IPost>(initialPost);

    // Video playback state — required so PostVideo's intersection observer can trigger play
    const [currentVideoPlaying, setCurrentVideoPlaying] = useState<string>("");
    const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

    const effectiveUser = user ?? GUEST_USER;

    const handleLike = async (postId: string) => {
        if (isGuest) { openLoginModal(); return; }
        const isLiking = !post.is_liked;
        setPost((prev) => ({
            ...prev,
            is_liked: isLiking,
            likes_count: isLiking
                ? String(Number(prev.likes_count) + 1)
                : String(Math.max(0, Number(prev.likes_count) - 1)),
        }));
        try {
            await fetch(`/api/posts/${postId}/like`, { method: "POST" });
        } catch {
            setPost(initialPost);
        }
    };

    const handleSave = async (postId: string) => {
        if (isGuest) { openLoginModal(); return; }
        setPost((prev) => ({ ...prev, is_saved: !prev.is_saved }));
        try {
            await fetch(`/api/posts/${postId}/save`, { method: "POST" });
        } catch {
            setPost(initialPost);
        }
    };

    const handleOpenReplyModal = () => {
        if (isGuest) { openLoginModal(); return; }
        router.push(`/posts/${post.uuid}`);
    };

    return (
        <SocialMainWrapper>
            <PostDetails
                post={post}
                user={effectiveUser}
                setPosts={() => {}}
                onBack={() => router.back()}
                likeUnlikePost={handleLike}
                saveOrUnsavePost={handleSave}
                currentVideoPlaying={currentVideoPlaying}
                setCurrentVideoPlaying={setCurrentVideoPlaying}
                isPlayingVideo={isPlayingVideo}
                setIsPlayingVideo={setIsPlayingVideo}
                onOpenReplyModal={handleOpenReplyModal}
                onReplySuccess={() => {}}
            />
        </SocialMainWrapper>
    );
}
