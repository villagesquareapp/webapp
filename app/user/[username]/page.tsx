import ProfilePage from "components/Dashboard/Profile/ProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const session = await getServerSession(authOptions);

  // Check if viewing own profile
  const isOwnProfile = session?.user?.username === username;

  return <ProfilePage username={username} isOwnProfile={isOwnProfile} />;
}
