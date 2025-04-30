import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import Stripe from "stripe";
import { client, dbname } from "./dbConnection.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getOrderItems = async (order_id) => {
  try {
    const collection = client.db(dbname).collection("orders");
    const result = await collection.findOne({ id: order_id });
    return result.orderInfo;
  } catch (err) {
    console.error(err);
    return -1;
  }
};

router.post("/create-checkout-session", async (req, res) => {
  try {
    const items = await getOrderItems(req.session.order_id);

    const finalItems = items.map((item) => {
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            description: item.description,
            images: item.images,
          },
          unit_amount: Math.round(
            (item.onSale ? item.salePrice : item.price) * 100
          ),
        },
        quantity: item.quantity,
      };
    });

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: finalItems,
      mode: "payment",
      // Set a success and cancel URL we will send customers to
      success_url: `http://localhost:5173/payment-successful`,
      cancel_url: `http://localhost:5173/payment-failed`,
    });

    res.json({ url: session.url });
  } catch (e) {
    // If there is an error send it to the client
    res.status(500).json({ error: e.message });
  }
});

export default router;
