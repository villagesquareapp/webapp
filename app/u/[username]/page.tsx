import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import ProfilePage from "components/Dashboard/Profile/ProfilePage";
import ProfileNotFound from "components/Dashboard/Profile/ProfileNotFound";
import { getProfile, resolveUsernameToUUID } from "api/user";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>;
}): Promise<Metadata> {
    const { username } = await params;
    const resolvedUUID = await resolveUsernameToUUID(username).catch(() => null);
    if (resolvedUUID) {
        const res = await getProfile(resolvedUUID).catch(() => null);
        const profile = res?.data;
        if (profile) {
            return {
                title: `${profile.name} (@${profile.username}) on VS`,
                description: profile.bio || `View ${profile.name}'s profile on Village Square.`,
            };
        }
    }
    return {
        title: `@${username} on VS`,
    };
}

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    const session = await getServerSession(authOptions);
    const isOwnProfile = session?.user?.username === username;

    let initialProfile: IUserProfileResponse | null = null;

    try {
        if (isOwnProfile) {
            const userId = session?.user?.uuid;
            if (userId) {
                const response = await getProfile(userId);
                if (response?.status && response.data) {
                    initialProfile = response.data;
                }
            }
        } else {
            // Resolve username → UUID, then fetch profile
            const resolvedUUID = await resolveUsernameToUUID(username);
            if (resolvedUUID) {
                const response = await getProfile(resolvedUUID);
                if (response?.status && response.data) {
                    initialProfile = response.data;
                }
            }
        }
    } catch (error) {
        console.error("Failed to fetch profile:", error);
    }

    // Profile not found — show friendly "Profile Not Found" (not a 404)
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
