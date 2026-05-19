import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import MessagesClient from "components/Dashboard/Messages/MessagesClient";

export const metadata: Metadata = {
  title: "Messages | VillageSquare",
};

const MessagesPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return <MessagesClient user={session.user} />;
};

export default MessagesPage;
