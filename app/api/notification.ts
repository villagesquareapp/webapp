'use server'

import { apiGet } from 'lib/api';
import { getToken } from 'lib/getToken';


export const getNotifications = async (page: number, limit: number) => {
    const token = await getToken()

    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    })

    const response = await apiGet<INotificationsResponse>(
        `app/notifications?${params.toString()}`,
        token
    );
    return response;
};



export const readAllNotifications = async () => {
    const token = await getToken()

    const response = await apiGet<INotificationsResponse>(
        `/app/notifications/read-all`,
        token
    );
    return response;
};


