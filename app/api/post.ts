import { baseApiCall } from 'lib/api/base'

interface GetPostsParams {
    order?: 'latest' | 'popular'
    location?: string
    include?: string
    page?: number
}

export async function getPosts(params: GetPostsParams = {}) {
    const queryParams = new URLSearchParams()

    if (params.order) queryParams.append('order', params.order)
    if (params.location) queryParams.append('location', params.location)
    if (params.include) queryParams.append('include', params.include)
    if (params.page) queryParams.append('page', params.page.toString())

    const route = `/posts/social/foryou?${queryParams.toString()}`

    return await baseApiCall<IPost[]>('GET', route)
}

export async function likePost(postId: string) {
    return await baseApiCall('POST', `/posts/${postId}/like`)
}

export async function unlikePost(postId: string) {
    return await baseApiCall('DELETE', `/posts/${postId}/like`)
}

export async function savePost(postId: string) {
    return await baseApiCall('POST', `/posts/${postId}/save`)
}

export async function unsavePost(postId: string) {
    return await baseApiCall('DELETE', `/posts/${postId}/save`)
}

export async function sharePost(postId: string) {
    return await baseApiCall('POST', `/posts/${postId}/share`)
}
