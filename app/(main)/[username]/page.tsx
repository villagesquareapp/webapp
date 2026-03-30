import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import ProfilePage from "components/Dashboard/Profile/ProfilePage";
import { getProfile } from "api/user";

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
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    if (RESERVED_ROUTES.has(username.toLowerCase())) {
        notFound();
    }

    const session = await getServerSession(authOptions);
    const isOwnProfile = session?.user?.username === username;

    // Fetch profile server-side using the session user's uuid for own profile,
    // or the username for other users' profiles
    let initialProfile: IUserProfileResponse | null = null;
    try {
        const userId = isOwnProfile ? session?.user?.uuid : username;
        if (userId) {
            const response = await getProfile(userId);
            if (response?.status && response.data) {
                initialProfile = response.data;
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
