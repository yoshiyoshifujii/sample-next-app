"use client";

import { JSX } from "react";
import { ElementsFormProvider } from "@sample-next-app/elements-form";
import { createPaymentIntent } from "@/lib/stripe/actions";

export default function ElementsForm(): JSX.Element {
  return (
    <ElementsFormProvider
      stripePublishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
      amount={1000}
      onCreatePaymentIntent={(amount) => createPaymentIntent(amount)}
    />
  );
}
