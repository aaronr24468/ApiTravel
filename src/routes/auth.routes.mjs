import { Router } from "express";
import { logOut } from "../controllers/auth.controllers.mjs";

export const router = Router();

router.get('/logout', logOut); 