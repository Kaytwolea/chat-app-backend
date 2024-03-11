import express from "express";
import { getUsers } from "../controller/userController.js";
import { checkConvo, sendMessages } from "../controller/chatController.js";

const router = express.Router();

router.route("/get-all-users").get(getUsers);
router.route("/check-convo").post(checkConvo);
router.route("/send-message").post(sendMessages);

export { router as ChatRouter };
