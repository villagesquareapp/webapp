import { messageHandler } from "lib/messageHandler";
import { getTimeZone } from "lib/timezone";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ||
    "zSLADSxHudaAtzEkWbPfbVaXa3D3Ls1Ey6f/Kn5YNVs=",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      issuer: "https://accounts.google.com",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email_or_username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        login_type: { label: "Login Type", type: "text" },
        provider: { label: "Provider", type: "text" },
      },
      async authorize(credentials, _req) {
        try {
          const authResponse = await fetch(
            `${process.env.API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email_or_username: credentials?.email_or_username,
                password: credentials?.password,
                login_type: credentials?.login_type,
                provider: credentials?.provider,
                provider_token: null,
                device_id: null,
                device: null,
                fcm_token: null,
                timezone: getTimeZone(),
                audience: "web",
              }),
            }
          );

          const authData = await authResponse.json();

          if (!authResponse.ok)
            throw new Error(messageHandler(authData?.message));

          return authData.data;
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile) {
        if (!profile) {
          console.log("No profile information from Google OAuth");
          return false;
        }
        console.log("Google profile:", profile);
        console.log("Google provider_token (ID token):", account.id_token);

        try {
          const res = await fetch(
            `${process.env.API_URL}/auth/social-account`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                provider: "google",
                auth_type: "google",
                provider_token: account.id_token || account.access_token,
                timezone: getTimeZone(),
                device_id: null,
                fcm_token: null,
                device: "browser",
                audience: "web",
              }),
            }
          );

          const data = await res.json();
          console.log("Backend response:", data);

          if (!res.ok || !data.status) {
            console.log(
              "Social account registration/login failed:",
              data.message
            );
            return false;
          }

          console.log("Social login approved");

          return true;
        } catch (error) {
          console.error("Error in social account signIn callback:", error);
          return false;
        }
      }

      // For credentials or other providers, just allow sign in
      console.log("Non-Google provider, allow sign in");

      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.userData) {
        token = { ...token, ...account.userData };
      }
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
};
