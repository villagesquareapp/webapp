import { baseApiCall, ApiResponse } from './base'

export async function apiDelete(route: string, token: string): Promise<ApiResponse> {
    return baseApiCall('DELETE', route, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
}
