import { Login } from "components/Auth/Login";
import AlreadyAuthenticate from "src/hoc/AlreadyAuthenticate";

const LoginPage = () => <Login />;

export default AlreadyAuthenticate(LoginPage);
