import { Router } from "express";
import { verifyUserRol } from "../middleware/verifyRol.mjs";
import { listCars, registCarInfo, uploadVehiclePhoto } from "../controllers/vehicle.controllers.mjs";
import { uploadUserPhoto } from "../utils/uploadUserPhoto.mjs";
import { getCityImages, setTrip } from "../controllers/trip.controllers.mjs";
import { driverTravelList } from "../controllers/user.controller.mjs";
import { accomplishedTrip, driverCancelTrip } from "../controllers/payment.controllers.mjs";
import { getListUserReservations } from "../controllers/driver.controllers.mjs";

export const router = Router();

router.post('/register/Vehicle', verifyUserRol(["driver", "Admin"]), registCarInfo);

router.post('/uploadImageCar/:idCar', verifyUserRol(["driver", "Admin"]), uploadUserPhoto.single('image'), uploadVehiclePhoto);

router.get('/getCityImages', verifyUserRol(['driver', 'Admin']), getCityImages);

router.get('/listCars', verifyUserRol(["driver", "Admin"]), listCars);

router.post('/setTrip', verifyUserRol(["driver","Admin"]), setTrip);

router.get('/getDriver/travelsList',verifyUserRol(['Admin', "driver"]), driverTravelList);

router.post('/accomplisedTravel', verifyUserRol(["driver", "Admin"]), accomplishedTrip);

router.put('/cancelTravel', verifyUserRol(["driver","Admin"]), driverCancelTrip);

router.get('/list/users/reservation/:id', verifyUserRol(["driver", "Admin"]), getListUserReservations)