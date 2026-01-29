import "server-only";

export type CustomPaymentStatus =
  | "requires_confirmation"
  | "processing"
  | "succeeded"
  | "failed";

export interface CustomPaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: CustomPaymentStatus;
  createdAt: number;
  updatedAt: number;
  completeAt?: number;
}

const intents = new Map<string, CustomPaymentIntent>();

function updateStatusIfReady(intent: CustomPaymentIntent): CustomPaymentIntent {
  if (intent.status === "processing" && intent.completeAt && Date.now() >= intent.completeAt) {
    intent.status = "succeeded";
    intent.updatedAt = Date.now();
  }
  return intent;
}

export function createCustomPaymentIntent(params: {
  amount: number;
  currency: string;
}): CustomPaymentIntent {
  const id = `cpit_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
  const clientSecret = `cpsec_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
  const now = Date.now();
  const intent: CustomPaymentIntent = {
    id,
    clientSecret,
    amount: params.amount,
    currency: params.currency,
    status: "requires_confirmation",
    createdAt: now,
    updatedAt: now,
  };
  intents.set(id, intent);
  return intent;
}

export function confirmCustomPaymentIntent(clientSecret: string): CustomPaymentIntent | null {
  const intent = Array.from(intents.values()).find((item) => item.clientSecret === clientSecret);
  if (!intent) return null;

  if (intent.status === "requires_confirmation") {
    intent.status = "processing";
    intent.updatedAt = Date.now();
    intent.completeAt = Date.now() + 3500;
  }

  return updateStatusIfReady(intent);
}

export function getCustomPaymentIntent(id: string): CustomPaymentIntent | null {
  const intent = intents.get(id);
  if (!intent) return null;
  return updateStatusIfReady(intent);
}
