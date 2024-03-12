import express from "express";
import {
  Login,
  Register,
  getUser,
  viewProfile,
} from "../controller/userController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/get-user").get(verifyToken, getUser);
router.route("/user/:id").get(verifyToken, viewProfile);

export { router as AuthRouter };
