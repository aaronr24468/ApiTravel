import Stripe from "stripe";
import { config } from 'dotenv';
import { AppError } from "../utils/AppError.mjs";
import { getProfileDriverInfo, setIdS, updateOnboardingState } from "../models/user.models.mjs";
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const registerUserStripe = async (request, response, next) => {
    try {
        const id = request.auth.id;
        const user = await getProfileDriverInfo(id);

        const email = user[0].email;
        let stripe_account_id = '';

        if (!user[0].stripe_account_id) {
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'MX',
                email: email,
                capabilities: {
                    transfers: { requested: true }
                },
                business_type: 'individual'
            });

            stripe_account_id = account.id;

            const result = await setIdS(id, stripe_account_id)

            if (result.affectedRows === 0) throw new AppError('Error al guardar datos', 400);

            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'https://www.moveandgo.com.mx/move&go/tripG',
                return_url: 'https://www.moveandgo.com.mx/move&go',
                type: 'account_onboarding'
            })
            response.json({ ok: true, message: "success", url: accountLink.url })
        }

        stripe_account_id = user[0].stripe_account_id;

        const accountLink = await stripe.accountLinks.create({
            account: stripe_account_id,
            refresh_url: 'https://www.moveandgo.com.mx/move&go/tripG',
            return_url: 'https://www.moveandgo.com.mx/move&go/profile',
            type: 'account_onboarding'
        })
        response.json({ ok: true, message: "success", url: accountLink.url })

    } catch (error) {
        next(error)
    }
}

export const verifyStripeAccount = async(request, response, next) =>{
    try {
        const id = request.auth.id;

        const user = await getProfileDriverInfo(id);

        const onboarding = user[0].stripe_onboarded;

        if(onboarding === 1) throw new AppError('Cuenta ya activa', 400)

        const stripe_account_id = user[0].stripe_account_id;

        const account = await stripe.accounts.retrieve(stripe_account_id);

        const idStripe = account.id

        if(account.charges_enabled && account.payouts_enabled){
            const resultUpdate = await updateOnboardingState(idStripe)
            if(resultUpdate.affectedRows === 0) throw new AppError('Error al activar cuenta', 400)
            response.json({ok: true, message: 'Cuenta activada'})
        }

        response.json({ok:false, message: "Cuenta no Activada"})
    } catch (error) {
        next(error)
    }
}

export const myEarnings = async(request, response, next) =>{
    try {
        const id = request.auth.id;

        console.log(id)

        const user = await getProfileDriverInfo(id);

        console.log("paso la query")

        const stripe_account_id = user[0].stripe_account_id;

        console.log(stripe_account_id)

        const result = await stripe.accounts.createLoginLink(stripe_account_id);

        console.log(result)

        response.json({ok: true, message: 'Success', url: result.url});
    } catch (error) {
        next(error)
    }
}