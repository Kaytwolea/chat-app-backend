import express from "express";
import { configDotenv } from "dotenv";
import { MainRouter } from "./routes/api.js";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./database/db.js";
import { sendResponse } from "./shared/sendResponse.js";
import http from "http";

const app = express();
configDotenv();
const PORT = 8000;
const server = http.createServer(app);
app.use(express.json());
app.set("view engine", "ejs");
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

app.get("/", (req, res) => {
  sendResponse(res, "We are live", null, false, 200);
});

app.use("/api", MainRouter);

db()
  .then(() => {
    console.log("Db connection established");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

