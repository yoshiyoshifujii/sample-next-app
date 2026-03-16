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

export function createCustomPaymentRouteHandlers() {
  return {
    POST: async (req: Request): Promise<Response> => {
      try {
        const body = await req.json();
        const { action } = body as { action: string };

        if (action === "create") {
          const { amount } = body as { amount: number };
          const intent = createCustomPaymentIntent({ amount, currency: "jpy" });
          return Response.json({
            id: intent.id,
            client_secret: intent.clientSecret,
            status: intent.status,
          });
        }

        if (action === "confirm") {
          const { clientSecret, returnUrl } = body as {
            clientSecret: string;
            returnUrl: string;
          };
          const intent = confirmCustomPaymentIntent(clientSecret);

          if (!intent) {
            return Response.json({ error: "Payment intent not found" }, { status: 404 });
          }

          const redirectUrl = `/custom-payment/redirect?payment_intent=${encodeURIComponent(
            intent.id
          )}&return_url=${encodeURIComponent(returnUrl)}`;

          return Response.json({
            status: "requires_action",
            next_action: {
              type: "redirect",
              url: redirectUrl,
            },
          });
        }

        if (action === "status") {
          const { id } = body as { id: string };
          const intent = getCustomPaymentIntent(id);

          if (!intent) {
            return Response.json({ error: "Payment intent not found" }, { status: 404 });
          }

          return Response.json({ id: intent.id, status: intent.status });
        }

        return Response.json({ error: "Invalid action" }, { status: 400 });
      } catch {
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
  };
}
