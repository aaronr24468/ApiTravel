import Stripe from "stripe";
import { config } from 'dotenv';
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebHook = (req, res) => {

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

            if (paymentIntent.status === "succeeded") {
                const data = {
                    trip_id: paymentIntent.metadata.trip_id,
                    user_id: paymentIntent.metadata.user_id,
                    process: "paid"
                }

                console.log(data)
            }


            //aqui actualizar BD
            //reservacion.status = "paid"
            // guardas paymentIntent.id

            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            break
        }
    }

    res.json({ recived: true })
}