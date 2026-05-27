'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const status = searchParams.get('status');

  const [state, setState] = useState<'loading' | 'success' | 'failed' | 'cancelled'>('loading');

  useEffect(() => {
    if (!txRef) {
      setState('failed');
      return;
    }
    if (status === 'successful' || status === 'completed' || status === 'success') {
      setState('success');
    } else if (status === 'cancelled') {
      setState('cancelled');
    } else {
      setState('failed');
    }
  }, [txRef, status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0f2035] flex flex-col items-center justify-center px-5">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/images/vs_logo.png"
          alt="VillageSquare"
          width={56}
          height={56}
          className="rounded-xl"
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center space-y-5">
        {state === 'loading' && (
          <>
            <div className="flex justify-center">
              <div className="w-14 h-14 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <h1 className="text-xl font-semibold text-white">Verifying Payment</h1>
            <p className="text-sm text-white/60">Please wait...</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg className="w-9 h-9 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-white">Payment Successful</h1>
            <p className="text-sm text-white/60">
              Your coins have been added to your wallet. You can close this page and return to the app.
            </p>
          </>
        )}

        {state === 'failed' && (
          <>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-9 h-9 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-white">Payment Failed</h1>
            <p className="text-sm text-white/60">
              Your payment could not be completed. Please close this page and try again.
            </p>
          </>
        )}

        {state === 'cancelled' && (
          <>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <svg className="w-9 h-9 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-white">Payment Cancelled</h1>
            <p className="text-sm text-white/60">
              You cancelled the payment. Close this page and try again when you&apos;re ready.
            </p>
          </>
        )}

        {/* Reference */}
        {txRef && state !== 'loading' && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/30 font-mono truncate">Ref: {txRef}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-white/30">
        Powered by Flutterwave
      </p>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0f2035] flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentVerifyContent />
    </Suspense>
  );
}
