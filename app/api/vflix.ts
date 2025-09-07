'use server';

import { apiGet, apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export const getVflixPosts = async (page: number) => {
    const token = await getToken();

    const params = new URLSearchParams({
        page: String(page),
    })

    const response = await apiGet<IVFlixResponse>(
        `/posts/vflix/foryou?${params.toString()}`,
        token
    );
    return response;
};

export async function likeOrUnlikeVflix(postId: string, formData: FormData) {
    const token = await getToken();
    return await apiPost<ILikeOrUnlikeVflixResponse>(`/posts/vflix/${postId}/like`, {
        body: formData,
        isFormData: true
    }, token)
};