import { Login } from "components/Auth/Login";
import { Metadata } from "next";
import AlreadyAuthenticate from "src/hoc/AlreadyAuthenticate";

export const metadata: Metadata = {
  title: "Login Authentication | Village Square Dashboard",
  description: "",
};

const LoginPage = () => <Login />;

export default AlreadyAuthenticate(LoginPage);
