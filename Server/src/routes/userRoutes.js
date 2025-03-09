import { Router } from "express";

import {
  forgotPassword,
  getProfile,
  loginUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "../controllers/userController.js"
import { isAuth } from "../middlewares/isAuth.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/verify").post(verifyUser);
router.route("/login").post(loginUser);
router.route("/forgot").post(forgotPassword);
router.post("/reset", resetPassword);
router.route("/profile").get(isAuth,getProfile);

export default router;