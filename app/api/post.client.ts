import { apiGet } from "lib/api";

export const getPostCommentsClient = async (postId: string, token: string, page: number = 1) => {
    const response = await apiGet<ICommentsResponse>(
        `posts/${postId}/replies?page=${page}`,
        token
    );
    return response;
};
