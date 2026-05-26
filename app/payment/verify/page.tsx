'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transaction_id');

  const [verificationState, setVerificationState] = useState<
    'loading' | 'success' | 'failed' | 'cancelled'
  >('loading');

  useEffect(() => {
    if (!txRef) {
      setVerificationState('failed');
      return;
    }

    if (status === 'cancelled') {
      setVerificationState('cancelled');
      return;
    }

    if (status === 'successful') {
      setVerificationState('success');
    } else {
      setVerificationState('failed');
    }
  }, [txRef, status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {verificationState === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-semibold">Verifying Payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your transaction.
            </p>
          </>
        )}

        {verificationState === 'success' && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-semibold">Payment Successful</h1>
            <p className="text-muted-foreground">
              Your coin recharge has been processed. You can close this page and
              return to the app.
            </p>
            {txRef && (
              <p className="text-xs text-muted-foreground/60 font-mono">
                Ref: {txRef}
              </p>
            )}
          </>
        )}

        {verificationState === 'failed' && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-semibold">Payment Failed</h1>
            <p className="text-muted-foreground">
              Something went wrong with your payment. Please try again from the
              app.
            </p>
            {txRef && (
              <p className="text-xs text-muted-foreground/60 font-mono">
                Ref: {txRef}
              </p>
            )}
          </>
        )}

        {verificationState === 'cancelled' && (
          <>
            <XCircle className="h-16 w-16 text-yellow-500 mx-auto" />
            <h1 className="text-2xl font-semibold">Payment Cancelled</h1>
            <p className="text-muted-foreground">
              You cancelled the payment. You can close this page and try again
              from the app.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentVerifyContent />
    </Suspense>
  );
}
