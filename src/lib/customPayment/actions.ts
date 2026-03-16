"use server";

import { getCustomPaymentIntent } from "@sample-next-app/elements-form/server";

export async function getCustomPaymentStatusAction(params: {
  paymentIntentId: string;
}): Promise<{ id: string; status: string }> {
  const intent = getCustomPaymentIntent(params.paymentIntentId);
  if (!intent) throw new Error("Payment intent not found");
  return { id: intent.id, status: intent.status };
}
