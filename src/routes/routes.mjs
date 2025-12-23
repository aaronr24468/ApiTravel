import { Router } from "express";
import multer from "multer";
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import { checkAccount } from "../controllers/controllers.mjs";

export const router = Router();

router.get('/checkAccount', checkAccount)