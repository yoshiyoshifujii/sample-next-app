"use server";

import {
  confirmCustomPaymentIntent,
  createCustomPaymentIntent,
  CustomPaymentIntent,
  getCustomPaymentIntent,
} from "@/lib/customPayment";

export async function createCustomPaymentIntentAction(params: {
  amount: number;
}): Promise<{ id: string; client_secret: string; status: CustomPaymentIntent["status"] }> {
  const intent = createCustomPaymentIntent({ amount: params.amount, currency: "jpy" });
  return {
    id: intent.id,
    client_secret: intent.clientSecret,
    status: intent.status,
  };
}

export async function confirmCustomPaymentIntentAction(params: {
  clientSecret: string;
  returnUrl: string;
}): Promise<{ status: "requires_action"; next_action: { type: "redirect"; url: string } }> {
  const intent = confirmCustomPaymentIntent(params.clientSecret);

  if (!intent) {
    throw new Error("Payment intent not found");
  }

  const redirectUrl = `/custom-payment/redirect?payment_intent=${encodeURIComponent(
    intent.id
  )}&return_url=${encodeURIComponent(params.returnUrl)}`;

  return {
    status: "requires_action",
    next_action: {
      type: "redirect",
      url: redirectUrl,
    },
  };
}

export async function getCustomPaymentStatusAction(params: {
  paymentIntentId: string;
}): Promise<{ id: string; status: CustomPaymentIntent["status"] }> {
  const intent = getCustomPaymentIntent(params.paymentIntentId);

  if (!intent) {
    throw new Error("Payment intent not found");
  }

  return {
    id: intent.id,
    status: intent.status,
  };
}
