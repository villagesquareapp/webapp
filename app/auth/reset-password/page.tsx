import type { Metadata } from "next";
import { ResetPassword } from "components/Auth/ResetPassword";
import AlreadyAuthenticate from "src/hoc/AlreadyAuthenticate";

export const metadata: Metadata = {
  title: "Reset Password | Village Square",
};

const ResetPasswordPage = () => <ResetPassword />;

export default AlreadyAuthenticate(ResetPasswordPage)
