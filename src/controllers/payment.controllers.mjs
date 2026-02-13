import Stripe from "stripe";
import { AppError } from "../utils/AppError.mjs";
import { config } from 'dotenv';
import { getIdIntentAndPrice, updateRefundStatus } from "../models/payment.models.mjs";
import { getIDstripeDriver } from "../models/user.models.mjs";
import { finishTripUpdate, getPriceTrip } from "../models/trip.models.mjs";
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const payment_Intent = async (req, res, next) => {
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
            trip_completed: 0,
            agreePolicies: req.body.policies
        }


        if (!data.agreePolicies) throw new AppError('Necesitas aceptar la política de cancelación', 403);

        //dejar como pendiente de momento, obtener el precio desde mysql para evitar inyeccion de datos en el front con el precio del viaje


        const amountInCents = Math.round(Number(req.body.amount) * 100); // corregir, si mando 350 en seco stripe piensa que son 3.5 pesos

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'mxn',
            metadata: {
                trip_id: data.tripId,
                user_id: data.userId,
                driver_id: data.driver_id,
                seats: data.seats_reserved
            }
        })

        if (!paymentIntent.status === "requires_payment_method") throw new AppError('Error al generar pago', 400);

        data.payment_intent_id = paymentIntent.id;

        res.json({ ok: true, message: 'Success', clientSecret: paymentIntent.client_secret });
    } catch (error) {
        next(error)
    }
}

export const cancelReservation = async (request, response, next) => {
    try {
        const { id } = request.params;
        const data = await getIdIntentAndPrice(id);
        const amount = data[0].total_amount.split('.')[0] * 100 / 2;
        const paymentIntenId = data[0].payment_intent_id;

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntenId,
            amount: amount
        });

        if (refund.status === "failed") throw new AppError('Rembolso rechazado por Stripe', 400);

        const amountRe = data[0].total_amount.split('.')[0] / 2

        const resDB = await updateRefundStatus(amountRe, id);

        if (resDB.affectedRows === 0) throw new AppError("Error al guardar el estatus", 401)

        response.json({ ok: true, message: "Refound se realizo con exito" })
    } catch (error) {
        next(error)
    }
}

export const accomplishedTrip = async (request, response, next) => {
    try {
        const idDriver = request.auth.id;

        const idTravel = request.body.id_Travel;

        const stripeID = await getIDstripeDriver(idDriver); //obtenemos el id de stripe del conductor con el cual le mandaremos el dinero

        const infoTrip = await getPriceTrip(idTravel);

        if(infoTrip[0].seats === infoTrip[0].available_seats) throw new AppError('No tienes asientos reservados', 401)

        //se resta la cantidad de hacientos que tiene el carro con la cantidad de hacientos disponibles en el viaje para sacar cuantos quedaron 
        const totalTicket = infoTrip[0].seats - infoTrip[0].available_seats;

        //precio del ticket por la cantidad de usuarios que los adquirieron
        const gross = Number(infoTrip[0].price) * totalTicket; 

        // se multiplica por 0.97 para que nos regrese el total menos el 3% y se multiplica por 100 dado a que son centavos
        const totalPayout = Math.round(gross * 0.97 * 100); 
       
        const idStripeDriver = stripeID[0].stripe_account_id;
        console.log(idStripeDriver)

        const result = stripe.transfers.create({
            amount: totalPayout,
            currency: 'mxn',
            destination: idStripeDriver,
            metadata:{
                idTrip: idTravel
            }
        })

        const idPaid = result.id;

        const status = "pending";

        const resUpdate = await finishTripUpdate(idTravel, idPaid, status); //actualizamos status y ponemos como pago pendiente

        if(resUpdate.affectedRows === 0) throw new AppError('Error al actualizar estado de viaje', 400);

        response.json({ok: true, message: "Se finalizo viaje con exito"})
    } catch (error) {
        next(error)
    } 
}