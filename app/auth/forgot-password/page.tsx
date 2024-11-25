import { ForgotPassword } from "components/Auth/ForgotPassword";
import AlreadyAuthenticate from "src/hoc/AlreadyAuthenticate";

const ForgotPasswordPage = () => <ForgotPassword />;

export default AlreadyAuthenticate(ForgotPasswordPage);
