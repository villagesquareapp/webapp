import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import VFlixPage from "components/Dashboard/VFlix/VFlixPage";
import { authOptions } from "api/auth/authOptions";

export const metadata: Metadata = {
  title: "VFlix | Village Square Dashboard",
};

const Page = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  console.log(user);
  

  if (!user) return null;
  return <VFlixPage user={user} />
};

export default Page;
