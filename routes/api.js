import express from "express";
import { AuthRouter } from "./auth.js";
import { ChatRouter } from "./chat.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/chat", verifyToken, ChatRouter);

export { router as MainRouter };
