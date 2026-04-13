import { getPostDetails } from "app/api/post";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import PostDetailPageClient from "./PostDetailPageClient";
import { notFound } from "next/navigation";

export default async function PostDetailPage({
    params,
}: {
    params: Promise<{ uuid: string }>;
}) {
    const { uuid } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) return null;

    const response = await getPostDetails(uuid);

    if (!response?.data) {
        notFound();
    }

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar">
            <PostDetailPageClient
                initialPost={response.data as IPost}
                user={session.user}
            />
        </div>
    );
}
