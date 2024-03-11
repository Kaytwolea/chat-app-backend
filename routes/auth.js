import express from "express";
import { Login, Register, getUser } from "../controller/userController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/get-user").get(verifyToken, getUser);

export { router as AuthRouter };
