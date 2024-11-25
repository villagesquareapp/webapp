import { toast } from 'sonner'
import { revalidatePath } from 'next/cache'
import { getCurrentPath } from 'lib/getCurrentPath'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface ApiResponse<T = any> {
    status: boolean
    message: string
    data?: T
}

async function revalidate() {
    const pathname = await getCurrentPath()
    revalidatePath(pathname)
}

async function baseApiCall<T>(
    method: string,
    route: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_URL}${route}`
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
            await revalidate()
            return data
        } else {
            toast.error(data.message || 'An unexpected error occurred')
            return data
        }
    } catch (error: any) {
        console.error(`API ${method} error:`, error)
        const errorMessage = error.message || `An unexpected error occurred during the ${method} request.`
        toast.error(errorMessage)
        return {
            status: false,
            message: errorMessage,
        }
    }
}

export { baseApiCall }

