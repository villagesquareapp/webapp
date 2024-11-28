import NextAuth, { DefaultSession, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: IUser
    }

    interface User extends IUser {
        // IUser properties are automatically included
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends IUser {
        // Include all IUser properties in the JWT
    }
}

