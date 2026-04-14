"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useDataCache } from "context/DataCacheContext";

export const useProfile = (userIdOrUsername: string) => {
    const { getCachedData, setCachedData, isCacheValid } = useDataCache();
    const [profile, setProfile] = useState<IUserProfileResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!userIdOrUsername) return;

        const cacheKey = `profile-${userIdOrUsername}`;
        const cached = getCachedData<IUserProfileResponse>(cacheKey);
        if (cached && isCacheValid(cacheKey)) {
            setProfile(cached);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/users/${userIdOrUsername}/profile`);
            const response = await res.json();
            if (response?.status && response.data) {
                setProfile(response.data);
                setCachedData(cacheKey, response.data);
            } else {
                const errorMsg = response?.message || "Failed to fetch profile";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err: any) {
            console.error("Error fetching user profile:", err);
            const errorMsg = err.message || "An error occurred while fetching the profile";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [userIdOrUsername]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        error,
        refetch: fetchProfile,
    };
};
