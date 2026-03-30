import React from "react";
import { Button } from "components/ui/button";
import { Settings, Calendar } from "lucide-react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { MdVerified } from "react-icons/md";

interface ProfileHeaderProps {
    profile: IUserProfileResponse;
    isOwnProfile: boolean;
}

const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
    return (
        <div className="flex flex-col w-full pb-4 border-b border-border">
            {/* Top row: Name & Settings */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-1">
                        <h1 className="text-xl font-bold">{profile.name}</h1>
                        {!!profile.verified_status && (
                            <MdVerified className="text-green-500 size-5" />
                        )}
                    </div>
                    <CustomAvatar
                        src={profile.profile_picture || ""}
                        name={profile.name || "?"}
                        className="size-[88px] border-[3px] border-background"
                    />
                </div>

                <div className="flex flex-col items-end gap-4 self-start">
                    {isOwnProfile && (
                        <button className="text-muted-foreground hover:text-foreground mb-1">
                            <Settings className="size-5" />
                        </button>
                    )}
                    <div className={`flex items-center gap-4 text-sm ${isOwnProfile ? 'mt-2' : 'mt-8'}`}>
                        <div className="flex items-center gap-1">
                            <span className="font-bold">{profile.followers?.toLocaleString() || 0}</span>
                            <span className="text-muted-foreground">Followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold">{profile.following?.toLocaleString() || 0}</span>
                            <span className="text-muted-foreground">Following</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {isOwnProfile ? (
                            <>
                                <Button variant="outline" className="rounded-full h-8 px-4 text-xs font-semibold">
                                    Edit Profile
                                </Button>
                                <Button variant="outline" className="rounded-full h-8 px-4 text-xs font-semibold">
                                    Referrals
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button className={`rounded-full h-8 px-8 text-xs font-semibold ${profile.relationship?.is_following ? 'bg-background text-foreground border border-foreground hover:bg-background' : 'bg-foreground text-background hover:bg-foreground/90'}`}>
                                    {profile.relationship?.is_following ? "Following" : "Follow"}
                                </Button>
                                <Button variant="outline" className="rounded-full h-8 px-6 text-xs font-semibold">
                                    Message
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Bio Information */}
            <div className="flex flex-col mt-2 gap-1 text-sm">
                <span className="text-muted-foreground">@{profile.username}</span>
                {profile.bio && <span className="mt-1">{profile.bio}</span>}
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                    <Calendar className="size-4" />
                    <span>Joined {profile.date_joined || "recently"}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
