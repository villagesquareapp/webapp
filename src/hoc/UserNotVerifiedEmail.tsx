import { authOptions } from "api/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ComponentType } from "react";

export function UserNotVerifiedEmail<P extends object>(WrappedComponent: ComponentType<P>) {
  return async function WithAuthenticationCheck(props: P) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.verified_status) {
      redirect("/auth/account-verification");
    }

    return <WrappedComponent {...props} />;
  };
}

export default UserNotVerifiedEmail;
