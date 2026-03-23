"use client";

import React, { useState } from "react";
import EachSocialPost from "components/Dashboard/Social/EachSocialPost";

const mockPosts: any[] = [
    {
        uuid: "post-1",
        user_id: "user-1",
        caption: "Lately, I've developed an interest in art and I've started exploring it\n\n#art #artexplore #villagesquareviral",
        address: "Maplewood estate, New oko-oba",
        latitude: null,
        longitude: null,
        privacy: "everyone",
        status: "active",
        views_count: "3000",
        shares_count: "34",
        likes_count: "500",
        replies_count: "57",
        additional_metadata: null,
        created_at: new Date("2025-10-15T10:00:00Z"),
        updated_at: new Date("2025-10-15T10:00:00Z"),
        user: {
            uuid: "user-1",
            name: "Temilade Praise",
            username: "vegasofvegas",
            email: "test@example.com",
            verified_status: 1,
            profile_picture: "",
            checkmark_verification_status: true,
            premium_verification_status: false,
            online: false,
        },
        media: [
            {
                uuid: "media-1",
                media_url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2671&auto=format&fit=crop",
                transcoded_media_url: "",
                media_type: "image",
                thumbnail: "",
                is_transcode_complete: true,
            }
        ],
        formatted_time: "Oct 15",
        is_saved: false,
        is_liked: false,
    },
    {
        uuid: "post-2",
        user_id: "user-1",
        caption: '"Consistency is a mindset, not a schedule".',
        address: null,
        latitude: null,
        longitude: null,
        privacy: "everyone",
        status: "active",
        views_count: "890",
        shares_count: "5",
        likes_count: "31",
        replies_count: "0",
        additional_metadata: null,
        created_at: new Date("2025-02-24T10:00:00Z"),
        updated_at: new Date("2025-02-24T10:00:00Z"),
        user: {
            uuid: "user-1",
            name: "Temilade Praise",
            username: "vegasofvegas",
            email: "test@example.com",
            verified_status: 1,
            profile_picture: "",
            checkmark_verification_status: true,
            premium_verification_status: false,
            online: false,
        },
        media: [],
        formatted_time: "Feb 24",
        is_saved: false,
        is_liked: false,
    }
];

const mockUser = {
    uuid: "current-user",
    name: "Temilade Praise",
    username: "vegasofvegas",
    profile_picture: "",
    // minimal fields for type safety
} as any;

const ProfilePosts = () => {
    const [posts, setPosts] = useState<any[]>(mockPosts);
    const [currentVideoPlaying, setCurrentVideoPlaying] = useState<string>("");
    const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

    const likeUnlikePost = async (postId: string) => {
        setPosts(prev => prev.map(p => {
            if (p.uuid === postId) {
                return {
                    ...p,
                    is_liked: !p.is_liked,
                    likes_count: p.is_liked ? String(Number(p.likes_count) - 1) : String(Number(p.likes_count) + 1)
                }
            }
            return p;
        }));
    };

    const saveUnsavePost = async (postId: string) => {
        setPosts(prev => prev.map(p => {
            if (p.uuid === postId) {
                return {
                    ...p,
                    is_saved: !p.is_saved
                }
            }
            return p;
        }));
    };

    return (
        <div className="flex flex-col gap-4 mt-4 w-full">
            {posts.map((post) => (
                <EachSocialPost
                    key={post.uuid}
                    user={mockUser}
                    setPosts={setPosts}
                    likeUnlikePost={likeUnlikePost}
                    saveUnsavePost={saveUnsavePost}
                    post={post}
                    currentVideoPlaying={currentVideoPlaying}
                    setCurrentVideoPlaying={setCurrentVideoPlaying}
                    isPlayingVideo={isPlayingVideo}
                    setIsPlayingVideo={setIsPlayingVideo}
                    onOpenPostDetails={() => { }}
                    onOpenReplyModal={() => { }}
                />
            ))}
        </div>
    );
};

export default ProfilePosts;
