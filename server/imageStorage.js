import express from "express";
import dotenv from "dotenv";
import { client, dbname } from "./dbConnection.js";
import B2 from "backblaze-b2";
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const B2_APPLICATION_KEY_ID = process.env.B2_APPLICATION_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY;

const IMAGE_BUCKET_ID = "c45f14914057ef6393510f1f";

const b2 = new B2({
  applicationKeyId: B2_APPLICATION_KEY_ID,
  applicationKey: B2_APPLICATION_KEY,
});

async function GetBucket() {
  try {
    await b2.authorize(); // must authorize first (authorization lasts 24 hrs)
    let response = await b2.getBucket({ bucketName: "eshop-italy-images" });
  } catch (err) {
    console.log("Error getting bucket:", err);
  }
}

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

async function uploadFile() {
  try {
    await b2.authorize();
    const { uploadUrl, authorizationToken } = await getUploadURL();
    console.log(data);
    const response = await b2.uploadFile({
      uploadUrl: uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: "test",
      data: null,
    });
    return response.data;
  } catch (err) {
    console.log("Error getting Upload URL: ", err);
    throw err;
  }
}

router.post("import-image", (req, res) => {
  try {
  } catch {
    console.log(err);
    res.status(500);
  }
});

export default router;
