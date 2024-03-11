import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const verifyToken = async (req, res, next) => {
  const header = req.header("Authorization") || req.header("authorization");
  if (!header?.startsWith("Bearer "))
    return res.status(403).json({ message: "Unauthorized Client" });
  const token = header?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const { userId } = decoded;
      req.id = userId;
      next();
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token.", error: err });
  }
};
