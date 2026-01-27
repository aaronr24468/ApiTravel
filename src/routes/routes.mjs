import { Router } from "express";
import { listCars, registCarInfo, uploadVehiclePhoto } from "../controllers/vehicle.controllers.mjs";
import { uploadUserPhoto } from "../utils/uploadUserPhoto.mjs";
import { logOut, verifyU } from "../controllers/auth.controllers.mjs";
import { verifyUserRol } from "../middleware/verifyRol.mjs";
import { checkAccount, getDataUser } from "../controllers/user.controller.mjs";
import { getDataForm } from "../controllers/driver.controllers.mjs";
import { getCityImages, getDataTrip, getImageUserTrips, getListTravel, setTrip, uploadCityImage, uploadTripImages } from "../controllers/trip.controllers.mjs";

export const router = Router();

router.get('/logout', logOut)

router.get('/checkAccount', checkAccount);

router.get('/getDataUser/:data', getDataUser);

router.get('/verifyRol', verifyUserRol(["driver", "Admin"]), verifyU);

router.post('/register/Vehicle', registCarInfo);

router.post('/uploadImageCar/:idCar',verifyUserRol(["driver", "Admin"]) , uploadUserPhoto.single('image'), uploadVehiclePhoto);

router.get('/formularioData', verifyUserRol(["driver", "Admin"]), getDataForm);

router.get('/listCars', verifyUserRol(["driver", "Admin"]), listCars);

router.post('/setTrip', verifyUserRol(["driver","Admin"]), setTrip);

router.post('/uploadTripImage/:city', verifyUserRol(["driver", "Admin"]), uploadUserPhoto.single('image'), uploadTripImages);

router.get('/getTripImageUser',verifyUserRol(["driver","Admin"]), getImageUserTrips);

router.get('/getListTravel', getListTravel);

router.post('/addCityImage/:city', verifyUserRol(["Admin"]), uploadUserPhoto.single('image'), uploadCityImage);

router.get('/getCityImages', verifyUserRol(['driver', 'Admin']), getCityImages);

router.get('/getTrip/information/:id', getDataTrip)