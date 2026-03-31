import ProfilePage from "components/Dashboard/Profile/ProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import { getProfile, resolveUsernameToUUID } from "api/user";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ uid?: string }>;
}) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  const { uid } = await searchParams;

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
      // Step 1: Try uid param or username directly
      const firstAttemptId = uid || username;
      try {
        const response = await getProfile(firstAttemptId);
        if (response?.status && response.data) {
          initialProfile = response.data;
        }
      } catch {
        // Step 1 failed — try step 2
      }

      // Step 2: Resolve username → UUID via mentions search
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
