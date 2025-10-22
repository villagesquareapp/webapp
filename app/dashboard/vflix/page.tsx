import { getServerSession } from "next-auth";
import VFlixPage from "components/Dashboard/VFlix/VFlixPage";
import { authOptions } from "api/auth/authOptions";

const Page = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  console.log(user);
  

  if (!user) return null;
  return <VFlixPage user={user} />
};

export default Page;
