import DashboardLayout from "components/Layouts/DashboardLayout";
import React from "react";

export default function UserProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
