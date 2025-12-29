import { getAuthSecret, getAuthUrl } from "lib/authConfig";
import { withAuth } from "next-auth/middleware";

const authSecret = getAuthSecret();
getAuthUrl();

export default withAuth(
  {
    pages: {
      signIn: "/auth/login",
    },
  },
  {
    secret: authSecret,
  }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
    ],
}; 
