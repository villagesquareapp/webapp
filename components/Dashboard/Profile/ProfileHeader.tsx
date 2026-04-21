"use client";

import React, { useState } from "react";
import { Button } from "components/ui/button";
import { Settings, Calendar, ArrowLeft } from "lucide-react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { MdVerified } from "react-icons/md";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  profile: IUserProfileResponse;
  isOwnProfile: boolean;
}

const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(
    profile.relationship?.is_following ?? false,
  );
  const [isFollowedBy] = useState(
    profile.relationship?.is_followed_by ?? false,
  );
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (loading) return;
    setLoading(true);

    const wasFollowing = isFollowing;
    // Optimistic update
    setIsFollowing(!wasFollowing);

    try {
      const endpoint = wasFollowing
        ? `/api/users/${profile.uuid}/follow`
        : `/api/users/${profile.uuid}/follow`;

      const res = await fetch(endpoint, { method: "POST" });
      const result = await res.json();

      if (!result?.status) {
        setIsFollowing(wasFollowing); // revert
        toast.error(result?.message || "Action failed");
      }
    } catch {
      setIsFollowing(wasFollowing); // revert
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const buttonLabel = isFollowing
    ? "Following"
    : isFollowedBy
      ? "Follow Back"
      : "Follow";

  const buttonStyle = isFollowing
    ? "bg-transparent text-foreground border border-blue-700 hover:bg-background"
    : "bg-blue-700 text-white hover:bg-blue-600/90";

  return (
    <div className="flex flex-col w-full pb-4 border-b border-border">
      {/* Top row: Name & Settings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 gap-4 md:gap-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => router.back()}
              className="p-1 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground md:hidden mr-1"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="relative group max-w-[200px] md:max-w-[300px]">
              <h1 className="text-xl md:text-2xl font-bold truncate">{profile.name}</h1>

              <div className="absolute left-0 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 pointer-events-none">
                {profile.name}
              </div>
            </div>
            {!!profile.verified_status && (
              <MdVerified className="text-green-500 size-5" />
            )}
          </div>
          <CustomAvatar
            src={profile.profile_picture || ""}
            name={profile.name || "?"}
            className="size-[72px] md:size-[88px] border-[3px] border-background mt-2 md:mt-0"
          />
        </div>

        <div className="flex flex-col md:items-end gap-3 md:gap-4 md:self-start">
          <div
            className={`flex items-center gap-4 text-sm ${isOwnProfile ? "mt-2" : "mt-2 md:mt-8"}`}
          >
            <div className="flex items-center gap-1">
              <span className="font-bold">
                {profile.followers?.toLocaleString() || 0}
              </span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">
                {profile.following?.toLocaleString() || 0}
              </span>
              <span className="text-muted-foreground">Following</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {isOwnProfile ? (
              <>
                <Button
                  variant="outline"
                  className="rounded-full h-8 px-4 text-xs font-semibold flex-1 md:flex-none"
                  onClick={() => router.push('/settings')}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-8 px-4 text-xs font-semibold flex-1 md:flex-none"
                >
                  Referrals
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleFollowToggle}
                  disabled={loading}
                  className={`rounded-full h-8 px-6 md:px-8 text-xs font-semibold transition-all flex-1 md:flex-none ${buttonStyle} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {buttonLabel}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-8 px-4 md:px-6 text-xs font-semibold flex-1 md:flex-none"
                >
                  Message
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="flex flex-col mt-4 md:mt-2 gap-1 text-sm">
        <span className="text-muted-foreground font-medium">@{profile.username}</span>
        {profile.bio && <span className="mt-1 leading-relaxed">{profile.bio}</span>}
        <div className="flex items-center gap-1.5 mt-2 md:mt-1 text-muted-foreground">
          <Calendar className="size-4" />
          <span>Joined {profile.date_joined || "recently"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
