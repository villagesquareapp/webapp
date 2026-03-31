import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import ProfilePage from "components/Dashboard/Profile/ProfilePage";
import { getProfile, resolveUsernameToUUID } from "api/user";

// Routes that must never be treated as usernames
const RESERVED_ROUTES = new Set([
    "dashboard", "auth", "api", "account-deletion",
    "home", "vflix", "messages", "live-streams", "wallet", "posts",
    "explore", "search", "settings", "notifications",
    "privacy-policy", "refund-policy", "about-us", "disclaimer",
    "eula", "tac", "contact-us", "en", "fr", "es", "de", "pt",
]);

export default async function UserProfilePage({
    params,
    searchParams,
}: {
    params: Promise<{ username: string }>;
    searchParams: Promise<{ uid?: string }>;
}) {
    const { username } = await params;
    const { uid } = await searchParams;

    if (RESERVED_ROUTES.has(username.toLowerCase())) {
        notFound();
    }

    const session = await getServerSession(authOptions);
    const isOwnProfile = session?.user?.username === username;

    let initialProfile: IUserProfileResponse | null = null;

    try {
        if (isOwnProfile) {
            // Own profile: always use session UUID
            const userId = session?.user?.uuid;
            if (userId) {
                const response = await getProfile(userId);
                if (response?.status && response.data) {
                    initialProfile = response.data;
                }
            }
        } else {
            // Third-party profile:
            // Step 1: Try uid (from ?uid= param) or username directly
            const firstAttemptId = uid || username;
            try {
                const response = await getProfile(firstAttemptId);
                if (response?.status && response.data) {
                    initialProfile = response.data;
                }
            } catch {
                // Step 1 failed — swallow error and try step 2
            }

            // Step 2: If still no profile, resolve username → UUID via mentions search
            if (!initialProfile) {
                const resolvedUUID = await resolveUsernameToUUID(username);
                if (resolvedUUID) {
                    const response = await getProfile(resolvedUUID);
                    if (response?.status && response.data) {
                        initialProfile = response.data;
                    }
                }
            }
        }
    } catch (error) {
        console.error("Failed to fetch profile server-side:", error);
    }

    return (
        <ProfilePage
            username={username}
            isOwnProfile={isOwnProfile}
            initialProfile={initialProfile}
        />
    );
}
