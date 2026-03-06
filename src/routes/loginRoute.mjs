import { Router } from "express";
import { getToken } from "../controllers/loginControllers.mjs";


export const router = Router();

router.post('/', getToken)