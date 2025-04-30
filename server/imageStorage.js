import express from "express";
import dotenv from "dotenv";
import { client, dbname } from "./dbConnection.js";
import B2 from "backblaze-b2";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const B2_APPLICATION_KEY_ID = process.env.B2_APPLICATION_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY;

const b2 = new B2({
  applicationKeyId: B2_APPLICATION_KEY_ID,
  applicationKey: B2_APPLICATION_KEY,
});


async function getUploadURL() {
  try {
    await b2.authorize();
    const response = await b2.getUploadUrl({ bucketId: IMAGE_BUCKET_ID });
    return response.data;
  } catch (err) {
    console.log("Error getting Upload URL: ", err);
    throw err;
  }
}


router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    // Log the uploaded file data from Multer
    console.log("Uploaded file info:", req.file);

    // Authorize with Backblaze B2
    await b2.authorize();

    // Get an upload URL for your bucket (bucket ID should be stored securely)
    const getUploadUrlResponse = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID, // e.g., "your-bucket-id"
    });

    const { uploadUrl, authorizationToken } = getUploadUrlResponse.data;

    // Read the file from the temporary local storage
    const fileData = fs.readFileSync(req.file.path);

    // Upload the file to Backblaze B2
    const uploadResponse = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: req.file.originalname, // or customize how you want the file name stored
      data: fileData,
    });

    if (uploadResponse.status == "200") {
      try {
        const collection = client.db(dbname).collection("images");
        const data = await collection.insertOne({
          name: req.file.originalname,
        });
      } catch (err) {
        console.log(err);
      }
    }

    // Clean up the temporary file if needed
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    // Send success response with the B2 file info
    res.status(200).json({
      message: "File uploaded to Backblaze successfully",
      file: uploadResponse.data,
    });
  } catch (err) {
    console.error("Error uploading file to Backblaze:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-images", async (req, res) => {
  try {
    const collection = client.db(dbname).collection("images");
    const data = await collection.find().toArray();

    const imageNames = data.map((object) => object.name);
    res.json({
      success: true,
      images: imageNames,
    });
  } catch (err) {
    console.log("Error fetching images:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch images",
      message: err.message,
    });
  }
});

export default router;
