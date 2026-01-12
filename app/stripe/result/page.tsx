import Stripe from "stripe";
import {stripe} from "@/lib/stripe";

interface ResultPageParams {
    searchParams?: Promise<{
        payment_intent?: string | string[];
    }>;
}

export default async function ResultPage({searchParams}: ResultPageParams) {
    const resolvedSearchParams = await searchParams;
    const paymentIntentId = Array.isArray(resolvedSearchParams?.payment_intent)
        ? resolvedSearchParams?.payment_intent[0]
        : resolvedSearchParams?.payment_intent;

    if (!paymentIntentId) {
        throw new Error("Please provide a valid payment_intent (`pi_...`)");
    }

    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const formattedContent: string = JSON.stringify(paymentIntent, null, 2);
    return (
        <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                        Payment result
                    </p>
                    <h1 className="mt-3 text-2xl font-semibold text-slate-900">
                        Stripe payment intent received
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Details returned by Stripe for the completed checkout.
                    </p>
                    <div
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"/>
                        {paymentIntent.status}
                    </div>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <h2 className="text-sm font-semibold text-slate-700">Payment Intent</h2>
                        <p className="mt-1 text-xs text-slate-400">ID: {paymentIntent.id}</p>
                    </div>
                    <div className="p-6">
            <pre
                className="max-h-[70vh] overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
              {formattedContent}
            </pre>
                    </div>
                </section>
            </div>
        </main>
    );
}
