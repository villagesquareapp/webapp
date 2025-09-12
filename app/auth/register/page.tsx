import { Register } from "components/Auth/Register";
import { Metadata } from "next";
import AlreadyAuthenticate from "src/hoc/AlreadyAuthenticate";

export const metadata: Metadata = {
  title: "Register | Village Square Dashboard",
  description: "",
};

const RegisterPage = () => <Register />;

export default AlreadyAuthenticate(RegisterPage);
