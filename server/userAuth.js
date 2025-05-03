import express from "express";
import { client, dbname } from "./dbConnection.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const ACCESS_TOKEN_EXPIRATION_TIME = 15 * 60 * 1000; //15 min in mss
const REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 2 * 1000; // 2 days in ms

// ------- REGISTER -------
const registerNewUser = async (password, username) => {
  try {
    const collection = client.db(dbname).collection("users");
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = await collection.insertOne({
      username: username,
      password: hashedPassword,
    });
    return data.acknowledged;
  } catch (err) {
    console.error(err);
  }
};

router.post("/register", async (req, res) => {
  const { password, username } = req.body;
  try {
    const data = await registerNewUser(password, username);
    if (!data)
      return res.status(400).json({ message: "Failed to register new user" });
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const registerUser = () => {
  console.log("registered");
  registerNewUser("PrieMariu231", "Administratorius");
};

// ------- LOGIN -------
const loginUser = async (password, username) => {
  try {
    console.log("labas");
    const collection = client.db(dbname).collection("users");
    const user = await collection.findOne({ username });
    if (!user) return false;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

router.post("/login", async (req, res) => {
  const { password, username } = req.body;

  try {
    const user = await loginUser(password, username);
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
        isAuthenticated: false,
      });
    }

    const payload = { name: username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    sendTokenCookie(res, accessToken, refreshToken);

    return res.json({ isAuthenticated: true, message: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

// ------- AUTH MIDDLEWARE -------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ------- TOKEN GENERATION -------
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
}

const insertRefreshToken = async (token) => {
  try {
    const collection = client.db(dbname).collection("refreshTokens");

    const response = await collection.insertOne({
      token,
      expiry_date: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_TIME),
    });
    return response.acknowledged;
  } catch (err) {
    console.error("Error inserting refresh token:", err);
  }
};

async function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: `${REFRESH_TOKEN_EXPIRATION_TIME / 1000}s`, // Convert to seconds
  });

  const isInserted = await insertRefreshToken(refreshToken);
  return isInserted ? refreshToken : null;
}

// ------- REFRESH TOKEN ROUTE -------
router.post("/token", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  const tokenRecord = await getRefreshToken(refreshToken);
  if (!tokenRecord)
    return res.status(403).json({ message: "Invalid refresh token" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ message: "Refresh token expired or invalid" });

      const newAccessToken = generateAccessToken({ name: user.name });
      const newRefreshToken = await generateRefreshToken({ name: user.name });

      sendTokenCookie(res, newAccessToken, newRefreshToken);
      res.json({ message: "Token refreshed" });
    }
  );
});

// ------- LOGOUT ROUTE -------
router.delete("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(400).json({ message: "No refresh token found" });

    const collection = client.db(dbname).collection("refreshTokens");
    await collection.deleteOne({ token: refreshToken });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ------- GET REFRESH TOKEN -------
const getRefreshToken = async (token) => {
  try {
    const collection = client.db(dbname).collection("refreshTokens");
    return await collection.findOne({ token });
  } catch (err) {
    console.error(err);
  }
};

// ------- VERIFY JWT -------
router.get("/verify-jwt", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(401).json({ message: "Your session has expired" });
    }

    const tokenRecord = await getRefreshToken(refreshToken);
    if (!tokenRecord) return res.status(401);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) return res.sendStatus(403);

        const newAccessToken = generateAccessToken({ name: user.name });

        const tokenRecord = await getRefreshToken(refreshToken);

        const expiresSoon =
          tokenRecord.expiry_date - Date.now() < 60 * 60 * 1000; // 1 hour

        if (expiresSoon) {
          const newRefreshToken = await generateRefreshToken({
            name: user.name,
          });
          sendTokenCookie(res, newAccessToken, newRefreshToken);
        } else {
          sendTokenCookie(res, newAccessToken, refreshToken);
        }

        res.json({ isAuthenticated: true, message: "Token refreshed" });
      }
    );
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ------- COOKIE HANDLING -------
function sendTokenCookie(res, accessToken, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax", // Change from "None" to "Lax" for localhost
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // 🔴 Make sure this is false for localhost
    sameSite: "Lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
}

export default router;
