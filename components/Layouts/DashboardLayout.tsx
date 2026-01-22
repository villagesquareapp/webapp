import { SidebarProvider } from "components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./AppSidebar";
import DashboardNavbar from "./DashboardNavbar";
import { getNotifications } from "api/notification";
import CustomToaster from "components/ui/custom/custom-toaster";
// import MobileBottomNav from "./MobileBottomNav";
import MobileBlockScreen from "./MobileBlockScreen";
import { Splash } from "next/font/google";
import SplashScreen from "./SplashScreen";
import GlobalUploadProgress from "./GlobalUploadProgress";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <SplashScreen />
      <GlobalUploadProgress />
      <main className="relative font-albert-sans min-h-screen">
        <SidebarProvider>
          <DashboardNavbar />
          <AppSidebar />
          <div className="flex-1 mt-16 pl-0 md:pl-6 relative w-full overflow-x-hidden">{children}</div>
        </SidebarProvider>
        <CustomToaster />
      </main>
    </>
  );
};

export default DashboardLayout;