import { baseApiCall, ApiResponse } from './base'

export async function apiPost<T>(route: string, body: any, token?: string): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return baseApiCall<T>('POST', route, {
        headers,
        body: JSON.stringify(body),
    })
}

