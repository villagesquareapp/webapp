export interface CommentWithReplies {
    loadedReplies: IPostComment[];
    hasMoreReplies: boolean;
    replyPage: number;
} 