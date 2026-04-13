import DashboardLayout from "components/Layouts/DashboardLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
