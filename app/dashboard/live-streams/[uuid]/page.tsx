// import { getFeaturedLivestreams } from "api/livestreams";
// import LiveStream from "components/Dashboard/LiveStream/LiveStream";

// const page = async () => {
//   const featuredLivestream = await getFeaturedLivestreams(1, 1);

//   return (
//     <LiveStream
//       featuredLivestream={
//         !!featuredLivestream?.data?.data && Array.isArray(featuredLivestream?.data?.data)
//           ? featuredLivestream?.data?.data
//           : []
//       }
//     />
//   );
// };

// export default page;

// import { getFeaturedLivestreams, getLivestreamDetails } from "api/livestreams";
// import StreamHostSetup from "components/Dashboard/LiveStream/StreamHostSetup";
// // import StreamHostSetup from "components/Dashboard/LiveStream/StreamHostSetup";

// const LiveStreamDetailPage = async ({
//   params,
// }: {
//   params: Promise<{ uuid: string }>;
// }) => {
//   // const { uuid } = params;
//   // const uuid = params.uuid;
//   const { uuid } = await params;
//   const response = await getLivestreamDetails(uuid);

//   if (!response?.data?.data) return null;
//   console.log("Livestream Details: ", response.data.data);
  

//   // const streamData: IFeaturedLivestream = response.data;
//   const singleStreamObject = response.data.data[0];
//   const streamData: ILivestreamDetails = singleStreamObject;

//   // NOTE: For now, we still need to fetch featured streams for the bottom carousel
//   // In a real app, you'd likely fetch this on the client side.
//   const featuredLivestream = await getFeaturedLivestreams(1, 1);
//   // const featuredLivestream = []; // Mocking this out for cleaner code flow

//   // 2. Determine if the current user is the host (mocking this logic)
//   const isHost = true; // For this setup page, we assume the user is the host

//   if (!isHost) {
//     // You could redirect the user to a viewer component instead of the setup component
//   }

//   return (
//     <StreamHostSetup
//       streamData={streamData}
//       featuredLivestreams={
//         !!featuredLivestream?.data?.data &&
//         Array.isArray(featuredLivestream?.data?.data)
//           ? featuredLivestream?.data?.data
//           : []
//       }
//       isHost={isHost}
//     />
//   );
// };

// export default LiveStreamDetailPage;


// import { getServerSession } from "next-auth";
// import { authOptions } from "api/auth/authOptions";
// import { getFeaturedLivestreams, getLivestreamDetails } from "api/livestreams";
// import StreamHostSetup from "components/Dashboard/LiveStream/StreamHostSetup";
// import LivestreamViewer from "components/Dashboard/LiveStream/LivestreamViewer";

// const LiveStreamDetailPage = async ({
//   params,
// }: {
//   params: Promise<{ uuid: string }>;
// }) => {
//   const session = await getServerSession(authOptions);
//   const user = session?.user;
  
//   if (!user) {
//     // Redirect to login or show error
//     return null;
//   }

//   const { uuid } = await params;
//   const response = await getLivestreamDetails(uuid);

//   console.log("API Response:", JSON.stringify(response, null, 2));

//   // Handle different possible response structures
//   let streamData: ILivestreamDetails | null = null;
  
//   if (response?.data) {
//     // If data is an array, take the first item
//     if (Array.isArray(response.data)) {
//       const dataArray = response.data as ILivestreamDetails[];
//       streamData = dataArray.length > 0 ? dataArray[0] : null;
//     } else {
//       // If data is a single object
//       streamData = response.data as ILivestreamDetails;
//     }
//   } else if (response?.data) {
//     // Direct data structure - check if it's an array or single object
//     if (Array.isArray(response.data)) {
//       const dataArray = response.data as ILivestreamDetails[];
//       streamData = dataArray.length > 0 ? dataArray[0] : null;
//     } else {
//       streamData = response.data as ILivestreamDetails;
//     }
//   }

//   if (!streamData) {
//     console.error("Stream data not found. Response structure:", response);
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <h2 className="text-2xl font-semibold mb-2">Stream Not Found</h2>
//           <p className="text-muted-foreground">The livestream you're looking for doesn't exist or has ended.</p>
//           <p className="text-xs text-gray-500 mt-2">UUID: {uuid}</p>
//         </div>
//       </div>
//     );
//   }

//   // Fetch featured streams for the sidebar
//   const featuredLivestream = await getFeaturedLivestreams(1, 1);
//   const featuredLivestreams = featuredLivestream?.data?.data && Array.isArray(featuredLivestream?.data?.data)
//     ? featuredLivestream?.data?.data
//     : [];

//   // Determine if current user is the host
//   const isHost = user.uuid === streamData.host?.uuid || user.email === streamData.host?.email;

//   // Return appropriate component based on user role
//   if (isHost) {
//     return (
//       <StreamHostSetup
//         streamData={streamData}
//         featuredLivestreams={featuredLivestreams}
//         isHost={true}
//       />
//     );
//   } else {
//     return (
//       <LivestreamViewer
//         streamData={streamData}
//         featuredLivestreams={featuredLivestreams}
//       />
//     );
//   }
// };

// export default LiveStreamDetailPage;

import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import { getFeaturedLivestreams, getLivestreamDetails } from "api/livestreams";
import StreamHostSetup from "components/Dashboard/LiveStream/StreamHostSetup";
import LivestreamViewer from "components/Dashboard/LiveStream/LivestreamViewer";

export const metadata: Metadata = {
  title: "Live Stream | Village Square Dashboard",
};

const LiveStreamDetailPage = async ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  console.log(user);
  
  if (!user) {
    // Redirect to login or show error
    return null;
  }

  const { uuid } = await params;
  const response = await getLivestreamDetails(uuid);

  // console.log("API Response:", JSON.stringify(response, null, 2));

  // Handle the paginated response structure
  let streamData: ILivestreamDetails | null = null;
  
  if (response?.data) {
    // Check if it's a paginated response with a 'data' array
    if ('data' in response.data && Array.isArray(response.data.data)) {
      const dataArray = response.data.data as ILivestreamDetails[];
      streamData = dataArray.length > 0 ? dataArray[0] : null;
    } 
    // Check if it's a paginated response with a single 'data' object
    else if ('data' in response.data && response.data.data && !Array.isArray(response.data.data)) {
      streamData = response.data.data as ILivestreamDetails;
    }
    // Check if response.data itself is the livestream details
    else if ('uuid' in response.data) {
      streamData = response.data as unknown as ILivestreamDetails;
    }
    // Check if response.data is an array of livestream details
    else if (Array.isArray(response.data)) {
      const dataArray = response.data as ILivestreamDetails[];
      streamData = dataArray.length > 0 ? dataArray[0] : null;
    }
  }

  if (!streamData) {
    console.error("Stream data not found. Response structure:", response);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Stream Not Found</h2>
          <p className="text-muted-foreground">The livestream you're looking for doesn't exist or has ended.</p>
          {/* <p className="text-xs text-gray-500 mt-2">UUID: {uuid}</p> */}
        </div>
      </div>
    );
  }

  const featuredLivestream = await getFeaturedLivestreams(1, 1);
  const featuredLivestreams = featuredLivestream?.data?.data && Array.isArray(featuredLivestream?.data?.data)
    ? featuredLivestream?.data?.data
    : [];

     const hostId = streamData.host?.uuid;
  const hostEmail = streamData.host?.email;
  const currentUserId = user.uuid;
  const currentUserEmail = user.email;

  console.log('Host comparison:', {
    hostId,
    hostEmail,
    currentUserId,
    currentUserEmail,
    streamData
  });

  // Check multiple possible matches
  const isHost = 
    (hostId && currentUserId && String(hostId) === String(currentUserId)) ||
    (hostEmail && currentUserEmail && String(hostEmail).toLowerCase() === String(currentUserEmail).toLowerCase());

  console.log('Is current user the host?', isHost);
  
  console.log('Is current user the host?', isHost);
  if (isHost) {
    return (
      <StreamHostSetup
        streamData={streamData}
        featuredLivestreams={featuredLivestreams}
        isHost={true}
        user={user}
      />
    );
  } else {
    return (
      <LivestreamViewer
        streamData={streamData}
        featuredLivestreams={featuredLivestreams}
        user={user}
      />
    );
  }
};

export default LiveStreamDetailPage;
