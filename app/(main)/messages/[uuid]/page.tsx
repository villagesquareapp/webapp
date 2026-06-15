import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import MessagesClient from "components/Dashboard/Messages/MessagesClient";

export const metadata: Metadata = {
  title: "Messages | VillageSquare",
};

const MessagesChatPage = async ({ params }: { params: Promise<{ uuid: string }> }) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const { uuid } = await params;

  return <MessagesClient user={session.user} initialChatId={uuid} />;
};

export default MessagesChatPage;
