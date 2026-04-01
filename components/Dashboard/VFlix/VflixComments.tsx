// components/Dashboard/VFlix/VflixComments.tsx

import { getVflixComments, createVflixComment, likeOrUnlikeVflixComment, getVflixReplies } from "api/vflix";
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
import { BsDot } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
  user: IUser;
  source?: string;
}

export default function VflixComments({
  isOpen,
  onClose,
  postId,
  user,
  source,
}: Props) {
  const router = useRouter();
  const [comments, setComments] = useState<IGetVflixComments[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Replies State
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [repliesCache, setRepliesCache] = useState<Record<string, IGetVflixComments[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    if (!isOpen || !postId) return;
    async function fetchComments() {
      try {
        setLoading(true);
        const response = await getVflixComments(postId ? postId : "", 1, source);
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
        parent_id: replyingTo ? replyingTo.id : undefined,
      }, source);

      if (response?.status && response.data) {
        toast.success(replyingTo ? "Reply added successfully!" : "Comment added successfully!");

        const newCommentObj = {
          ...response.data,
          user,
          formatted_time: "Just now",
          reply_count: 0,
        } as IGetVflixComments;

        if (replyingTo) {
          // If this is a reply, add it to the specific replies object array for that comment
          setRepliesCache((prev) => ({
            ...prev,
            [replyingTo.id]: prev[replyingTo.id]
              ? [...prev[replyingTo.id], newCommentObj]
              : [newCommentObj]
          }));

          // Force expand the replies drawer so the user immediately sees it
          setExpandedReplies((prev) => ({ ...prev, [replyingTo.id]: true }));

          // Increment the specific comment's reply count visually
          setComments((prev) =>
            prev.map((comment) =>
              comment.uuid === replyingTo.id
                ? { ...comment, reply_count: Number(comment.reply_count) + 1 }
                : comment
            )
          );
        } else {
          // Normal top-level comment
          setComments((prev) => [newCommentObj, ...prev]);
        }

        setCommentContent("");
        setReplyingTo(null);
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
      const formData = new FormData();
      const result = await likeOrUnlikeVflixComment(postId, commentId, formData, source);

      if (!result?.status) {
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

  const toggleReplies = async (commentId: string) => {
    if (!postId) return;

    if (expandedReplies[commentId]) {
      // Collapse replies
      setExpandedReplies((prev) => ({ ...prev, [commentId]: false }));
      return;
    }

    // Expand replies
    setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));

    // Fetch if not already in cache
    if (!repliesCache[commentId]) {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
      try {
        const res = await getVflixReplies(postId, commentId, 1, source);
        if (res.status && res.data) {
          setRepliesCache((prev) => ({
            ...prev,
            [commentId]: res.data?.data || [],
          }));
        }
      } catch (error) {
        console.error("Failed to fetch replies for comment", commentId, error);
        toast.error("Failed to load replies.");
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
      }
    }
  };

  const handleReplyClick = (commentId: string, username: string | null) => {
    setReplyingTo({ id: commentId, username: username || "User" });
    // Focus logic could go here if keeping a ref to the textarea
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "bg-black/50" : "bg-transparent pointer-events-none"
        }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 right-0 h-[60%] w-full max-w-lg bg-background transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div></div>
          <h2 className="text-lg font-semibold text-foreground text-center">
            Comments ({comments.length})
          </h2>
          <button
            onClick={onClose}
            className="text-foreground hover:text-white p-1"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col h-[calc(100%-120px)] p-4 text-foreground overflow-y-auto">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.uuid}
                className="flex flex-col gap-2 border-b pb-4 mb-4"
              >
                <div className="flex items-start gap-2">
                  <CustomAvatar
                    src={comment?.user?.profile_picture || ""}
                    name={comment?.user?.name || ""}
                    className="size-8"
                  />
                  <div className="flex flex-col w-full">
                    <div className="flex items-center">
                      <span
                        className="font-semibold text-base text-foreground cursor-pointer hover:underline"
                        onClick={() => comment?.user?.username && router.push(`/u/${comment.user.username}`)}
                      >
                        {comment?.user?.name}
                      </span>
                      {!!comment?.user?.verified_status && (
                        <HiMiniCheckBadge className="size-4 text-green-600 ml-1" />
                      )}
                      <BsDot className="text-foreground"/>
                      {comment.formatted_time && (
                        <span className="text-foreground text-sm">
                          {comment.formatted_time}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm text-foreground py-1">
                        {comment.comment}
                      </p>
                      {/* <button
                        className="text-gray-400 text-sm shrink-0 cursor-pointer hover:text-white font-medium ml-2"
                        onClick={() => handleReplyClick(comment.uuid, comment?.user?.name)}
                      >
                        Reply
                      </button> */}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-x-7 items-center pl-10">
                  <div className="flex flex-row gap-x-1 items-center">
                    <PiHeartFill
                      onClick={() => likeUnlikeComment(comment.uuid)}
                      className={`size-4 cursor-pointer transition-colors ${comment.is_liked ? "text-red-500" : "text-gray-400"
                        } hover:text-red-500`}
                    />
                    <p className="text-sm">{comment?.likes_count}</p>
                  </div>
                  {/* <div
                    className="flex flex-row gap-x-1 items-center"
                    onClick={() => comment.reply_count > 0 && toggleReplies(comment.uuid)}
                  >
                    <IoChatbubbleEllipses
                      className={`size-4 ${comment.reply_count > 0 ? "cursor-pointer text-gray-400 hover:text-blue-500" : "text-gray-600"} transition-colors`}
                    />
                    <p className="text-sm">{comment.reply_count}</p>
                  </div> */}
                </div>

                {/* --- Nested Replies Section --- */}
                {comment.reply_count > 0 && (
                  <div className="pl-10 mt-1">
                    {/* <button
                      className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                      onClick={() => toggleReplies(comment.uuid)}
                    >
                      {expandedReplies[comment.uuid] ? "Hide replies" : `View ${comment.reply_count} replies`}
                    </button> */}

                    {expandedReplies[comment.uuid] && (
                      <div className="mt-3 flex flex-col gap-4">
                        {loadingReplies[comment.uuid] ? (
                          <div className="flex justify-center py-2">
                            <Loader2 className="size-5 animate-spin text-gray-400" />
                          </div>
                        ) : repliesCache[comment.uuid]?.length > 0 ? (
                          repliesCache[comment.uuid].map((reply) => (
                            <div key={reply.uuid} className="flex items-start gap-2">
                              <CustomAvatar
                                src={reply?.user?.profile_picture || ""}
                                name={reply?.user?.name || ""}
                                className="size-6"
                              />
                              <div className="flex flex-col w-full">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">
                                    {reply?.user?.name}
                                  </span>
                                  {!!reply?.user?.verified_status && (
                                    <HiMiniCheckBadge className="size-3 text-green-600" />
                                  )}
                                  {reply.formatted_time && (
                                    <span className="text-gray-400 text-xs">
                                      {reply.formatted_time}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between w-full">
                                  <p className="text-sm text-gray-300 mt-1">
                                    {reply.comment}
                                  </p>
                                  <button
                                    className="text-gray-400 text-xs shrink-0 cursor-pointer hover:text-white font-medium ml-2"
                                    onClick={() => handleReplyClick(comment.uuid, reply?.user?.name)}
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500">No replies found.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {/* --- End Nested Replies --- */}
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
            {/* {["👍", "❤️", "👏", "😊", "😐", "🤩", "😢"].map((emoji, index) => (
              <span
                key={index}
                className="text-3xl cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}{" "}
              </span>
            ))} */}
          </div>
          <div className="flex flex-col h-fit gap-y-2">
            {replyingTo && (
              <div className="flex items-center justify-between bg-gray-800 text-xs text-gray-300 p-2 rounded-lg">
                <span>Replying to <span className="font-semibold text-white">@{replyingTo.username}</span></span>
                <IoClose className="size-4 cursor-pointer hover:text-white" onClick={() => setReplyingTo(null)} />
              </div>
            )}
            <div className="flex flex-row h-fit gap-x-2 items-center">
              <CustomAvatar
                src={user.profile_picture || ""}
                name="user profile"
                className="size-12 border-foreground border"
              />
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={replyingTo ? `Replying to @${replyingTo.username}...` : "Add a comment..."}
                disabled={isSubmitting}
                className="flex-1 resize-none h-10 p-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 outline-none"
              />
              <div
                className={`p-2 shrink-0 rounded-full size-12 place-content-center bg-primary items-center flex cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
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
    </div>
  );
};