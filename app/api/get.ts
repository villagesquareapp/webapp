import { baseApiCall, ApiResponse } from './base'

export async function apiGet<T>(route: string, token?: string): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return baseApiCall<T>('GET', route, { headers })
}

