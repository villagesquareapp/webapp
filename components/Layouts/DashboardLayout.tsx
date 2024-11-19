import React from "react";
import { AppSidebar } from "../Dashboard/AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main>
      <AppSidebar />
      {children}
    </main>
  );
};

export default DashboardLayout;
