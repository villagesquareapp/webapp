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
                const { email, password, login_type } = credentials
                try {
                    const authRequest = await fetch(`${process.env.API_URL}/auth/login`, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email_or_username: email,
                            password: password,
                            login_type: login_type
                        }),
                    });

                    const authResponse = await authRequest.json();

                    if (!authRequest.ok) {
                        throw new Error(authResponse?.message || "Authentication failed");
                    }

                    const userRequest = await fetch(`${process.env.API_URL}/users/me`, {
                        headers: { 'Authorization': `Bearer ${authResponse?.access_token}` }
                    });

                    const user = await userRequest.json();

                    if (!userRequest.ok || !user?.data) {
                        throw new Error("Failed to fetch user data");
                    }

                    return { ...user.data, token: authResponse.access_token };
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                try {
                    console.log("Starting Google sign in process...");

                    const response = await fetch(`${process.env.API_URL}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email_or_username: user.email,
                            login_type: 'google',
                            provider: 'google',
                            provider_id: user.id,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok || data.status === false) {
                        // Return false with the error message
                        throw new Error(data.message || 'Authentication failed');
                    }

                    user.token = data.access_token;
                    return true;
                } catch (error: any) {
                    console.error('Google sign in error:', error);
                    // Return the error message to be handled by the client
                    return `/auth/login?error=${encodeURIComponent(error.message)}`;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user = { ...session.user, token: token.token };
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
        updateAge: 24 * 60 * 60,
    },
}