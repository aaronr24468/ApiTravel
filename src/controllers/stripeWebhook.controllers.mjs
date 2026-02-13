import Stripe from "stripe";
import { config } from 'dotenv';
import { AppError } from "../utils/AppError.mjs";
import { findTripByTransferId, finishTripUpdate, getPriceTripSeats, paidSucceededUser, paymentExist, refundExist, updateDataTrip, updateSeatsStatus, updateStatusRefound, updateWebhookTransferDriver } from "../models/trip.models.mjs";
import { tripCompleted, updateOnboardingState } from "../models/user.models.mjs";
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebHook = async (req, res) => {

    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);

    }

    console.log(event.type)

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            //console.log(paymentIntent)

            /*se reviza que no tengamos el mismo id de pago, si lo tenemos es porque ya se realizo el pago con ese id y ya se guardo en la BD 
            lo que hacemos con esto es que si sale rompre el switch para que no descuente otro asiento erroneamente*/

            const exist = await paymentExist(paymentIntent.id);

            if (exist.length > 0) break;

            const priceTrip = await getPriceTripSeats(paymentIntent.metadata.trip_id);


            const driverAmountFee = priceTrip.price * 0.03;

            const data = {
                trip_id: Number(paymentIntent.metadata.trip_id),
                user_id: Number(paymentIntent.metadata.user_id),
                driver_id: Number(paymentIntent.metadata.driver_id),
                seats: Number(paymentIntent.metadata.seats),
                payment_status: "paid",
                total_amount: priceTrip.price,
                platform_fee: 0.03,
                driver_amount: priceTrip.price - driverAmountFee,
                payment_intent_id: paymentIntent.id,
                agreePolicies: true,
            }

            const updatetripData = {
                id: data.trip_id,
                seats: priceTrip.available_seats - data.seats
            }

            console.log(updatetripData)

            await updateSeatsStatus(updatetripData)

            await paidSucceededUser(data)

            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            break
        }
        case "charge.refunded": {
            const refund = event.data.object;
            const paymentIntenId = refund.payment_intent;
            const refundId = refund.id;

            const exist_refund = await refundExist(refundId);
            console.log(exist_refund.length)

            if (exist_refund.length > 0) break;

            const trip = await updateStatusRefound(paymentIntenId, refundId)
            console.log("actualizo refund")
            const trip_id = trip[0].trip_id;

            await updateDataTrip(trip_id)

            break;
        }
        case "refund.failed": {

            break;
        }
        case "transfer.paid": {
            const paid = event.data.object;
            const idPayout = paid.id;

            const idTrip = paid.metadata.idTrip;

            const trip = await findTripByTransferId(idPayout);

            if (!trip) return

            await updateWebhookTransferDriver(idPayout);

            await tripCompleted(idTrip);

            break;
        }
        case "transfer.reversed": {
            //marcar reversed
            break;
        }
        case 'transfer.failed': {
            //marcar payout failed
            break;
        }
        case 'account.update': {
            const account = event.data.object;
            if (account.charges_enabled && account.payouts_enabled) {
                await updateOnboardingState(account.id)
            }
            break;
        }
    }

    res.json({ recived: true })
}