import { ApiResponse, baseApiCall } from './base'

export async function apiGet<T>(route: string, token?: string): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    const response = await baseApiCall<T>('GET', route, { headers }, token)

    return response;
}

// Corrected apiGet.ts

// import { ApiResponse, baseApiCall } from "./base";

// export async function apiGet<T>(
//   route: string,
//   token?: string
// ): Promise<ApiResponse<T> | null> {
//   const response = await baseApiCall<T>("GET", route, {}, token);

//   if (response?.status) {
//     return response;
//   }
//   return null;
// }

// export async function apiGet<T>(
//   route: string,
//   token?: string
// ): Promise<ApiResponse<T>> {
//   const response = await baseApiCall<T>("GET", route, {}, token);
//   return response;
// }
