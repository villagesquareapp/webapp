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
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please provide both email and password");
                }

                try {
                    const authResponse = await fetch(`${process.env.API_URL}/auth/login`, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email_or_username: credentials.email,
                            password: credentials.password,
                            login_type: credentials.login_type
                        }),
                    });

                    const authData = await authResponse.json();

                    if (!authResponse.ok) {
                        throw new Error(authData?.message || "Invalid credentials");
                    }

                    const userResponse = await fetch(`${process.env.API_URL}/users/me`, {
                        headers: { 'Authorization': `Bearer ${authData.access_token}` }
                    });

                    const userData = await userResponse.json();

                    if (!userResponse.ok || !userData?.data) {
                        throw new Error("Failed to fetch user data");
                    }

                    return {
                        ...userData.data,
                        token: authData.access_token
                    };
                } catch (error: any) {
                    console.error("Authorization error:", error);
                    throw new Error(error.message || "Authentication failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.token = user.token;
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.token = token.token as string;
                session.user.id = token.id as string;
            }
            return session;
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