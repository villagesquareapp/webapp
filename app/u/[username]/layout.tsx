import DashboardLayout from "components/Layouts/DashboardLayout";
<<<<<<< HEAD
import PublicLayout from "components/Layouts/PublicLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import React from "react";

export default async function UserProfileLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params?: Promise<{ username: string }>;
}) {
    const session = await getServerSession(authOptions);
    const username = params ? (await params).username : "";
    const currentPath = username ? `/u/${username}` : "";

    if (!session?.user) {
        return <PublicLayout currentPath={currentPath}>{children}</PublicLayout>;
    }

=======
import React from "react";

export default function UserProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
>>>>>>> origin/main
    return <DashboardLayout>{children}</DashboardLayout>;
}
