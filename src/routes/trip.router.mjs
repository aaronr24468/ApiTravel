import { Router } from "express";
import { getDataTrip, getListTravel } from "../controllers/trip.controllers.mjs";

export const route = Router();

route.get('/getListTravel', getListTravel);

route.get('/getTrip/information/:id', getDataTrip)