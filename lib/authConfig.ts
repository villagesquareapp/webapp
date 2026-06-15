const DEFAULT_NEXTAUTH_SECRET = "zSLADSxHudaAtzEkWbPfbVaXa3D3Ls1Ey6f/Kn5YNVs=";

export const getAuthSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET ?? DEFAULT_NEXTAUTH_SECRET;

  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = secret;
  }

  return secret;
};

export const getAuthUrl = () => {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const resolvedUrl = process.env.NEXTAUTH_URL ?? vercelUrl ?? "http://localhost:3000";

  if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = resolvedUrl;
  }

  return resolvedUrl;
};
