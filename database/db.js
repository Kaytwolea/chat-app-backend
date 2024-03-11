import mongoose from "mongoose";

const db = async () => {
  const url =
    process.env.MODE === "PRODUCTION"
      ? process.env.DB_URL_PRODUCTION
      : process.env.DB_URL_DEVELOPMENT;
  await mongoose.connect(url);
};

export default db;
