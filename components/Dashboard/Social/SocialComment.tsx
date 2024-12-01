import { getCommentReplies, getPostComments } from "app/api/post";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import Comment from "./Comment";
import { Separator } from "components/ui/separator";

const SocialComment = ({
  onChangeReplyingTo,
  postId,
}: {
  onChangeReplyingTo: (commentId: string | null) => void;
  postId: string;
}) => {
  const [comments, setComments] = useState<IPostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // State for replies
  const [repliesMap, setRepliesMap] = useState<Record<string, IPostComment[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const fetchComments = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getPostComments(postId, pageNumber);

      if (response?.status && response.data) {
        const newComments = response.data.data;

        if (pageNumber === 1) {
          setComments(newComments);
        } else {
          setComments((prev) => [...prev, ...newComments]);
        }

        const currentTotal =
          pageNumber === 1 ? newComments.length : comments.length + newComments.length;
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

  const fetchReplies = async (commentId: string) => {
    if (loadingReplies[commentId]) return;

    try {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

      const response = await getCommentReplies(postId, commentId, 1);

      if (response?.status && response.data?.data) {
        const replies = response.data.data;
        setRepliesMap((prev) => ({
          ...prev,
          [commentId]: replies,
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

  const toggleReplies = (commentId: string) => {
    if (expandedComments.has(commentId)) {
      setExpandedComments((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    } else {
      if (!repliesMap[commentId]) {
        fetchReplies(commentId);
      } else {
        setExpandedComments((prev) => new Set(prev).add(commentId));
      }
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
      setRepliesMap({});
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
        <div className="text-center py-4 text-muted-foreground">No comments yet</div>
      </div>
    );
  }

  return (
    <div className="flex-1 !overflow-y-auto px-6">
      {comments.map((comment) => (
        <div key={comment.uuid} className="flex flex-col gap-y-4">
          <Comment
            type="mainComment"
            comment={comment}
            onReply={() => onChangeReplyingTo(comment.uuid)}
          />

          {/* Show replies if comment has any and is expanded */}
          {comment.reply_count > 0 && (
            <div
              className="ml-16 text-sm text-primary cursor-pointer"
              onClick={() => toggleReplies(comment.uuid)}
            >
              {expandedComments.has(comment.uuid) ? "Hide" : "Show"} {comment.reply_count}{" "}
              replies
            </div>
          )}

          {/* Replies section */}
          {expandedComments.has(comment.uuid) && (
            <div className="w-[90%] ml-auto flex flex-col gap-y-4">
              {loadingReplies[comment.uuid] ? (
                <LoadingSpinner />
              ) : (
                repliesMap[comment.uuid]?.map((reply) => (
                  <Comment
                    key={reply.uuid}
                    type="subComment"
                    comment={reply}
                    onReply={() => onChangeReplyingTo(reply.uuid)}
                  />
                ))
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
