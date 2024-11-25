import { toast } from 'sonner'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.villagesquare.io/v2'

export interface ApiResponse<T = any> {
    status: boolean
    message: string
    data?: T
}

async function baseApiCall<T>(
    method: string,
    route: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const cleanRoute = route.startsWith('/') ? route : `/${route}`
    const url = `${NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')}${cleanRoute}`

    const headers = new Headers(options.headers)

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }
    headers.set('Accept', 'application/json')

    try {
        const response = await fetch(url, {
            ...options,
            method,
            headers,
        })

        const data: ApiResponse<T> = await response.json()

        if (response.ok) {
            return data
        } else {
            toast.error(data.message || 'An unexpected error occurred')
            return data
        }
    } catch (error: any) {
        const errorMessage = error.message || `An unexpected error occurred during the ${method} request.`
        toast.error(errorMessage)
        return {
            status: false,
            message: errorMessage,
        }
    }
}

export { baseApiCall }

