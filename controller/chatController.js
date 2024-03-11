import Conversation from "../model/conversation.js";
import vine, { errors } from "@vinejs/vine";
import { convoSchema } from "../request/convo.js";
import { sendResponse } from "../shared/sendResponse.js";
import mongoose from "mongoose";
import Message from "../model/message.js";
import User from "../model/user.js";
import { messageSchema } from "../request/sendmessage.js";
import { io } from "../index.js";

export const checkConvo = async (req, res) => {
  const id = req.id;
  const data = req.body;
  try {
    const validator = vine.compile(convoSchema);
    const output = await validator.validate(data);
    const { receiver_id } = output;
    const existingConversation = await Conversation.findOne({
      $or: [
        { senderId: id, receiverId: receiver_id },
        { senderId: receiver_id, receiverId: id },
      ],
    });

    if (!existingConversation) {
      const newConversation = await Conversation.create({
        senderId: id,
        receiverId: receiver_id,
        lastTimeMessage: new Date(),
      });
      const newMessage = await Message.create({
        conversationId: newConversation._id,
        senderId: id,
        receiverId: receiver_id,
        body: "",
      });

      res.json({
        message: "Conversation created successfully!",
        conversation: newConversation,
        receiver: await User.findById({ _id: receiver_id })
          .select("-password")
          .exec(),
        messages: await Message.find({
          conversationId: newConversation._id,
        }),
      });
    }

    return res.json({
      message: "Conversation already exists.",
      conversation: existingConversation,
      receiver: await User.findById({ _id: receiver_id })
        .select("-password")
        .exec(),
      messages: await Message.find({
        conversationId: existingConversation._id,
      }),
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      const errorMessages = error?.messages?.map((error) => error?.message);
      sendResponse(res, errorMessages, null, true, 422);
    } else if (error instanceof mongoose.Error.ValidationError) {
      const errorMessage = "Missing or invalid recipient ID.";
      sendResponse(res, errorMessage, null, true, 400);
    }
    console.log(error);
    sendResponse(res, "Internal Server Error", null, true, 500);
  }
};

export const sendMessages = async (req, res) => {
  const id = req.id;
  const data = req.body;
  try {
    const validator = vine.compile(messageSchema);
    const output = await validator.validate(data);
    const { conversation_id, receiver_id, body } = output;
    const newMessage = await Message.create({
      conversationId: conversation_id,
      senderId: id,
      receiverId: receiver_id,
      body: body,
    });
    io.emit("message", newMessage);
    sendResponse(res, "Message sent successfully", newMessage, false, 200);
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      const errorMessages = error?.messages?.map((error) => error?.message);
      sendResponse(res, errorMessages, null, true, 422);
    } else {
      console.log(error);
      sendResponse(res, "Internal Server Error", null, true, 500);
    }
  }
};