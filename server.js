import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import { connectDB, client, dbname } from "./server/dbConnection.js";
import productPageRoutes from "./server/productPageRoutes.js";
import userAuth from "./server/userAuth.js";
import adminControl from "./server/adminControl.js";
import imageStorage from "./server/imageStorage.js";
import stripe from "./server/stripe.js";
import calendar from "./server/calendar.js";
import ExpressMongoSanitize from "express-mongo-sanitize";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ["http://localhost:5173"];
const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;

// Configure MongoDB session store with proper TLS options
const MongoStore = MongoDBStore(session);
const store = new MongoStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions"
});
// Handle store errors
store.on('error', function(error) {
  console.error('MongoDB Session Store Error:', error);
});

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(ExpressMongoSanitize());

app.use(
  session({
    secret: SESSION_SECRET_KEY,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    name: "checkout-session",
  })
);

// Connect to MongoDB before setting up routes
async function startServer() {
  try {
    await connectDB();
    
    // Routes
    app.use("/", productPageRoutes);
    app.use("/", userAuth);
    app.use("/api/", imageStorage);
    app.use("/api/", stripe);
    app.use("/api/admin/", adminControl);
    app.use("/api/", calendar);
    
    // Error handler middleware
    app.use((err, req, res, next) => {
      console.error('Server error:', err);
      res.status(500).send('Something went wrong');
    });
    
    app.listen(PORT, () => {
      console.log(`Express server running at http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
