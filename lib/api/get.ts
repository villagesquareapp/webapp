import { baseApiCall, ApiResponse } from './base'
import { revalidatePathClient } from '../revalidate'

export async function apiGet<T>(route: string, token?: string): Promise<ApiResponse<T>> {
    console.log("token I GOT", token)
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    const response = await baseApiCall<T>('GET', route, { headers }, token)
    console.log("response I GOT", response)

    return response
}

