"use client";

import { useEffect } from "react";

interface ResultErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ResultError({ error, reset }: ResultErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
          Something went wrong
        </p>
        <h1 className="mt-3 text-xl font-semibold">Unable to load the result</h1>
        <p className="mt-2 text-sm text-slate-500">
          Please check the payment_intent value and try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
