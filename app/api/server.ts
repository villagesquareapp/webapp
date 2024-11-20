
import { revalidatePath } from 'next/cache'
import { getCurrentPath } from 'lib/getCurrentPath'

const apiURL = process.env.API_URL


const serverErrorHandler = (data: any): ApiResponse => {
    return {
        success: data?.status,
        message: data?.message || 'An unexpected server error occurred.',
        ...data
    }
}

const revalidate = async () => {
    const pathname = await getCurrentPath()
    revalidatePath(pathname)
}

export const ApiDelete = async (route: string, token: string): Promise<ApiResponse> => {
    try {
        if (!token) {
            return { success: false, error: 'Authorization token is missing.' }
        }
        const response = await fetch(apiURL + route, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        const data = await response.json()
        if (response.ok) {
            revalidate()
            return { success: true, ...data }
        } else {
            return serverErrorHandler(data)
        }
    } catch (error: any) {
        console.error('ApiDelete error:', error)
        return {
            success: false,
            error: 'delete_exception',
            message: error.message || 'An unexpected error occurred during the delete request.'
        }
    }
}

export const ApiPost = async <T>(route: string, body: any, token?: string): Promise<ApiResponse<T>> => {
    try {
        if (!token) {
            return {
                success: false,
                error: 'authorization_missing',
                message: 'Authorization token is missing.'
            }
        }

        const response = await fetch(`${apiURL}${route}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })

        const data = await response.json()

        if (response.ok) {
            revalidate()
            return { success: true, data }
        } else {
            return serverErrorHandler(data)
        }
    } catch (error: any) {
        return {
            success: false,
            error: 'post_exception',
            message: error.message || 'An unexpected error occurred during the post request.'
        }
    }
}

export const ApiGet = async <T>(route: string, token?: string): Promise<ApiResponse<T>> => {
    try {
        const response = await fetch(`${apiURL}${route}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            }
        })

        const data = await response.json()

        if (response.ok) {
            revalidate()
            return { success: true, data }
        } else {
            return serverErrorHandler(data)
        }
    } catch (error: any) {
        console.error('ApiGet error:', error)
        return {
            success: false,
            error: 'get_exception',
            message: error.message || 'An unexpected error occurred during the get request.'
        }
    }
}

export const ApiPut = async <T>(route: string, body: any, token: string): Promise<ApiResponse<T>> => {
    try {
        if (!token) {
            return {
                success: false,
                error: 'authorization_missing',
                message: 'Authorization token is missing.'
            }
        }

        const response = await fetch(`${apiURL}${route}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })

        const data = await response.json()

        if (response.ok) {
            revalidate()
            return { success: true, data }
        } else {
            return serverErrorHandler(data)
        }
    } catch (error: any) {
        console.error('ApiPut error:', error)
        return {
            success: false,
            error: 'put_exception',
            message: error.message || 'An unexpected error occurred during the PUT request.'
        }
    }
}

export const AuthenticatedFileUpload = async <T>(
    route: string,
    file: File,
    token: string,
    rest?: Record<string, unknown>
): Promise<ApiResponse<T>> => {
    const formData: FormData = new FormData()

    formData.append('file', file)

    if (rest && typeof rest === 'object' && !Array.isArray(rest)) {
        Object.entries(rest).forEach(([key, value]) => {
            formData.append(key, String(value))
        })
    }

    try {
        if (!token) {
            return {
                success: false,
                error: 'authorization_missing',
                message: 'Authorization token is missing.'
            }
        }

        const response = await fetch(`${apiURL}${route}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })

        const data = await response.json()

        if (response.ok) {
            revalidate()
            return { success: true, data }
        } else {
            return serverErrorHandler(data)
        }
    } catch (error: any) {
        console.error('AuthenticatedFileUpload error:', error)
        return {
            success: false,
            error: 'file_upload_exception',
            message: error.message || 'An unexpected error occurred during the file upload.'
        }
    }
}

export const ApiPostForm = async <T>(
    route: string,
    postData: any,
    token?: string,
    headers?: Record<string, string>
): Promise<ApiResponse<T>> => {
    try {
        // Initialize combinedHeaders as a Record<string, string>
        const combinedHeaders: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers
        }

        if (token) {
            combinedHeaders['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${apiURL}${route}`, {
            method: 'POST',
            headers: combinedHeaders,
            body: new URLSearchParams(postData).toString()
        })

        const data = await response.json()

        if (response.ok) {
            revalidate()
            return { success: true, data }
        } else {
            return serverErrorHandler(data)
        }
    } catch (error: any) {
        console.error('ApiPostForm error:', error)
        return {
            success: false,
            error: 'post_form_exception',
            message: error.message || 'An unexpected error occurred during the POST form request.'
        }
    }
}
