import { Register } from "components/Auth/Register";
import AlreadyAuthenticate from "src/hoc/AlreadyAuthenticate";

const RegisterPage = () => <Register />;

export default AlreadyAuthenticate(RegisterPage);
