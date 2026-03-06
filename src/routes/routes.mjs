import { Router } from "express";
import { listCars, registCarInfo, uploadVehiclePhoto } from "../controllers/vehicle.controllers.mjs";
import { uploadUserPhoto } from "../utils/uploadUserPhoto.mjs";
import { logOut, verifyU } from "../controllers/auth.controllers.mjs";
import { verifyUserRol } from "../middleware/verifyRol.mjs";
import { checkAccount, driverTravelList, getDataUser, getMyReservations, setIdStripe } from "../controllers/user.controller.mjs";
import { getDataForm } from "../controllers/driver.controllers.mjs";
import { getCityImages, getDataTrip, getListTravel, setTrip, uploadCityImage,  } from "../controllers/trip.controllers.mjs";
import { accomplishedTrip, cancelReservation, payment_Intent } from "../controllers/payment.controllers.mjs";
import { registerUserStripe } from "../controllers/stripe.controllers.mjs";

export const router = Router();

router.get('/formularioData', verifyUserRol(["driver", "Admin"]), getDataForm);

router.post('/addCityImage/:city', verifyUserRol(["Admin"]), uploadUserPhoto.single('image'), uploadCityImage); //admin
