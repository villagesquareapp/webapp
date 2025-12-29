import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error | Village Square",
};

const errorMessages: Record<string, string> = {
  Configuration:
    "We could not complete the sign-in flow because the authentication service is misconfigured. Please try again in a moment.",
  AccessDenied: "You do not have permission to sign in with this account.",
  Verification: "The verification link is no longer valid. Please request a new one.",
};

type ErrorSearchParams = Record<string, string | string[] | undefined>;

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams?: ErrorSearchParams | Promise<ErrorSearchParams>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const errorParam = resolvedSearchParams?.error;
  const errorKey = Array.isArray(errorParam) ? errorParam?.[0] : errorParam;
  const message =
    (errorKey && errorMessages[errorKey]) ||
    "Something went wrong while trying to sign you in. Please try again.";

  return (
    <div className="w-full rounded-xl bg-white/90 shadow-xl p-8 space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-red-600">Authentication Error</p>
        <h1 className="text-3xl font-bold text-gray-900">We hit a snag</h1>
        <p className="text-gray-600">{message}</p>
        {errorKey ? (
          <p className="text-sm text-gray-500">
            Error code: <span className="font-mono">{errorKey}</span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-md bg-primary text-white px-4 py-2 font-semibold shadow-sm hover:opacity-90 transition"
        >
          Back to login
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50 transition"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
