import { authOptions } from "api/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ComponentType } from "react";

export function AlreadyAuthenticate<P extends object>(WrappedComponent: ComponentType<P>) {
  return async function WithAuthenticationCheck(props: P) {
    const session = await getServerSession(authOptions);

    if (session) {
      redirect("/dashboard/social");
    }

    return <WrappedComponent {...props} />;
  };
}

export default AlreadyAuthenticate;
