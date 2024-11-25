import { baseApiCall, ApiResponse } from './base'
import { revalidatePathClient } from '../revalidate'

export async function apiGet<T>(route: string, token?: string): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    const response = await baseApiCall<T>('GET', route, { headers })

    // Revalidate the path on the client side
    await revalidatePathClient(route)

    return response
}

