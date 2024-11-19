import { headers } from 'next/headers'
import 'server-only'

export const getCurrentPath = async () => {
    const headersList = await headers()
    const referer = headersList.get('referer')
    if (referer) {
        try {
            const url = new URL(referer)
            return url.pathname
        } catch (e) {
            return '/'
        }
    }
    return '/'
}
