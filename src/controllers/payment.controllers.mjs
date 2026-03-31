import Stripe from "stripe";
import { AppError } from "../utils/AppError.mjs";
import { config } from 'dotenv';
import { getIdIntentAndPrice, updateRefundStatus, updateRefundStatusByPaymentId } from "../models/payment.models.mjs";
import { getIDstripeDriver, tripCompleted } from "../models/user.models.mjs";
import { canceltripUpdate, checkIntervalTrip, finishTripUpdate, getDataT, getPaymentsIntents, getPriceTrip, getStatusTrip, pendingPaidUser, refundExist, reservationStatus, updateSeatsStatus, verifyReviewUsers } from "../models/trip.models.mjs";
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
            total_amount: req.body.amount,
            platform_fee: 0.03,
            driver_amount: req.body.amount * 0.97,
            payment_intent_id: '',
            agreePolicies: req.body.policies
        }

        const resultStatusR = await reservationStatus(data);

        const status = await getStatusTrip(data.tripId);

        if (!data.agreePolicies) throw new AppError('Necesitas aceptar la política de cancelación', 403);

        if (resultStatusR) throw new AppError('Ya tienes reservacion', 406)

        if (status[0].driver_id === data.userId) throw new AppError("Como creador de este viaje no puedes comprar asientos", 400)

        if (status[0].status === 0) throw new AppError('Viaje no disponible', 401)

        if (status[0].available_seats === 0) throw new AppError("Asientos agotados", 400);

        const resSeats = await updateSeatsStatus(data)

        if (resSeats.affectedRows === 0) throw new AppError("Asientos agotados", 400)


        await pendingPaidUser(data)


        //dejar como pendiente de momento, obtener el precio desde mysql para evitar inyeccion de datos en el front con el precio del viaje


        const amountInCents = Math.round(Number(status[0].price) * 100);

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

        const idTrip = data[0].trip_id;

        const statusTrip = await getStatusTrip(idTrip);

        const status = statusTrip[0].status;

        if (status === 0) throw new AppError('Este viaje ya fue finalizado', 400)

        const amount = data[0].total_amount.split('.')[0] * 100 / 2;
        const paymentIntenId = data[0].payment_intent_id;

        if (data[0].payment_status === "pending") throw new AppError("Este viaje no puede ser cancelado", 403);

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

        //obtener si ya tenemos alguna review del conductor para permitirle cobrar o terminar el viaje;

        const reviews = await verifyReviewUsers(idTravel);

        const interval = await checkIntervalTrip(idTravel)

        if (!reviews && !interval) throw new AppError("Aun no puedes finalizar el viaje", 403);

        // throw new AppError("entro")

        //const dataTrip = await getDataT(idTravel);

        // const now = new Date(); //obtenemos la fecha de hoy

        // const dateArrived = new Date(`${dataTrip[0].departure_date}T${dataTrip[0].arrived_hour}:00`); //convertimos la fecha en string a tiempo para poder hacer la comparacion

        // if(now < dateArrived) throw new AppError("Aun no se cumple la fecha y hora para finalizar el viaje", 400)//si la fecha de hoy es menor a la fecha del viaje entra aqui

        const stripeID = await getIDstripeDriver(idDriver); //obtenemos el id de stripe del conductor con el cual le mandaremos el dinero

        const infoTrip = await getPriceTrip(idTravel); //sacamos datos para idempotencia con la cual evitamos pagos dobles

        const idPayout = infoTrip[0].idPayout;
        const statusT = infoTrip[0].status;
        const payout = infoTrip[0].payout

        if (idPayout || statusT === 0 || payout === "paid") throw new AppError("Este viaje ya fue procesado", 400)

        if (infoTrip[0].seats === infoTrip[0].available_seats) throw new AppError('No tienes asientos reservados', 401)

        //se resta la cantidad de hacientos que tiene el carro con la cantidad de hacientos disponibles en el viaje para sacar cuantos quedaron 
        const totalTicket = infoTrip[0].seats - infoTrip[0].available_seats;

        //precio del ticket por la cantidad de usuarios que los adquirieron
        const gross = Number(infoTrip[0].price) * totalTicket;

        // se multiplica por 0.97 para que nos regrese el total menos el 3% y se multiplica por 100 dado a que son centavos
        const totalPayout = Math.round(gross * 0.97 * 100);

        const idStripeDriver = stripeID[0].stripe_account_id;

        const result = await stripe.transfers.create({
            amount: totalPayout,
            currency: 'mxn',
            destination: idStripeDriver,
            metadata: {
                idTrip: idTravel
            }
        })

        const idPaid = result.id;

        const status = "pending";

        const resUpdate = await finishTripUpdate(idTravel, idPaid, status); //actualizamos status y ponemos como pago pendiente y guardamos el id del pago

        if (resUpdate.affectedRows === 0) throw new AppError('Error al actualizar estado de viaje', 400);

        response.json({ ok: true, message: "Se finalizo viaje con exito" })
    } catch (error) {
        next(error)
    }
}

export const driverCancelTrip = async (request, response, next) => {
    try {
        const id = request.body.id_Travel;

        const infoTrip = await getPriceTrip(id); //sacamos datos para idempotencia con la cual evitamos pagos dobles

        const refundAmount = Number(infoTrip[0].price) * 100 //cantidad de rembolso en centavos

        const amount = infoTrip[0].price

        const statusT = infoTrip[0].status;

        if (statusT === 0) throw new AppError("Este viaje ya fue cancelado previamente", 401);

        const payment_intent_id_array = await getPaymentsIntents(id);

        if (payment_intent_id_array.length === 0) {
            const res = await canceltripUpdate(id)
        } else {

            for (let paymentId of payment_intent_id_array) {

                const result = await stripe.refunds.create({
                    amount: refundAmount,
                    payment_intent: paymentId.payment_intent_id
                })

                if (result.status != "succeeded") throw new AppError('Error al hacer rembolso', 402);

                const resD = await updateRefundStatusByPaymentId(amount, paymentId.payment_intent_id);

            }

            const res = await canceltripUpdate(id)
        }

        //const res = await canceltripUpdate(id)

        response.json({ ok: true, message: 'Se realizo cancelacion con exito' })

    } catch (error) {
        next(error)
    }
}

