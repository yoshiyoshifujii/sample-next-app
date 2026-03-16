"use client";

import React, { JSX } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./ElementsForm";
import type { ElementsFormProps } from "./ElementsForm";

const stripeCache = new Map<string, Promise<Stripe | null>>();

function getStripe(publishableKey: string): Promise<Stripe | null> {
  if (!stripeCache.has(publishableKey)) {
    stripeCache.set(publishableKey, loadStripe(publishableKey));
  }
  return stripeCache.get(publishableKey)!;
}

const CUSTOM_PAYMENT_METHODS = [
  {
    id: "cpmt_1Sp7U4PKU0URVzDcTLpjKqtV",
    options: {
      type: "static" as const,
      subtitle: "PayPay",
    },
  },
];

export function ElementsFormProvider(props: ElementsFormProps): JSX.Element {
  const {
    amount,
    stripePublishableKey,
    stripeReturnUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/stripe/result`,
    customPaymentReturnUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/custom-payment/result`,
    onCreatePaymentIntent,
  } = props;

  return (
    <Elements
      stripe={getStripe(stripePublishableKey)}
      options={{
        mode: "payment",
        amount,
        currency: "jpy",
        customPaymentMethods: CUSTOM_PAYMENT_METHODS,
      }}
    >
      <CheckoutForm
        amount={amount}
        stripeReturnUrl={stripeReturnUrl}
        customPaymentReturnUrl={customPaymentReturnUrl}
        onCreatePaymentIntent={onCreatePaymentIntent}
      />
    </Elements>
  );
}
