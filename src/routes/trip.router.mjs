import { Router } from "express";
import { getDataTrip, getListTravel, getReviewsData } from "../controllers/trip.controllers.mjs";

export const route = Router();

route.get('/getListTravel', getListTravel);

route.get('/getTrip/information/:id', getDataTrip);

route.get('/getReviews/:id', getReviewsData)