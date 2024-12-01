'use server'

import { apiGet } from 'lib/api'
import { baseApiCall } from 'lib/api/base'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/authOptions'

interface GetPostsParams {
    order?: 'latest' | 'popular'
    location?: string
    include?: string
    page?: number
}

export async function getPosts(params: GetPostsParams = {}) {
    // Get the session
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    const queryParams = new URLSearchParams()

    if (params.order) queryParams.append('order', params.order)
    if (params.location) queryParams.append('location', params.location)
    if (params.include) queryParams.append('include', params.include)
    if (params.page) queryParams.append('page', params.page.toString())

    const route = `/posts/social/foryou?${queryParams.toString()}`

    const data = await apiGet<IPostsResponse>(route, token)
    return data || null
}

export async function likeOrUnlikePost(postId: string, formData: FormData) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    return await baseApiCall<ILikeOrUnlikePostResponse>('POST', `/posts/${postId}/like`, {
        body: formData,
        isFormData: true
    }, token)
}

export async function saveOrUnsavePost(postId: string, formData: FormData) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    return await baseApiCall<ISaveOrUnsavePostResponse>('POST', `/posts/${postId}/save`, { body: formData, isFormData: true }, token)
}


export async function sharePost(postId: string) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    return await baseApiCall('POST', `/posts/${postId}/share`, {}, token)
}

export const getPostComments = async (postId: string, page: number = 1) => {
    try {
        // Get the session
        const session = await getServerSession(authOptions)
        const token = session?.user?.token

        const response = await apiGet<ICommentsResponse>(`posts/${postId}/comments?page=${page}`, token);
        return response;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return null;
    }
};

export const getCommentReplies = async (postId: string, commentId: string, page: number = 1) => {
    try {
        const session = await getServerSession(authOptions)
        const token = session?.user?.token

        const response = await apiGet<ICommentsResponse>(
            `posts/${postId}/comments/${commentId}?page=${page}`,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching comment replies:", error);
        return null;
    }
};

