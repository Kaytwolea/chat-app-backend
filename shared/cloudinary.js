import cloudinary from "cloudinary";
import { configDotenv } from "dotenv";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
  }
};
