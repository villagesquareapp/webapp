import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import NewStreamSetupPage from "components/Dashboard/LiveStream/NewStreamSetupPage";

export const metadata: Metadata = {
  title: "Live Stream Setup | Village Square Dashboard",
};

const LiveStreamSetupPage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return null;
  }

  return <NewStreamSetupPage />;
};

export default LiveStreamSetupPage;
