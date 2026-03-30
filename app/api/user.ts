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