import { Router } from "express";
import { getMyReservations } from "../controllers/user.controller.mjs";
import { cancelReservation } from "../controllers/payment.controllers.mjs";

export const router = Router();

router.get('/getMyReservations', getMyReservations);

router.post('/cancelReservation/:id', cancelReservation);