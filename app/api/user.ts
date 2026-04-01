"use server";

import { apiGet } from "lib/api/get";
import { getToken } from "lib/getToken";

export const getProfile = async (userId: string) => {
    try {
        const token = await getToken();
        const response = await apiGet<IUserProfileResponse>(
            `/users/${userId}/profile`,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const getUserPosts = async (userId: string, page: number = 1) => {
    try {
        const token = await getToken();
        const response = await apiGet<IPostsResponse>(
            `/users/${userId}/posts?page=${page}`,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
};

export const getUserVflix = async (userId: string, page: number = 1) => {
    try {
        const token = await getToken();
        const response = await apiGet<IVFlixResponse>(
            `/users/${userId}/vflix?page=${page}`,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching user vflix:", error);
        throw error;
    }
};

export const getUserLikedPosts = async (userId: string, page: number = 1) => {
    try {
        const token = await getToken();
        const response = await apiGet<IPostsResponse>(
            `/users/${userId}/posts/liked?page=${page}`,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching user liked posts:", error);
        throw error;
    }
};

/**
 * Resolves a username to a UUID using the user search endpoint.
 * Cached in-memory to avoid repeated API calls for the same username.
 */
const usernameUUIDCache = new Map<string, string>();

export const resolveUsernameToUUID = async (username: string): Promise<string | null> => {
    const cached = usernameUUIDCache.get(username.toLowerCase());
    if (cached) return cached;

    try {
        const token = await getToken();
        const response = await apiGet<{ data: { data: Array<{ uuid: string; username: string }> } }>(
            `/users/search?query=${encodeURIComponent(username)}`,
            token
        );
        if (response?.data?.data && Array.isArray(response.data.data)) {
            const match = response.data.data.find(
                (u) => u.username?.toLowerCase() === username.toLowerCase()
            );
            if (match?.uuid) {
                usernameUUIDCache.set(username.toLowerCase(), match.uuid);
                return match.uuid;
            }
        }
        return null;
    } catch (error) {
        console.error("Error resolving username to UUID:", error);
        return null;
    }
};