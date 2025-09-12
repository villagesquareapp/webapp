export interface RegisterData {
    username: string;
    email: string;
    name: string;
    password?: string;
    registration_type: "google" | "apple" | "password";
    provider?: "default" | "google" | "apple";
    timezone: string;
    provider_token?: string;
    device_id?: string;
    device?: string;
    referrer_code?: string;
    fcm_token?: string;
}


export interface AuthResponse {
    status: boolean;
    message: string;
    data?: {
        token?: string;
        user?: {
            id: string;
            username: string;
            email: string;
            name: string;
        };
    };
} 