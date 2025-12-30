const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
}

async function baseApiCall<T>(
  method: string,
  route: string,
  options: RequestInit & { isFormData?: boolean } = {},
  token?: string
): Promise<ApiResponse<T>> {
  const cleanRoute = route.startsWith("/") ? route : `/${route}`;
  const url = `${API_URL?.replace(/\/+$/, "")}${cleanRoute}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !options.isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      method,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (response.ok) {
      return data;
    } else {
      return data;
    }
  } catch (error: any) {
    const errorMessage =
      error.message ||
      `An unexpected error occurred during the ${method} request.`;
    return {
      status: false,
      message: errorMessage,
    };
  }
}

export { baseApiCall };

// const API_URL = process.env.API_URL || 'https://staging-api.villagesquare.io/v2';

// export interface ApiResponse<T = any> {
//     status: boolean;
//     message: string;
//     data?: T;
// }

// async function baseApiCall<T>(
//     method: string,
//     route: string,
//     options: RequestInit & { isFormData?: boolean } = {},
//     token?: string
// ): Promise<ApiResponse<T>> {
//     const cleanRoute = route.startsWith('/') ? route : `/${route}`;
//     const url = `${API_URL?.replace(/\/+$/, '')}${cleanRoute}`;

//     const headers = new Headers(options.headers);
//     if (!headers.has('Content-Type') && !options.isFormData) {
//         headers.set('Content-Type', 'application/json');
//     }

//     if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//     }

//     try {
//         const response = await fetch(url, {
//             ...options,
//             method,
//             headers,
//         });

//         // --- CORRECTED LOGIC: Check response.ok first ---
//         if (!response.ok) {
//             // Attempt to read the error message from the response body
//             // Some APIs return JSON even for errors, so we try that first
//             const errorData = await response.json().catch(() => {
//                 // If it's not JSON, return a simple object
//                 return { status: false, message: response.statusText || 'Unknown error' };
//             });

//             // If the API returned a structured error, use that.
//             if (errorData?.message) {
//                 return {
//                     status: false,
//                     message: errorData.message,
//                 };
//             }

//             // Otherwise, return a generic error message
//             return {
//                 status: false,
//                 message: response.statusText || 'An unexpected error occurred.',
//             };
//         }

//         // Only parse the body to JSON if the response was successful
//         const data: ApiResponse<T> = await response.json();
//         return data;

//     } catch (error: any) {
//         console.error('Fetch or parsing error:', error);
//         const errorMessage = error.message || `An unexpected error occurred during the ${method} request.`;
//         return {
//             status: false,
//             message: errorMessage,
//         };
//     }
// }

// export { baseApiCall };
