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

//router.get('/logout', logOut)

router.get('/checkAccount', checkAccount);

router.get('/getDataUser/:data', getDataUser);

router.get('/verifyRol', verifyUserRol(["driver", "Admin"]), verifyU);

router.post('/register/Vehicle', verifyUserRol(["driver", "Admin"]), registCarInfo);

router.post('/uploadImageCar/:idCar', verifyUserRol(["driver", "Admin"]) , uploadUserPhoto.single('image'), uploadVehiclePhoto);

router.get('/formularioData', verifyUserRol(["driver", "Admin"]), getDataForm);

router.get('/listCars', verifyUserRol(["driver", "Admin"]), listCars);

router.post('/setTrip', verifyUserRol(["driver","Admin"]), setTrip);

router.get('/getListTravel', getListTravel);

router.post('/addCityImage/:city', verifyUserRol(["Admin"]), uploadUserPhoto.single('image'), uploadCityImage);

router.get('/getCityImages', verifyUserRol(['driver', 'Admin']), getCityImages);

router.get('/getTrip/information/:id', getDataTrip);

router.post('/payment_Intent', payment_Intent);

router.get('/getMyReservations', getMyReservations);

router.post('/cancelReservation/:id', cancelReservation);

router.get('/getDriver/travelsList',verifyUserRol(['Admin', "driver"]), driverTravelList);

router.post('/accomplisedTravel', verifyUserRol(["driver", "Admin"]), accomplishedTrip);

//router.post('/stripeConnect', verifyUserRol(["driver", "Admin"]), registerUserStripe)