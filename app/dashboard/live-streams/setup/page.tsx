// app/dashboard/live-streams/setup/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import { getFeaturedLivestreams } from "api/livestreams";
import StreamSetupPage from "components/Dashboard/LiveStream/StreamSetupPage";

const LiveStreamSetupPage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  
  if (!user) {
    return null;
  }

  const featuredLivestream = await getFeaturedLivestreams(1, 1);
  const featuredLivestreams = featuredLivestream?.data?.data && Array.isArray(featuredLivestream?.data?.data)
    ? featuredLivestream?.data?.data
    : [];

  return (
    <StreamSetupPage
      featuredLivestreams={featuredLivestreams}
    />
  );
};

export default LiveStreamSetupPage;