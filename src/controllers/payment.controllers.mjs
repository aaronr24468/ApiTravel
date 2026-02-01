import Stripe from "stripe";
import { AppError } from "../utils/AppError.mjs";
import {config} from 'dotenv';
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const payment_Intent = async(req, res, next) =>{
    try {
       
        const data = {
            userId: req.auth.id,
            tripId: req.body.tripId,
            driver_id: req.body.driver_id,
            seats_reserved: req.body.seats,
            payment_status: 'pending',
            total_amount: '500',
            platform_fee: 0.03,
            driver_amount: 0,
            refund_amount: 0,
            retained_amount: 0,
            payment_intent_id: '',
            agreePolicies: req.body.polocies,
            trip_completed: 0,
            policies: req.body.policies
        }


        if(!data.policies) throw new AppError('No aceptaste las condiciones', 403);

        //dejar como pendiente de momento, obtener el precio desde mysql para evitar inyeccion de datos en el front con el precio del viaje


        const amountInCents = Math.round(Number(req.body.amount) * 100); // corregir, si mando 350 en seco stripe piensa que son 3.5 pesos

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'mxn',
            metadata:{
                trip_id: data.tripId,
                user_id: data.userId,
            }
        })

        if(!paymentIntent.status === "requires_payment_method") throw new AppError('Error al generar pago', 400);

        data.payment_intent_id = paymentIntent.id;

        res.json({ok: true, message: 'Success', clientSecret: paymentIntent.client_secret});
    } catch (error) {
        next(error)
    }
}