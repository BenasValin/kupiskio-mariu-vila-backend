import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the master folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbname = "KupiskioVila";

async function connectDB() {
  try {
    await client.connect();
    console.log("Successfully Connected to Mongo");
    return client;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

export { client, dbname, connectDB };
