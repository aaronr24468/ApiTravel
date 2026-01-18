import { Router } from "express";
import multer from "multer";
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import { registCarInfo, uploadVehiclePhoto } from "../controllers/vehicle.controllers.mjs";
import { uploadUserPhoto } from "../middleware/uploadUserPhoto.mjs";
import { logOut, verifyU } from "../controllers/auth.controllers.mjs";
import { verifyUserRol } from "../middleware/verifyRol.mjs";
import { checkAccount, getDataUser } from "../controllers/user.controller.mjs";

export const router = Router();

router.get('/logout', logOut)

router.get('/checkAccount', checkAccount);

router.get('/getDataUser/:data', getDataUser);

router.get('/verifyRol', verifyUserRol(["driver", "Admin"]), verifyU);

router.post('/register/Vehicle', registCarInfo);

router.post('/uploadImageCar/:idCar', uploadUserPhoto.single('image'), uploadVehiclePhoto)