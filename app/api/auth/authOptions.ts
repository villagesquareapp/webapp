import { messageHandler } from 'lib/messageHandler';
import { getTimeZone } from 'lib/timezone';
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || 'zSLADSxHudaAtzEkWbPfbVaXa3D3Ls1Ey6f/Kn5YNVs=',
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
                login_type: { label: 'Login Type', type: 'text' }
            },
            async authorize(credentials, _req) {

                try {
                    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email_or_username: credentials?.email,
                            password: credentials?.password,
                            login_type: credentials?.login_type,
                            timezone: getTimeZone()
                        }),
                    });


                    const authData = await authResponse.json();

                    if (!authResponse.ok) throw new Error(messageHandler(authData?.message))

                    return {
                        ...authData.data,
                        token: authData.token
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Authentication failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return { ...user };
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: token
            };
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
}