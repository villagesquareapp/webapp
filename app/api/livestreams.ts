'use server'

import { apiGet } from 'lib/api';
import { getToken } from 'lib/getToken';

export const getFeaturedLivestreams = async (limit: number, page: number = 1) => {
    const token = await getToken();

    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    })

    const response = await apiGet<IFeaturedLivestreamResponse>(
        `livestreams/explore/featured?${params.toString()}`,
        token
    );
    return response;
};
