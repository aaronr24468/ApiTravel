import { Router } from "express";
import { stripeWebHook } from "../controllers/stripeWebhook.controllers.mjs";

export const router = Router();

router.post('/', stripeWebHook)