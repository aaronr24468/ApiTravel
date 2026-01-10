import { Router } from "express";
import multer from "multer";
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import { checkAccount, getDataUser, logOut, verifyRol } from "../controllers/controllers.mjs";

export const router = Router();

router.get('/logout', logOut)

router.get('/checkAccount', checkAccount);

router.get('/getDataUser/:data', getDataUser);

router.get('/verifyRol', verifyRol)