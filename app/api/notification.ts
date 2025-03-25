'use server'

import { apiGet, apiPost } from 'lib/api'
import { baseApiCall } from 'lib/api/base'
import { getToken } from 'lib/getToken'


export const getCommentReplies = async (page: number, limit: number) => {
    const token = await getToken()

    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    })

    const response = await apiGet<ICommentsResponse>(
        `app/notifications?${params.toString()}`,
        token
    );
    return response;
};

