import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import ProfilePage from "components/Dashboard/Profile/ProfilePage";
import ProfileNotFound from "components/Dashboard/Profile/ProfileNotFound";
import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

async function fetchProfile(uuid: string, token?: string): Promise<IUserProfileResponse | null> {
    try {
        // No auth header for guests — backend supports public access on this endpoint
        const headers: HeadersInit = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/users/${uuid}/profile`, {
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
    return { title: `@${username} on VS` };
}

export default async function UserProfilePage({
    params,
    searchParams,
}: {
    params: Promise<{ username: string }>;
    searchParams: Promise<{ id?: string }>;
}) {
    const { username } = await params;
    const { id: uuidFromUrl } = await searchParams;

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;
    const isOwnProfile = session?.user?.username === username;

    // Determine which UUID to use
    const uuid = isOwnProfile
        ? session?.user?.uuid
        : uuidFromUrl;

    if (!uuid) {
        // No UUID available — can't fetch profile without auth search
        return <ProfileNotFound username={username} />;
    }

    const initialProfile = await fetchProfile(uuid, token);

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
