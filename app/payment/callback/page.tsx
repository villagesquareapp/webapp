'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function CallbackRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to /payment/verify with all query params preserved
    const params = searchParams.toString();
    router.replace(`/payment/verify${params ? `?${params}` : ''}`);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      }
    >
      <CallbackRedirect />
    </Suspense>
  );
}
