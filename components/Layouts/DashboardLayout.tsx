import { SidebarProvider } from "components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./AppSidebar";
import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="md:hidden lg:flex relative font-albert-sans">
      <DashboardNavbar />
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 mt-16 pl-6 relative">{children}</div>
      </SidebarProvider>
    </main>
  );
};

export default DashboardLayout;
