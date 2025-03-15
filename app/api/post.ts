'use server'

import { apiGet, apiPost } from 'lib/api'
import { baseApiCall } from 'lib/api/base'
import { getToken } from 'lib/getToken'

interface GetPostsParams {
    order?: 'latest' | 'popular'
    location?: string
    include?: string
    page?: number
}

export async function getPosts(params: GetPostsParams = {}) {
    // Get the session
    const token = await getToken()
    const queryParams = new URLSearchParams()

    if (params.order) queryParams.append('order', params.order)
    if (params.location) queryParams.append('location', params.location)
    if (params.include) queryParams.append('include', params.include)
    if (params.page) queryParams.append('page', params.page.toString())

    const route = `/posts/social/foryou?${queryParams.toString()}`

    const data = await apiGet<IPostsResponse>(route, token)
    return data || null
}

export async function createPost(formData: FormData) {
    const token = await getToken()
    return await baseApiCall<IPostsResponse>('POST', `/posts/create`, {
        body: formData,
        isFormData: true
    }, token)
}

export async function likeOrUnlikePost(postId: string, formData: FormData) {
    const token = await getToken()
    return await baseApiCall<ILikeOrUnlikePostResponse>('POST', `/posts/${postId}/like`, {
        body: formData,
        isFormData: true
    }, token)
}

export async function saveOrUnsavePost(postId: string, formData: FormData) {
    const token = await getToken()
    return await baseApiCall<ISaveOrUnsavePostResponse>('POST', `/posts/${postId}/save`, { body: formData, isFormData: true }, token)
}


export async function sharePost(postId: string) {
    const token = await getToken()
    return await baseApiCall('POST', `/posts/${postId}/share`, {}, token)
}

// ============== Comments =================

export const getPostComments = async (postId: string, page: number = 1) => {
    const token = await getToken()
    const response = await apiGet<ICommentsResponse>(`posts/${postId}/comments?page=${page}`, token);
    return response;
};

export const createComments = async (postId: string, newCommentData: INewComment) => {
    const token = await getToken()
    const response = await apiPost<IPostComment>(`posts/${postId}/comments/add`, newCommentData, token);
    return response;
};

export const getCommentReplies = async (postId: string, commentId: string, page: number = 1) => {
    const token = await getToken()
    const response = await apiGet<ICommentsResponse>(
        `posts/${postId}/comments/${commentId}?page=${page}`,
        token
    );
    return response;
};


export async function likeOrUnlikeComments(postId: string, commentId: string, formData: FormData) {
    const token = await getToken()
    return await baseApiCall<ILikeOrUnlikePostResponse>('POST', `/posts/${postId}/comments/${commentId}/like`, {
        body: formData,
        isFormData: true
    }, token)
}

