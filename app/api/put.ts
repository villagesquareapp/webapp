import { baseApiCall, ApiResponse } from './base'

export async function apiPut<T>(route: string, body: any, token: string): Promise<ApiResponse<T>> {
    return baseApiCall<T>('PUT', route, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    })
}

