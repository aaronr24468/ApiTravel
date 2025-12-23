import { Router } from "express";
import bcrypt from 'bcrypt';
import multer from "multer";
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import { registerDriver, registerUser, setImage } from "../controllers/registerControllers.mjs";

const diskStorage = multer.diskStorage({
    destination: join(dirname(fileURLToPath(import.meta.url)), '../images/profilePhotos'),
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
})

const diskStorageDriver = multer.diskStorage({
    destination: join(dirname(fileURLToPath(import.meta.url)), '../images/driversPhotos'),
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
})

const getImage = multer({
    storage: diskStorage
}).single('image')

const getDriverImage = multer({
    storage: diskStorageDriver
}).single('image')


export const router = Router();

router.put('/', registerUser); //end point para registrar a los usuarios

router.post('/setImage/:username', getImage, setImage); //end point para poner setear la foto del usuario

router.put('/registDriver', registerDriver) //end point para registrar a los conductores

router.post('/registDriver/setDriverImage/:username', getDriverImage)