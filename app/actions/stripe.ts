"use server";

import Stripe from "stripe";
import {stripe} from "@/lib/stripe";

export async function createPaymentIntent(amount: number): Promise<{ client_secret: string }> {
    const params: Stripe.PaymentIntentCreateParams = {
        currency: "JPY",
        amount: amount
    };
    const paymentIntent: Stripe.Response<Stripe.PaymentIntent> = await stripe.paymentIntents.create(params);
    return {client_secret: paymentIntent.client_secret as string};
}

