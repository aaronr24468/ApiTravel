import Stripe from "stripe";
import { payment_Intent } from "../controllers/payment.controllers.mjs";
import { canceltripUpdate, getPaymentsIntents } from "../models/trip.models.mjs";
import { getIdListTravel } from "../models/updateExpiredTrips.mjs";
import {config} from 'dotenv'
import { updateRefundStatusByPaymentId } from "../models/payment.models.mjs";
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const refundTripNotCancelled = async() =>{
    try {
        const idTravelsList = await getIdListTravel();
        

        for(let data of idTravelsList){
            const id = data.id
            const price = Number(data.price.split('.')[0]) //precio para actualizar el refund en base de datos
            const priceStripe = Number(data.price.split('.')[0])*100 //precio en centavos para stripe

            const payment_Intent_id = await getPaymentsIntents(id);

            for(let paymentId of payment_Intent_id){
                const idPayment = paymentId.payment_intent_id; //identificador del pago de stripe de las reservaciones del viaje que no se cancelo
                
                const result = await stripe.refunds.create({ //se realiza el rembolso por medio de este metodo de stripe
                    payment_intent: idPayment, //no se ocupa mandar concurrency porque el id del pago ya lo tiene
                    amount: priceStripe //mandamos la cantidad en centavos 
                })

                if(result.status === "succeeded") await updateRefundStatusByPaymentId(price, idPayment); //si el result status es diferente de succeeded manda error
            }
            
        }

    } catch (error) {
        
    }
}