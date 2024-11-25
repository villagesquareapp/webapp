import { ResetPassword } from "components/Auth/ResetPassword";
import AlreadyAuthenticate from "src/hoc/AlreadyAuthenticate";

const ResetPasswordPage = () => <ResetPassword />;

export default AlreadyAuthenticate(ResetPasswordPage)
