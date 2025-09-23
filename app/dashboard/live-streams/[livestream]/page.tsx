import { getFeaturedLivestreams } from "api/livestreams";
import LiveStream from "components/Dashboard/LiveStream/LiveStream";

const page = async () => {
  const featuredLivestream = await getFeaturedLivestreams(1, 1);

  return (
    <LiveStream
      featuredLivestream={
        !!featuredLivestream?.data?.data && Array.isArray(featuredLivestream?.data?.data)
          ? featuredLivestream?.data?.data
          : []
      }
    />
  );
};

export default page;
