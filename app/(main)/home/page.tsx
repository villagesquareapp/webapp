import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "api/auth/authOptions";
import SocialPage from "components/Dashboard/Social/SocialPage";

export const metadata: Metadata = {
  title: "Social Feed | Village Square Dashboard",
};

const Page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) return null;

  return <SocialPage user={user} />;
};

export default Page;
