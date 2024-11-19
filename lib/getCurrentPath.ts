import { headers } from 'next/headers'
import 'server-only'

export const getCurrentPath = () => {
    const headersList = headers()
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
