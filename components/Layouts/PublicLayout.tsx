import { SidebarInset, SidebarProvider } from "components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./AppSidebar";
import DashboardNavbar from "./DashboardNavbar";
import CustomToaster from "components/ui/custom/custom-toaster";
import { AddPostProvider } from "context/AddPostContext";
import { DataCacheProvider } from "context/DataCacheContext";
import { VFlixUploadProvider } from "context/VFlixUploadContext";
import { GuestProvider } from "context/GuestContext";
import GuestLoginModal from "components/Auth/GuestLoginModal";

interface PublicLayoutProps {
    children: React.ReactNode;
    currentPath: string;
}

const PublicLayout = ({ children, currentPath }: PublicLayoutProps) => {
    return (
        <DataCacheProvider>
            <AddPostProvider>
                <VFlixUploadProvider>
                    <GuestProvider isGuest={true} currentPath={currentPath}>
                        <main className="max-w-[90rem] mx-auto relative font-albert-sans h-screen bg-background flex justify-center overflow-hidden">
                            <div className="w-full flex h-screen">
                                <SidebarProvider style={{ "--sidebar-width": "22rem", "--sidebar-width-icon": "8.75rem" } as React.CSSProperties}>
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
                        {/* Global guest login modal */}
                        <GuestLoginModal />
                    </GuestProvider>
                </VFlixUploadProvider>
            </AddPostProvider>
        </DataCacheProvider>
    );
};

export default PublicLayout;
