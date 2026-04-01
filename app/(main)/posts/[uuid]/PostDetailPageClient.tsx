"use client";

import PostDetails from "components/Dashboard/Social/PostDetails";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { likeOrUnlikePost, saveOrUnsavePost } from "api/post";
import ReplyToPostModal from "components/Dashboard/Social/ReplyToPostModal";
import SocialMainWrapper from "components/Dashboard/Social/SocialMainWrapper";

interface PostDetailPageClientProps {
    initialPost: IPost;
    user: IUser;
}

export default function PostDetailPageClient({
    initialPost,
    user,
}: PostDetailPageClientProps) {
    const router = useRouter();
    const [post, setPost] = useState<IPost>(initialPost);

    const [currentVideoPlaying, setCurrentVideoPlaying] = useState<string>("");
    const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

    // Scroll to top on mount
    useEffect(() => {
        const scrollContainer = document.getElementById("social-main-scroll");
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: "instant" });
        }
    }, []);

    // Reply Modal State
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [postForReply, setPostForReply] = useState<IPost | null>(null);
    const [replyToComment, setReplyToComment] = useState<IPostComment | null>(null);
    const [newReply, setNewReply] = useState<IPostComment | null>(null);

    const handleLike = async (postId: string) => {
        // Optimistic Update
        const isLiking = !post.is_liked;
        setPost(prev => ({
            ...prev,
            is_liked: isLiking,
            likes_count: isLiking
                ? (Number(prev.likes_count) + 1).toString()
                : (Number(prev.likes_count) - 1).toString()
        }));

        try {
            await likeOrUnlikePost(postId);
        } catch (err) {
            // Revert if error (simple version)
            setPost(initialPost);
        }
    };

    const handleSave = async (postId: string) => {
        try {
            await saveOrUnsavePost(postId);
            setPost(prev => ({
                ...prev,
                is_saved: !prev.is_saved
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenReplyModal = (p: IPost | IPostComment, r?: IPostComment) => {
        setPostForReply(p as IPost);
        setReplyToComment(r || null);
        setIsReplyModalOpen(true);
    };

    const handleReplySuccess = (reply: IPostComment) => {
        setNewReply(reply);
        setIsReplyModalOpen(false);
        // Refresh post comment count
        setPost(prev => ({
            ...prev,
            replies_count: (Number(prev.replies_count) + 1).toString()
        }));
    };

    return (
        <SocialMainWrapper>
            <PostDetails
                post={post}
                user={user}
                setPosts={() => { }} // Not needed for single post context
                onBack={() => router.back()}
                likeUnlikePost={handleLike}
                saveOrUnsavePost={handleSave}
                currentVideoPlaying={currentVideoPlaying}
                setCurrentVideoPlaying={setCurrentVideoPlaying}
                isPlayingVideo={isPlayingVideo}
                setIsPlayingVideo={setIsPlayingVideo}
                onOpenReplyModal={handleOpenReplyModal}
                onReplySuccess={handleReplySuccess}
                newReply={newReply}
            />

            {isReplyModalOpen && postForReply && (
                <ReplyToPostModal
                    open={isReplyModalOpen}
                    user={user}
                    post={postForReply}
                    onClose={() => setIsReplyModalOpen(false)}
                    onReplySuccess={handleReplySuccess}
                    replyToComment={replyToComment}
                    setPosts={() => { }}
                />
            )}
        </SocialMainWrapper>
    );
}
