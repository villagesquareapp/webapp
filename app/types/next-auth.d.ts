import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            token: string;
        }
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        token: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        token: string;
        id: string;
    }
}
