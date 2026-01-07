import { apiGet, apiPost } from "lib/api";

export const getPostCommentsClient = async (postId: string, token: string, page: number = 1) => {
    const response = await apiGet<ICommentsResponse>(
        `posts/${postId}/replies?page=${page}`,
        token
    );
    return response;
};

export const likeOrUnlikePostClient = async (postId: string, token: string) => {
    return await apiPost<ILikeOrUnlikePostResponse>(
        `/posts/${postId}/like`,
        {
            isFormData: true
        },
        token
    );
};
