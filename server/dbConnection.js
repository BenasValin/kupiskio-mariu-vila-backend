import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the master folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const uri = process.env.MONGODB_URI;

// Configure MongoDB client with proper TLS options
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dbname = process.env.MONGODB_DB_NAME;

async function connectDB() {
  try {
    await client.connect();
    console.log("Successfully Connected to Mongo");
    return client;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    // Don't exit process on connection failure - this allows retry logic to work
    throw err;
  }
}

export { client, dbname, connectDB };
