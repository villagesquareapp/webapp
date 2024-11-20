interface IApiMessage {
    error?: string
}

interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
    [key: string]: any
}

interface IUser {
    uuid: string
    name: string
    username: string
    email: string
    registration_type: string
    account_type: string
    phone_number: string | null
    profile_picture: string
    cover_photo: string | null
    gender: string | null
    dob: string | null
    country: string | null
    city: string | null
    profession: string | null
    bio: string | null
    timezone: string
    verified_status: number
    online: boolean
    last_online: string | null
    is_private: boolean
    has_two_factor_auth: boolean
    status: string
    address: string | null
    latitude: string | null
    longitude: string | null
    referrer: string | null
    referral_code: string
    referral_count: number
    can_reset_password: boolean
    followers: number
    following: number
    is_blocked: boolean
    token: string
}

type IRegistrationType = 'google' | 'password' | 'apple' | 'facebook'
interface ISignup {
    username: string,
    email: string,
    name: string,
    password?: string,
    registration_type: IRegistrationType
    provider?: IRegistrationType,
    timezone?: string,
    provider_id?: "114468729516638108730",
    device_id?: string,
    device?: string,
    referrer_code?: string,
    fcm_token?: string
}