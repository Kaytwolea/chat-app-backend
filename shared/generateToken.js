import jwt from "jsonwebtoken";

export const generateToken = async (user) => {
  return await jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
    expiresIn: "24h",
  });
};
