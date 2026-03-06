import Stripe from "stripe";
import { config } from "dotenv";
import { updateRefundStatusByPaymentId } from "../models/payment.models.mjs";
import { AppError } from "../utils/AppError.mjs";
config();

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`)

export const refundExpiredReservation = async (data) => {
    try {
        const payment_intent_id = data.payment_intent_id;

        const amount = data.totalAmount

        const totalAmount = Number(data.totalAmount) * 100;

        console.log(totalAmount)

        const result = await stripe.refunds.create({
            amount: totalAmount,
            payment_intent: payment_intent_id
        })

        if (result.status != "succeeded") throw new AppError('Error al hacer rembolso', 402);

        await updateRefundStatusByPaymentId(amount, payment_intent_id);

    } catch (error) {

    }

}