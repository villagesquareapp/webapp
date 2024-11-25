import DashboardLayout from "components/Layouts/DashboardLayout";
import UserNotVerifiedEmail from "src/hoc/UserNotVerifiedEmail";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

// @Todo Add back
// export default UserNotVerifiedEmail(Layout);
export default Layout;
