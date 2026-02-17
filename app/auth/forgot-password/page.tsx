import type { Metadata } from "next";
import { ForgotPassword } from "components/Auth/ForgotPassword";
import AlreadyAuthenticate from "src/hoc/AlreadyAuthenticate";

export const metadata: Metadata = {
  title: "Forgot Password | Village Square",
};

const ForgotPasswordPage = () => <ForgotPassword />;

export default AlreadyAuthenticate(ForgotPasswordPage);
