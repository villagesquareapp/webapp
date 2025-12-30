import { messageHandler } from "lib/messageHandler";
import { getTimeZone } from "lib/timezone";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim().length > 0
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "")
    : "https://staging-api.villagesquare.io/v2";

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ||
    "zSLADSxHudaAtzEkWbPfbVaXa3D3Ls1Ey6f/Kn5YNVs=",
  providers: [
    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ??
        "1076309733425-m53n4od06ojgmfsucj4j8ft6llaskteq.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ??
        "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",
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
          const requestBody = JSON.stringify({
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
          });
          console.log("Credential Request: ", requestBody);

          const authResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: requestBody,
          });

          console.log("Credential Response Status: ", authResponse.status);
          console.log(
            "Credential Response Headers: ",
            Object.fromEntries(authResponse.headers.entries())
          );

          const contentType = authResponse.headers.get("content-type");
          const rawResponse = await authResponse.text();

          if (!contentType || !contentType.includes("application/json")) {
            console.error(
              "Non-JSON response received:",
              rawResponse.substring(0, 200)
            );
            if (authResponse.status >= 500) {
              throw new Error(
                "Server error. Please try again later or contact support."
              );
            }
            throw new Error("Invalid server response. Please try again.");
          }

          let authData;
          try {
            authData = JSON.parse(rawResponse);
          } catch (parseError) {
            console.error(
              "Failed to parse JSON response:",
              rawResponse.substring(0, 200)
            );
            throw new Error("Invalid server response. Please try again.");
          }

          if (!authResponse.ok)
            throw new Error(messageHandler(authData?.message));

          return authData.data;
        } catch (error: any) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback invoked: ", user, account, profile);
      if (account?.provider === "google" && profile) {
        console.log("Google sign-in detected");
        if (!profile) {
          console.log("No profile information from Google OAuth");
          return false;
        }
        console.log("Google profile:", profile);
        console.log("Google provider_token (ID token):", account.id_token);

        try {
          const res = await fetch(`${API_BASE_URL}/auth/social-account`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audience: "web",
              auth_type: "google",
              device: "browser",
              device_id: null,
              fcm_token: null,
              provider: "google",
              provider_token: account.id_token || account.access_token,
              timezone: getTimeZone(),
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.status) {
            console.log(
              "Social account registration/login failed:",
              data.message
            );
            return false;
          }

          if (data.data) {
            (user as any).backendData = data.data;
            console.log("Social account data:", data.data);
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
      console.log("JWT Callback Debug");
      console.log("Provider:", account?.provider);
      console.log("Token:", token);
      console.log("User:", user);
      console.log("Account:", account);

      if (user) {
        if ((user as any)?.backendData) {
          const {
            access_token,
            refresh_token,
            provider_token,
            id_token,
            ...essentialData
          } = (user as any).backendData;

          token = {
            ...token,
            ...essentialData, 
          };
        }
        else {
          const {
            access_token,
            refresh_token,
            provider_token,
            id_token,
            ...essentialData
          } = user as any;

          token = {
            ...token,
            ...essentialData,
          };
        }

        if (account?.userData) {
          const {
            access_token,
            refresh_token,
            provider_token,
            id_token,
            ...cleanUserData
          } = account.userData as any;

          token = { ...token, ...cleanUserData };
        }
      }

      const {
        access_token,
        refresh_token,
        provider_token,
        id_token,
        ...cleanToken
      } = token;

      console.log("Final token (cleaned):", cleanToken);

      return cleanToken;
    },

    // async jwt({ token, user, account }) {
    //   console.log("JWT callback invoked");

    //   if ((user as any)?.backendData) {
    //     // Remove ALL tokens and large data
    //     const { access_token, ...essentialData } = (user as any).backendData;

    //     if ((user as any)?.backendData) {
    //       token = { ...token, ...((user as any).backendData as any) };
    //     }

    //     if (account?.userData) {
    //       token = { ...token, ...account.userData };
    //     }
    //     if (user) {
    //       token = { ...token, ...user };
    //     }

    //     token = {
    //       ...token,
    //       userId: essentialData.user_id || essentialData.id,
    //       email: essentialData.email,
    //       username: essentialData.username,
    //       name: essentialData.name || essentialData.full_name,
    //       avatar: essentialData.avatar || essentialData.profile_picture,
    //       bio: essentialData.bio,
    //       authToken: essentialData.token,
    //       ...essentialData,
    //     };
    //   }

    //   if (user && !token.userId) {
    //     token = {
    //       ...token,
    //       userId: user.id,
    //       email: user.email,
    //       name: user.name,
    //     };
    //   }

    //   const { access_token, ...cleanToken } = token;

    //   return cleanToken;
    // },

    // async jwt({ token, user, account }) {
    //   console.log("JWT callback invoked (Token): ", token);
    //   console.log("JWT callback invoked (User): ", user);
    //   console.log("JWT callback invoked (Account): ", account);

    // if ((user as any)?.backendData) {
    //   token = { ...token, ...((user as any).backendData as any) };
    // }
    //   if (account?.userData) {
    //     token = { ...token, ...account.userData };
    //   }
    //   if (user) {
    //     token = { ...token, ...user };
    //   }
    //   const { access_token, ...rest } = token;
    //   return rest;
    //   // return token;
    // },
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
