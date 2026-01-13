"use client";

import React, { JSX } from "react";
import { loadStripe, Stripe, StripeError } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/app/actions/stripe";

interface PaymentStatusParams {
  status: string;
  errorMessage: string;
}

function PaymentStatus(params: PaymentStatusParams): JSX.Element {
  switch (params.status) {
    case "processing":
    case "requires_payment_method":
    case "requires_confirmation":
      return <h2>Processing...</h2>;

    case "requires_action":
      return <h2>Authenticating...</h2>;

    case "succeeded":
      return <h2>Payment Succeeded 🥳</h2>;

    case "error":
      return (
        <>
          <h2>Error 😭</h2>
          <p className="error-message">{params.errorMessage}</p>
        </>
      );

    default:
      return <></>;
  }
}

interface CheckoutFormProps {
  amount: number;
}

function CheckoutForm(props: CheckoutFormProps): JSX.Element {
  const amount = props.amount;
  const [paymentType, setPaymentType] = React.useState<string>("");
  console.log(paymentType);
  const [payment, setPayment] = React.useState<{
    status: "initial" | "processing" | "error";
  }>({ status: "initial" });
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
    try {
      e.preventDefault();
      if (!e.currentTarget.reportValidity()) return;
      if (!elements || !stripe) return;

      setPayment({ status: "processing" });

      const { error: submitError, selectedPaymentMethod } = await elements.submit();

      if (submitError) {
        setPayment({ status: "error" });
        setErrorMessage(submitError.message ?? "An unknown error occurred");

        return;
      }

      if (selectedPaymentMethod === "cpmt_1Sp7U4PKU0URVzDcTLpjKqtV") {
        // Process CPM payment on merchant server and handle redirect
        return;
      }

      const { client_secret: clientSecret } = await createPaymentIntent(amount);

      const { error: confirmError } = await stripe!.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/stripe/result`,
          payment_method_data: {
            billing_details: {
              name: "hoge",
            },
          },
        },
      });

      if (confirmError) {
        setPayment({ status: "error" });
        setErrorMessage(confirmError.message ?? "An unknown error occurred");
      }
    } catch (err) {
      const { message } = err as StripeError;

      setPayment({ status: "error" });
      setErrorMessage(message ?? "An unknown error occurred");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200/70 bg-linear-to-br from-white via-slate-50 to-sky-50 p-6 shadow-lg shadow-slate-200/60 sm:p-8"
      >
        <div className="mb-6 flex flex-col gap-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Secure Checkout
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Complete your payment
          </h2>
          <p className="text-sm text-slate-600">
            Your payment details are encrypted and processed by Stripe.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <PaymentElement
            onChange={(e) => {
              setPaymentType(e.value.type);
            }}
          />
        </div>
        <div className="mt-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="text-sm text-slate-600">
            {paymentType ? (
              <span className="font-medium text-slate-800">Selected: {paymentType}</span>
            ) : (
              <span>Select a payment method to continue.</span>
            )}
          </div>
          <button
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-400/50 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            type="submit"
            disabled={!["initial", "succeeded", "error"].includes(payment.status) || !stripe}
          >
            Pay now
          </button>
        </div>
      </form>
      <div className="mx-auto mt-6 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/70 p-4 text-center shadow-sm sm:text-left">
        <PaymentStatus status={payment.status} errorMessage={errorMessage} />
      </div>
    </>
  );
}

function getStripe(): Promise<Stripe | null> {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
}

export default function ElementsForm(): JSX.Element {
  const amount = 1000;
  return (
    <Elements
      stripe={getStripe()}
      options={{
        mode: "payment",
        amount: amount,
        currency: "jpy",
        customPaymentMethods: [
          {
            id: "cpmt_1Sp7U4PKU0URVzDcTLpjKqtV",
            options: {
              type: "static",
              subtitle: "PayPay",
            },
          },
        ],
      }}
    >
      <CheckoutForm amount={amount} />
    </Elements>
  );
}
