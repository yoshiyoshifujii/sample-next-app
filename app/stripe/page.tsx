import Stripe from "stripe";
import {stripe} from "@/lib/stripe";

async function createPaymentIntent(): Promise<{ client_secret: string }> {
    const params: Stripe.PaymentIntentCreateParams = {
        currency: "JPY",
        amount: 100
    };
    const paymentIntent: Stripe.Response<Stripe.PaymentIntent> = await stripe.paymentIntents.create(params);
    return { client_secret: paymentIntent.client_secret as string };
}

export default async function StripePage() {
    const { client_secret: clientSecret } = await createPaymentIntent();

    return (
        <div id="checkout">
            {clientSecret}
        </div>
    )
}