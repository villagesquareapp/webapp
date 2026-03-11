import { SidebarInset, SidebarProvider } from "components/ui/sidebar";
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
import { AddPostProvider } from "context/AddPostContext";
import { DataCacheProvider } from "context/DataCacheContext";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import AddPost from "components/Dashboard/Social/AddPost";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <SplashScreen />
      <GlobalUploadProgress />
      <DataCacheProvider>
        <AddPostProvider>
          {session?.user && (
            <div className="hidden">
              <AddPost user={session.user} />
            </div>
          )}
          <main className="max-w-[1440px] mx-auto relative font-albert-sans h-screen bg-background flex justify-center overflow-hidden">
            <div className="w-full flex h-screen">
              <SidebarProvider style={{ "--sidebar-width": "350px", "--sidebar-width-icon": "140px" } as React.CSSProperties}>
                <AppSidebar />
                <SidebarInset className="bg-background flex flex-col relative p-0 m-0 h-screen overflow-hidden">
                  <DashboardNavbar />
                  <div className="flex-1 overflow-hidden h-full">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </div>
            <CustomToaster />
          </main>
        </AddPostProvider>
      </DataCacheProvider>
    </>
  );
};

// const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
//   return (
//     <>
//       <SplashScreen />
//       <GlobalUploadProgress />
//       <main className="relative font-albert-sans min-h-screen">
//         <SidebarProvider>
//           <AppSidebar />
//           <SidebarInset className="bg-background flex flex-col relative w-full p-0 m-0 min-h-screen h-full">
//             <DashboardNavbar />
//             <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8">
//               <div className="relative w-full h-full">{children}</div>
//             </div>
//             {/* <div className="flex-1 w-full relative">{children}</div> */}
//           </SidebarInset>
//         </SidebarProvider>
//         <CustomToaster />
//       </main>
//     </>
//   );
// };

export default DashboardLayout;
