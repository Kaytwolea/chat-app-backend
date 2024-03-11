import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../request/register.js";
import bcrypt from "bcrypt";
import User from "../model/user.js";
import { sendResponse } from "../shared/sendResponse.js";
import { loginSchema } from "../request/login.js";
import { generateToken } from "../shared/generateToken.js";

export const Register = async (req, res) => {
  const data = req.body;
  try {
    const validator = vine.compile(registerSchema);
    const body = await validator.validate(data);
    const hashed = await bcrypt.hash(body?.password, 10);
    const user = await User.create({
      ...body,
      password: hashed,
    });
    if (!user) sendResponse(res, "Error creating user", null, true, 400);
    res.status(201).json({
      message: "User created successfully, proceed to login",
      error: false,
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      const errorMessages = error?.messages?.map((error) => error?.message);
      return sendResponse(res, errorMessages, null, true, 422);
    } else if (
      error?.code === 11000 &&
      error?.keyPattern &&
      error?.keyPattern?.email
    ) {
      return sendResponse(res, "Email already exists", null, true, 400);
    } else if (
      error?.code === 11000 &&
      error?.keyPattern &&
      error?.keyPattern?.user_name
    ) {
      return sendResponse(res, "Username already exists", null, true, 400);
    }
    console.error("Error creating user:", error);
    return sendResponse(
      res,
      "Internal server error",
      error?.message,
      true,
      500
    );
  }
};

export const Login = async (req, res) => {
  const data = req.body;
  try {
    const validator = vine.compile(loginSchema);
    const output = await validator.validate(data);
    const { email, password } = output;
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, "User not found", null, true, 400);
    }
    const validatePassword = await bcrypt.compare(password, user?.password);
    if (!validatePassword) {
      sendResponse(res, "Incorrect password", null, true, 400);
    }
    const token = await generateToken(user);
    sendResponse(res, "Login request successful", { token: token }, false, 200);
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      const errorMessages = error?.messages?.map((error) => error?.message);
      sendResponse(res, errorMessages, null, true, 422);
    }
  }
};

export const getUser = async (req, res) => {
  const id = req.id;
  if (!id) return sendResponse(res, "Unauthorized", null, true, 401);
  const user = await User.findOne({ _id: id }).select("-password").exec();
  if (!user) return sendResponse(res, "User not found", null, true, 401);
  return sendResponse(res, "User returned successfully", { user }, false, 200);
};

export const getUsers = async (req, res) => {
  const id = req.id;
  try {
    const users = await User.find({ _id: { $ne: id } })
      .select("-password")
      .exec();
    sendResponse(res, "Request successful", users, false, 200);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error retrieving users" });
  }
};
