import { Router } from "express";
import { verifyUserRol } from "../middleware/verifyRol.mjs";
import { myEarnings, registerUserStripe, verifyStripeAccount } from "../controllers/stripe.controllers.mjs";

export const router = Router();

router.post('/stripeConnect', verifyUserRol(['driver', 'Admin']), registerUserStripe);

router.get('/verifyStripeAccount', verifyUserRol(['driver', 'Admin']), verifyStripeAccount);

router.get('/earnings', verifyUserRol(["driver","Admin"]), myEarnings)