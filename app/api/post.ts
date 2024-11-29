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

export async function likePost(postId: string) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    return await baseApiCall('POST', `/posts/${postId}/like`, {}, token)
}

export async function unlikePost(postId: string) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    return await baseApiCall('DELETE', `/posts/${postId}/like`, {}, token)
}

export async function savePost(postId: string) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    return await baseApiCall('POST', `/posts/${postId}/save`, {}, token)
}

export async function unsavePost(postId: string) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    return await baseApiCall('DELETE', `/posts/${postId}/save`, {}, token)
}

export async function sharePost(postId: string) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    return await baseApiCall('POST', `/posts/${postId}/share`, {}, token)
}

