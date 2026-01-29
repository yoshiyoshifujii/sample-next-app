"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { getCustomPaymentStatusAction } from "@/lib/customPayment/actions";

export default function CustomPaymentRedirectPage(): JSX.Element {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const returnUrl = searchParams.get("return_url");
  const [status, setStatus] = React.useState("processing");

  React.useEffect(() => {
    if (!paymentIntentId || !returnUrl) return;

    let isCancelled = false;

    const poll = async () => {
      try {
        const data = await getCustomPaymentStatusAction({ paymentIntentId });
        if (isCancelled) return;
        setStatus(data.status ?? "processing");

        if (data.status === "succeeded" || data.status === "failed") {
          const nextUrl = new URL(returnUrl);
          nextUrl.searchParams.set("payment_intent", paymentIntentId);
          window.location.assign(nextUrl.toString());
          return;
        }
      } catch (error) {
        if (isCancelled) return;
        setStatus("processing");
      }

      if (!isCancelled) {
        window.setTimeout(poll, 1000);
      }
    };

    poll();

    return () => {
      isCancelled = true;
    };
  }, [paymentIntentId, returnUrl]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
            Redirecting
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            Awaiting external payment confirmation
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            We are waiting for your payment provider to finish processing.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {status}
          </div>
        </header>
      </div>
    </main>
  );
}
