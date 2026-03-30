import ProfilePage from "components/Dashboard/Profile/ProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import { getProfile } from "api/user";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const session = await getServerSession(authOptions);

  // Check if viewing own profile
  const isOwnProfile = session?.user?.username === username;

  // Fetch profile server-side using uuid for own profile, username for others
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
