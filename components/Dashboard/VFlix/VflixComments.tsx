// components/Dashboard/VFlix/VflixComments.tsx

import { getVflixComments, createVflixComment, likeOrUnlikeVflixComment } from "api/vflix";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { useCallback, useEffect, useState } from "react";
import { IoClose, IoChatbubbleEllipses } from "react-icons/io5";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { HiMiniCheckBadge } from "react-icons/hi2";
import NotFoundResult from "../Reusable/NotFoundResult";
import { Loader2 } from "lucide-react";
import { VSSend } from "components/icons/village-square";
import { PiHeartFill } from "react-icons/pi";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
  user: IUser;
}

export default function VflixComments({
  isOpen,
  onClose,
  postId,
  user,
}: Props) {
  const [comments, setComments] = useState<IGetVflixComments[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !postId) return;
    async function fetchComments() {
      try {
        setLoading(true);
        const response = await getVflixComments(postId ? postId : "", 1);
        setComments(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [isOpen, postId]);

  const handleEmojiClick = (emoji: string) => {
    setCommentContent((prev) => prev + emoji);
  };

  const onSubmitComment = async () => {
    if (!commentContent.trim() || !postId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await createVflixComment(postId, {
        comment: commentContent,
      });

      if (response?.status && response.data) {
        toast.success("Comment added successfully!");

        // Ensure object is correctly typed.
        setComments((prev) => [
          {
            ...response.data,
            user,
            formatted_time: "Just now",
            reply_count: 0,
          } as IGetVflixComments,
          ...prev,
        ]);

        setCommentContent("");
      } else {
        toast.error("Failed to add comment. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the comment.");
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const likeUnlikeComment = useCallback(async (commentId: string) => {
    if (!postId) return;

    // Optimistically update the UI
    setComments((prev) =>
      prev.map((comment) =>
        comment.uuid === commentId
          ? {
              ...comment,
              likes_count: comment?.is_liked
                ? (Number(comment.likes_count) - 1).toString()
                : (Number(comment.likes_count) + 1).toString(),
              is_liked: !comment.is_liked,
            }
          : comment
      )
    );

    try {
      // Make API call
      const formData = new FormData();
      const result = await likeOrUnlikeVflixComment(postId, commentId, formData);

      if (!result?.status) {
        // Revert on failure
        setComments((prev) =>
          prev.map((comment) =>
            comment.uuid === commentId
              ? {
                  ...comment,
                  likes_count: comment.is_liked
                    ? (Number(comment.likes_count) + 1).toString()
                    : (Number(comment.likes_count) - 1).toString(),
                  is_liked: !comment.is_liked,
                }
              : comment
          )
        );
        toast.error(result?.message || "Failed to update like");
      }
    } catch (error) {
      // Revert optimistic update on error
      setComments((prev) =>
        prev.map((comment) =>
          comment.uuid === commentId
            ? {
                ...comment,
                likes_count: comment.is_liked
                  ? (Number(comment.likes_count) + 1).toString()
                  : (Number(comment.likes_count) - 1).toString(),
                is_liked: !comment.is_liked,
              }
            : comment
        )
      );
      console.error("Error liking comment:", error);
      toast.error("An error occurred while liking the comment.");
    }
  }, [postId]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "bg-black/50" : "bg-transparent pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 right-0 h-[60%] w-full max-w-lg bg-background transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div></div>
          <h2 className="text-lg font-semibold text-white text-center">
            Comments ({comments.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col h-[calc(100%-120px)] p-4 text-white overflow-y-auto">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.uuid}
                className="flex flex-col gap-2 border-b border-gray-700 pb-4 mb-4"
              >
                <div className="flex items-start gap-2">
                  <CustomAvatar
                    src={comment?.user?.profile_picture || ""}
                    name={comment?.user?.name || ""}
                    className="size-8"
                  />
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">
                        {comment?.user?.name}
                      </span>
                      {!!comment?.user?.verified_status && (
                        <HiMiniCheckBadge className="size-4 text-green-600" />
                      )}
                      {comment.formatted_time && (
                        <span className="text-gray-400 text-sm">
                          {comment.formatted_time}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm text-gray-300 py-1">
                        {comment.comment}
                      </p>
                      <p className="text-gray-400 text-sm shrink-0 cursor-pointer hover:text-gray-300">
                        Report
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-x-7 items-center pl-10">
                  <div className="flex flex-row gap-x-1 items-center">
                    <PiHeartFill
                      onClick={() => likeUnlikeComment(comment.uuid)}
                      className={`size-4 cursor-pointer transition-colors ${
                        comment.is_liked ? "text-red-500" : "text-gray-400"
                      } hover:text-red-500`}
                    />
                    <p className="text-sm">{comment?.likes_count}</p>
                  </div>
                  <div className="flex flex-row gap-x-1 items-center">
                    <IoChatbubbleEllipses
                      className={`size-4 cursor-pointer text-gray-400 hover:text-blue-500 transition-colors`}
                    />
                    <p className="text-sm">{comment.reply_count}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-4">
              <NotFoundResult content={<span>No comments available.</span>} />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 w-full bg-background border-t px-6 h-fit gap-y-4 py-4 flex flex-col">
          <div className="flex h-fit flex-row justify-between items-center">
            {["👍", "❤️", "👏", "😊", "😐", "🤩", "😢"].map((emoji, index) => (
              <span
                key={index}
                className="text-3xl cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}{" "}
              </span>
            ))}
          </div>
          <div className="flex flex-row h-fit gap-x-2 items-center">
            <CustomAvatar
              src={user.profile_picture || ""}
              name="user profile"
              className="size-12 border-foreground border"
            />
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              disabled={isSubmitting}
              className="flex-1 resize-none h-12 p-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 outline-none"
            />
            <div
              className={`p-2 shrink-0 rounded-full size-12 place-content-center bg-primary items-center flex cursor-pointer ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={onSubmitComment}
            >
              {isSubmitting ? (
                <Loader2 className="size-6 flex m-auto animate-spin" />
              ) : (
                <VSSend className="size-6 flex m-auto" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};