import express from "express";
import nodemailer from "nodemailer";
import moment from "moment";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { client, dbname, connectDB } from "./dbConnection.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Middleware to ensure database connection is established
router.use(async (req, res, next) => {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      console.log("Reconnecting to MongoDB...");
      await connectDB();
    }
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).send("Failed to connect to database");
  }
});

// Endpoint to fetch booked ranges
router.get("/booked-ranges", async (req, res) => {
  try {
    const { house } = req.query;
    console.log(`Fetching booked ranges for house: ${house || "all houses"}`);

    const collection = client.db(dbname).collection("bookings");

    let query = {};
    if (house) {
      query.house = house;
    }

    const bookings = await collection.find(query).toArray();

    console.log("Fetched booked ranges from DB:", bookings);
    res.send(
      bookings.map((booking) => ({
        house: booking.house,
        start_date: moment(booking.start_date).format("YYYY-MM-DD"),
        end_date: moment(booking.end_date).format("YYYY-MM-DD"),
      }))
    );
  } catch (err) {
    console.error("Error fetching booked ranges:", err);
    res.status(500).send(err.message);
  }
});

// Endpoint to fetch booking information
router.get("/booking-info", async (req, res) => {
  try {
    const { date } = req.query;
    console.log(`Fetching booking info for date: ${date}`);

    const queryDate = new Date(date);
    const collection = client.db(dbname).collection("bookings");

    const bookings = await collection
      .find({
        start_date: { $lte: queryDate },
        end_date: { $gte: queryDate },
      })
      .toArray();

    res.send(bookings);
  } catch (err) {
    console.error("Error fetching booking info:", err);
    res.status(500).send(err.message);
  }
});

// Endpoint to save a booking
router.post("/book", async (req, res) => {
  try {
    const { house, startDate, endDate, name, surname, phone, email, message } =
      req.body;
    console.log(
      `Booking request for house: ${house} from ${startDate} to ${endDate}`
    );

    const collection = client.db(dbname).collection("bookings");

    const newBooking = {
      house,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      name,
      surname,
      phone,
      email,
      message,
    };

    const result = await collection.insertOne(newBooking);
    res.send({ ...newBooking, _id: result.insertedId });
  } catch (err) {
    console.error("Error confirming booking:", err);
    res.status(500).send(err.message);
  }
});

// Endpoint to update a booking
router.post("/update-booking", async (req, res) => {
  try {
    const {
      house,
      originalStartDate,
      originalEndDate,
      newStartDate,
      newEndDate,
      name,
      surname,
      phone,
      email,
      message,
    } = req.body;

    console.log(
      `Updating booking for house: ${house} from ${originalStartDate}-${originalEndDate} to ${newStartDate}-${newEndDate}`
    );

    const collection = client.db(dbname).collection("bookings");

    // Check for conflicts with other bookings
    const newStartDateObj = new Date(newStartDate);
    const newEndDateObj = new Date(newEndDate);
    const originalStartDateObj = new Date(originalStartDate);
    const originalEndDateObj = new Date(originalEndDate);

    // Find the booking to update first
    const bookingToUpdate = await collection.findOne({
      house,
      start_date: originalStartDateObj,
      end_date: originalEndDateObj,
    });

    if (!bookingToUpdate) {
      return res.status(404).send({ message: "Original booking not found" });
    }

    // Check for conflicts
    const conflictingBookings = await collection
      .find({
        house,
        _id: { $ne: bookingToUpdate._id },
        $or: [
          {
            start_date: { $lte: newEndDateObj },
            end_date: { $gte: newStartDateObj },
          },
        ],
      })
      .toArray();

    if (conflictingBookings.length > 0) {
      return res.status(409).send({
        message:
          "Selected range conflicts with existing bookings or blocked dates.",
      });
    }
    // Update the booking
    const updatedBooking = await collection.findOneAndUpdate(
      { _id: bookingToUpdate._id },
      {
        $set: {
          start_date: newStartDateObj,
          end_date: newEndDateObj,
          name,
          surname,
          phone,
          email,
          message,
        },
      },
      { returnDocument: "after" }
    );

    res.send(updatedBooking.value);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).send(err.message);
  }
});

// Endpoint to delete a range
router.post("/delete-range", async (req, res) => {
  try {
    const { house, startDate, endDate } = req.body;
    console.log(
      `Deleting booking range for house: ${house} from ${startDate} to ${endDate}`
    );

    const collection = client.db(dbname).collection("bookings");

    const result = await collection.deleteOne({
      house,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Booking not found" });
    }

    res.send({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting range:", err);
    res.status(500).send(err.message);
  }
});

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

router.post("/send-email", (req, res) => {
  const { name, surname, email, phoneNumber, contactTime, message } = req.body;
  console.log(name);

  const mailOptions = {
    from: EMAIL,
    subject: "Kupiskio Mariu Vilos Uzklausa",
    to: process.env.EMAIL_RECIPIENT,
    text: `${name} ${surname}
      ,,${message}"
      Kontaktai:
      Tel. Nr.: ${phoneNumber}
      El. paštas.: ${email}
      Skambinant telefonu susisiekti ${contactTime}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Error sending email", error });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent successfully", info });
    }
  });
});

export default router;
