import { Router } from "express";
import { registerDriver, registerUser, setImage } from "../controllers/registerControllers.mjs";
import { uploadUserPhoto } from "../methods/uploadUserPhoto.mjs";


export const router = Router();

router.put('/', registerUser); //end point para registrar a los usuarios

router.post('/setImage/:username',uploadUserPhoto.single('image'), setImage); //end point para poner setear la foto del usuario

router.put('/registDriver', registerDriver); //end point para registrar a los conductores

//router.post('/registDriver/setDriverImage/:username', getDriverImage)