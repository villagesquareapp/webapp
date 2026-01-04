'use server'

import { apiGet, apiPost } from 'lib/api';
import { getToken } from 'lib/getToken';


export const getNotifications = async (page: number) => {
    const token = await getToken()

    const params = new URLSearchParams({
        page: String(page),
    })

    const response = await apiGet<INotificationsResponse>(
        `notifications?${params.toString()}`,
        token
    );
    return response;
};



export const readAllNotifications = async () => {
    const token = await getToken()

    const response = await apiPost(
        `/notifications/read-all`,
        {},
        token
    );
    return response;
};


