"use client";

import HostLiveView from "components/Dashboard/LiveStream/HostLiveView";
import { useSession } from "next-auth/react";

const DUMMY_STREAM_DATA = {
  uuid: "test-stream-123",
  title: "Beauty hack 101 to step up your game",
  host: {
    uuid: "host-uuid-123",
    name: "oladebeauty",
    username: "oladebeauty",
    email: "olade@beauty.com",
    profile_picture: "",
    followers_count: "1200000",
  },
  users: 107,
  likes_count: "32100",
  cover: "/images/beautiful-image.webp",
  status: "live",
  comments_enabled: true,
  questions_enabled: false,
  gifting_enabled: true,
};

export default function LivestreamTestPage() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Loading session...
      </div>
    );
  }

  return <HostLiveView streamData={DUMMY_STREAM_DATA} user={user} />;
}
