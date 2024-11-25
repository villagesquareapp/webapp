"use client";

import Image from "next/image";
import { likePost, unlikePost, savePost, unsavePost, sharePost } from "app/api/post";
import { useState } from "react";
import { toast } from "sonner";

interface SocialPostProps {
  post: IPost;
}

const SocialPost = ({ post }: SocialPostProps) => {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isSaved, setIsSaved] = useState(post.is_saved);
  const [likesCount, setLikesCount] = useState(Number(post.likes_count));

  const handleLike = async () => {
    try {
      const response = await (isLiked ? unlikePost(post.uuid) : likePost(post.uuid));
      if (response.status) {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  const handleSave = async () => {
    try {
      const response = await (isSaved ? unsavePost(post.uuid) : savePost(post.uuid));
      if (response.status) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      toast.error("Failed to update save status");
    }
  };

  const handleShare = async () => {
    try {
      await sharePost(post.uuid);
      toast.success("Post shared successfully");
    } catch (error) {
      toast.error("Failed to share post");
    }
  };

  return (
    <div className="border rounded-lg p-4">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={post.user.profile_picture || "/default-avatar.png"}
          alt={post.user.name || "User"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold">{post.user.name || "Anonymous"}</h3>
          <p className="text-sm text-muted-foreground">@{post.user.username}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="mb-4">{post.caption}</p>

      {/* Post Media */}
      <div className="grid gap-2">
        {post.media.map((media) => (
          <div key={media.uuid} className="relative aspect-video">
            {media.media_type === "image" ? (
              <Image
                src={media.media_url}
                alt="Post media"
                fill
                className="object-cover rounded"
              />
            ) : (
              <video
                src={media.transcoded_media_url || media.media_url}
                controls
                className="w-full h-full rounded"
                poster={media.media_thumbnail}
              />
            )}
          </div>
        ))}
      </div>

      {/* Post Stats */}
      <div className="flex justify-between mt-4">
        <button onClick={handleLike}>Likes: {likesCount}</button>
        <button onClick={handleSave}>{isSaved ? "Saved" : "Save"}</button>
        <button onClick={handleShare}>Share</button>
      </div>
    </div>
  );
};

export default SocialPost;
