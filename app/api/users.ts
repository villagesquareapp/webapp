import { ApiGet } from './server'

const route = '/users'


export const GetUser = async (token: string, id: string): Promise<IUser | IApiMessage | null> => {
    return await ApiGet(`${route}/${id}/profile`, token)
}
