import { Router } from "express";
import { logOut, verifyU } from "../controllers/auth.controllers.mjs";
import { checkAccount, getDataUser } from "../controllers/user.controller.mjs";
import { verifyUserRol } from "../middleware/verifyRol.mjs";

export const router = Router();

router.get('/logout', logOut);

router.get('/checkAccount', checkAccount);

router.get('/getDataUser/:data', getDataUser);

router.get('/verifyRol', verifyUserRol(["driver", "Admin"]), verifyU)