import { authOptions } from "api/auth/authOptions"
import { getServerSession } from "next-auth"

export const getToken = async () => {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token
    return token
}
