'use server'

import { apiGet, apiPost } from 'lib/api';
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

// Create a new livestream and return streaming credentials (server and key)
export const createLivestream = async (body: Record<string, any> = {}) => {
    const token = await getToken();

    // The backend returns the ingest server and stream key which can be
    // used with OBS.  No payload is required for the default behaviour so
    // we send an empty object if none is provided.
    const response = await apiPost<ICreateLivestreamCredentials>(
        `livestreams/create`,
        body,
        token
    );

    return response;
};

export interface ICreateLivestreamCredentials {
    server: string;
    stream_key: string;
    stream_url?: string;
}
