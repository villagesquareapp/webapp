import { getCommentReplies, getPostComments, likeOrUnlikeComments } from "app/api/post";
import { Separator } from "components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import Comment from "./Comment";
import { v4 as uuidv4 } from "uuid";
import { CommentWithReplies } from "./types";

const SocialComment = ({
  onChangeReplyingTo,
  postId,
  comments,
  setComments,
  commentsWithReplies,
  setCommentsWithReplies,
  token,
}: {
  onChangeReplyingTo: (postComment: IPostComment, parentComment?: IPostComment) => void;
  postId: string;
  comments: IPostComment[];
  setComments: React.Dispatch<React.SetStateAction<IPostComment[]>>;
  commentsWithReplies: Record<string, CommentWithReplies>;
  setCommentsWithReplies: React.Dispatch<
    React.SetStateAction<Record<string, CommentWithReplies>>
  >;
  token?: string;
}) => {
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

      const response = await getPostComments(postId, pageNumber, token);

      if (response?.status && response.data) {
        const allComments = response.data.data;

        // Separate top-level comments and replies
        const topLevelComments = allComments.filter((comment) => !comment.parent_post_id);
        const replies = allComments.filter((comment) => comment.parent_post_id);

        // Group replies by their parent comment
        const repliesByParent = replies.reduce((acc, reply) => {
          const parentId = reply.parent_post_id!;
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

      const response = await getCommentReplies(postId, commentId, page, token);

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
    const result = await likeOrUnlikeComments(postId, comment.uuid, formData, token);

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
    if (postId) {
      setPage(1);
      setComments([]);
      setHasMore(true);
      setInitialFetchDone(false);
      setExpandedComments(new Set());
      fetchComments(1);
    }
  }, [postId]);

  useEffect(() => {
    if (page > 1) {
      fetchComments(page);
    }
  }, [page]);

  if (loading && !initialFetchDone) {
    return (
      <div className="flex-1 overflow-y-auto px-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loading && comments.length === 0 && initialFetchDone) {
    return (
      <div className="flex-1 overflow-y-auto px-6">
        <div className="text-center py-4 text-muted-foreground">
          {" "}
          No comments yet! <br /> Be the first one to comment.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 !overflow-y-auto px-6">
      {comments.map((comment) => (
        <div key={`${comment.uuid}-${uuidv4()}`} className="flex flex-col gap-y-4">
          <Comment
            type="mainComment"
            comment={comment}
            onReply={() => onChangeReplyingTo(comment)}
            onLike={() => handleCommentLike(comment)}
          />

          {Number(comment?.replies_count) > 0 && (
            <div
              className="ml-16 text-sm text-primary cursor-pointer"
              onClick={() => toggleReplies(comment.uuid)}
            >
              {expandedComments.has(comment.uuid) ? "Hide" : "Show"} {comment.replies_count}{" "}
              replies
            </div>
          )}

          {/* Replies section */}
          {expandedComments.has(comment.uuid) && (
            <div className="w-[90%] ml-auto flex flex-col gap-y-4">
              {loadingReplies[comment.uuid] &&
              !commentsWithReplies[comment.uuid]?.loadedReplies ? (
                <LoadingSpinner />
              ) : (
                <>
                  {commentsWithReplies[comment.uuid]?.loadedReplies?.map(
                    (reply: IPostComment) => (
                      <Comment
                        key={reply.uuid}
                        type="subComment"
                        comment={reply}
                        onReply={() => onChangeReplyingTo(reply, comment)}
                        onLike={() => handleCommentLike(reply, comment.uuid)}
                      />
                    )
                  )}

                  {commentsWithReplies[comment.uuid]?.hasMoreReplies && (
                    <button
                      onClick={() => loadMoreReplies(comment.uuid)}
                      className="text-sm text-primary ml-4"
                      disabled={loadingReplies[comment.uuid]}
                    >
                      {loadingReplies[comment.uuid] ? <LoadingSpinner /> : "Load more replies"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          <Separator className="mt-4 mb-2" />
        </div>
      ))}

      {hasMore && <div ref={observerTarget} style={{ height: "10px" }} />}

      {loadingMore && (
        <div className="py-4 text-center">
          <LoadingSpinner />
        </div>
      )}

      {!loading && !hasMore && comments.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">No more comments to load</div>
      )}
    </div>
  );
};

export default SocialComment;
