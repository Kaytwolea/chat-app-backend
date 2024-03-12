import express from "express";
import { getUsers } from "../controller/userController.js";
import {
  checkConvo,
  getChatMessages,
  getConvos,
  sendMessages,
} from "../controller/chatController.js";

const router = express.Router();

router.route("/get-all-users").get(getUsers);
router.route("/check-convo").post(checkConvo);
router.route("/send-message").post(sendMessages);
router.route("/convo").get(getConvos);
router.route("/convo/:id").get(getChatMessages);

export { router as ChatRouter };
