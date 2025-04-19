import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./server/dbConnection.js";
import productPageRoutes from "./server/productPageRoutes.js";
import userAuth from "./server/userAuth.js";
import imageStorage from "./server/imageStorage.js";
import adminControl from "./server/adminControl.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = 3000;

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/", productPageRoutes);
app.use("/", userAuth);
app.use("/api/image/", userAuth);
app.use("/api/admin/", adminControl);

// Function to get product data

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
