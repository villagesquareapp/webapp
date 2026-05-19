import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import ProfilePage from "components/Dashboard/Profile/ProfilePage";
import ProfileNotFound from "components/Dashboard/Profile/ProfileNotFound";
import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

async function fetchProfile(usernameOrUuid: string, token?: string): Promise<IUserProfileResponse | null> {
    try {
        const headers: HeadersInit = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/users/${usernameOrUuid}/profile`, {
            headers,
            cache: "no-store",
        });
        const data = await res.json();
        return data?.status && data?.data ? data.data : null;
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>;
}): Promise<Metadata> {
    const { username } = await params;
    // Fetch without auth for metadata (public)
    const profile = await fetchProfile(username);
    if (profile) {
        return {
            title: `${profile.name} (@${profile.username}) on Village Square`,
            description: profile.bio || `View ${profile.name}'s profile on Village Square.`,
        };
    }
    return { title: `@${username} on Village Square` };
}

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;
    const isOwnProfile = session?.user?.username === username;

    // Fetch with token if authenticated (personalized), without token if guest (public)
    const initialProfile = await fetchProfile(
        isOwnProfile && session?.user?.uuid ? session.user.uuid : username,
        token
    );

    if (!initialProfile) {
        return <ProfileNotFound username={username} />;
    }

    return (
        <ProfilePage
            username={username}
            isOwnProfile={isOwnProfile}
            initialProfile={initialProfile}
        />
    );
}
