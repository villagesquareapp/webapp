import { getTimeZone } from 'lib/timezone'
import type { AuthResponse, RegisterData } from 'src/types/auth'
import { apiPost } from 'lib/api'

const route = 'auth'

export async function register(data: Omit<RegisterData, 'registration_type' | 'timezone'>) {
    const registerData: RegisterData = {
        ...data,
        registration_type: 'password',
        timezone: getTimeZone(),
    }

    return apiPost<IRegisterResponse>(`${route}/register`, registerData)
}

interface SocialRegisterData {
    provider: "google" | "apple";
    provider_id: string;
    device_id?: string;
    device?: string;
}

export async function socialRegister(data: SocialRegisterData) {
    const registerData: RegisterData & Partial<SocialRegisterData> = {
        username: '', // These would come from the OAuth provider
        email: '',    // These would come from the OAuth provider
        name: '',     // These would come from the OAuth provider
        registration_type: data.provider,
        timezone: getTimeZone(),
        ...data,
    }

    return apiPost<AuthResponse>(`${route}/register`, registerData)
}


export const forgotPassword = async (email: string) => {
    const response = await apiPost<ApiResponse>(`${route}/forgot-password`, email);
    return response;
}

export const verifyEmail = async (verifyEmailBody: { email: string, username: string }) => {
    const response = await apiPost<ApiResponse>(`${route}/verify-email`, verifyEmailBody);
    return response;
}

export const verifyOtp = async (body: IVerifyOtpBody) => {
    const response = await apiPost<ApiResponse>(`${route}/verify-otp`, body);
    return response;
}
