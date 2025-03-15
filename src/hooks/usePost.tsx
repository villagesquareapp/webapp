"use client";

import {
  createComments,
  getCommentReplies,
  getPostComments,
  likeOrUnlikeComments,
} from "api/post";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const usePost = (post: IPost, setPosts: React.Dispatch<React.SetStateAction<IPost[]>>) => {
  const [replyingTo, setReplyingTo] = useState<IPostComment | null>(null);
  const [newComment, setNewComment] = useState("");
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [postCommentLoading, setPostCommentLoading] = useState(false);
  const [comments, setComments] = useState<IPostComment[]>([]);
  const [commentsWithReplies, setCommentsWithReplies] = useState<
    Record<string, CommentWithReplies>
  >({});

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Updated state for replies
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const fetchComments = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getPostComments(post?.uuid, pageNumber);

      if (response?.status && response.data) {
        const allComments = response.data.data;

        // Separate top-level comments and replies
        const topLevelComments = allComments.filter((comment) => !comment.parent_id);
        const replies = allComments.filter((comment) => comment.parent_id);

        // Group replies by their parent comment
        const repliesByParent = replies.reduce((acc, reply) => {
          const parentId = reply.parent_id!;
          if (!acc[parentId]) {
            acc[parentId] = {
              loadedReplies: [],
              hasMoreReplies: false,
              replyPage: 1,
            };
          }
          acc[parentId].loadedReplies.push(reply);
          return acc;
        }, {} as Record<string, CommentWithReplies>);

        if (pageNumber === 1) {
          setComments(topLevelComments);
          setCommentsWithReplies(repliesByParent);
        } else {
          setComments((prev) => [...prev, ...topLevelComments]);
          setCommentsWithReplies((prev) => ({
            ...prev,
            ...repliesByParent,
          }));
        }

        const currentTotal =
          pageNumber === 1
            ? topLevelComments.length
            : comments.length + topLevelComments.length;
        setHasMore(currentTotal < response.data.total);
      } else {
        toast.error("Failed to fetch comments");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("An error occurred while fetching comments");
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setInitialFetchDone(true);
    }
  };

  const fetchReplies = async (commentId: string, page: number = 1) => {
    if (loadingReplies[commentId]) return;

    try {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

      const response = await getCommentReplies(post?.uuid, commentId, page);

      if (response?.status && response.data?.data) {
        const replies = response.data.data;
        const total = response.data.total;
        const currentPage = parseInt(response.data.current_page);

        setCommentsWithReplies((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            loadedReplies:
              page === 1 ? replies : [...(prev[commentId]?.loadedReplies || []), ...replies],
            hasMoreReplies:
              (prev[commentId]?.loadedReplies?.length || 0) + replies.length < total,
            replyPage: currentPage,
          },
        }));

        setExpandedComments((prev) => new Set(prev).add(commentId));
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      toast.error("Failed to load replies");
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const loadMoreReplies = (commentId: string) => {
    const currentComment = commentsWithReplies[commentId];
    if (currentComment?.hasMoreReplies && !loadingReplies[commentId]) {
      fetchReplies(commentId, (currentComment.replyPage || 1) + 1);
    }
  };

  const toggleReplies = (commentId: string) => {
    if (expandedComments.has(commentId)) {
      setExpandedComments((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    } else {
      if (!commentsWithReplies[commentId]?.loadedReplies) {
        fetchReplies(commentId);
      } else {
        setExpandedComments((prev) => new Set(prev).add(commentId));
      }
    }
  };

  const handleCommentLike = async (comment: IPostComment, parentCommentId?: string) => {
    const formData = new FormData();
    const result = await likeOrUnlikeComments(post.uuid, comment.uuid, formData);

    if (result?.status) {
      if (parentCommentId) {
        // Handle reply like
        setCommentsWithReplies((prev) => ({
          ...prev,
          [parentCommentId]: {
            ...prev[parentCommentId],
            loadedReplies: prev[parentCommentId]?.loadedReplies?.map((reply: IPostComment) =>
              reply.uuid === comment.uuid
                ? {
                    ...reply,
                    likes_count: result?.data?.is_liked
                      ? (Number(reply?.likes_count) + 1).toString()
                      : (Number(reply?.likes_count) - 1).toString(),
                    is_liked: result?.data?.is_liked || false,
                  }
                : reply
            ),
          },
        }));
      } else {
        // Handle main comment like
        setComments((prev) =>
          prev.map((c) =>
            c.uuid === comment.uuid
              ? {
                  ...c,
                  likes_count: result?.data?.is_liked
                    ? (Number(c?.likes_count) + 1).toString()
                    : (Number(c?.likes_count) - 1).toString(),
                  is_liked: result?.data?.is_liked || false,
                }
              : c
          )
        );
      }
    } else {
      toast.error(result?.message || "Failed to process like");
    }
  };

  // Intersection Observer setup
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore]);

  useEffect(() => {
    if (post?.uuid) {
      setPage(1);
      setComments([]);
      setHasMore(true);
      setInitialFetchDone(false);
      setExpandedComments(new Set());
      fetchComments(1);
    }
  }, [post?.uuid]);

  useEffect(() => {
    if (page > 1) {
      fetchComments(page);
    }
  }, [page]);

  const handleEmojiClick = (emoji: string) => {
    setNewComment((prev) => prev + emoji);
  };

  const handleSubmitComment = async () => {
    if (postCommentLoading) return;
    const newCommentData: INewComment = {
      comment: newComment,
    };

    if (replyingTo) newCommentData.parent_id = replyingTo.uuid;

    try {
      setPostCommentLoading(true);
      const response = await createComments(post.uuid, newCommentData);

      if (response?.status) {
        const newCommentObj = response.data as IPostComment;
        setNewComment("");

        if (replyingTo) {
          // Update the reply count of the parent comment
          setComments((prev) =>
            prev.map((comment) => {
              if (comment.uuid === replyingTo.uuid) {
                return {
                  ...comment,
                  reply_count: comment.reply_count + 1,
                };
              }
              return comment;
            })
          );

          // Add the new reply to commentsWithReplies
          setCommentsWithReplies((prev) => ({
            ...prev,
            [replyingTo.uuid]: {
              ...prev[replyingTo.uuid],
              loadedReplies: [newCommentObj, ...(prev[replyingTo.uuid]?.loadedReplies || [])],
            },
          }));
        } else {
          // Add new top-level comment
          setComments((prev) => [newCommentObj, ...prev]);
        }

        setReplyingTo(null);

        // Update the total comment count in the post
        setPosts((prev) =>
          prev.map((p) =>
            p.uuid === post.uuid
              ? { ...p, comments_count: (parseInt(p.comments_count) + 1).toString() }
              : p
          )
        );
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("An error occurred while posting comment");
    }
  };

  return {
    replyingTo,
    setReplyingTo,
    newComment,
    setNewComment,
    openCommentDialog,
    setOpenCommentDialog,
    postCommentLoading,
    setPostCommentLoading,
    comments,
    setComments,
    commentsWithReplies,
    handleEmojiClick,
    handleSubmitComment,
    setCommentsWithReplies,
    toggleReplies,
    loadMoreReplies,
    observerTarget,
    initialFetchDone,
  };
};

export default usePost;
