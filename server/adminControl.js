import express from "express";
import { client, dbname } from "./dbConnection.js";
import sendEmail from "./functions/sendEmail.js";
const router = express.Router();

const getProductData = async (pageCount, minPrice, maxPrice, sortBy) => {
  try {
    const collection = client.db(dbname).collection("productData");

    // Build query object for filtering
    const query = {};

    // Add price range to query if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
    }

    let sortConfig = -1;
    if (sortBy) {
      switch (sortBy) {
        case "asc":
          sortConfig = 1;
          break;
        case "des":
          sortConfig = -1;
          break;
      }
    }

    let dataQuery = collection.find(query).sort({ price: sortConfig });

    const data = await dataQuery.limit(pageCount).toArray();
    return data;
  } catch (err) {
    console.log(err);
    return -1;
  }
};
router.get("/get-product-data", async (req, res) => {
  try {
    const pageCount = parseInt(req.query.pageCount) || 100;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sortBy = req.query.sortBy;
    const data = await getProductData(pageCount, minPrice, maxPrice, sortBy);
    if (!data || data === -1) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export const generateID = () => {
  const id = `${Date.now().toString().substring(2, 11)}${Math.round(
    Math.random() * 1000
  )}`;
  return id;
};

const InsertProductData = async (data) => {
  try {
    const collection = client.db(dbname).collection("productData");
    const result = await collection.insertOne({
      ...data,
      id: generateID(),
    });
    return result;
  } catch (err) {
    console.error(err);
    return -1;
  }
};

router.post("/insert-product-data", async (req, res) => {
  try {
    const result = await InsertProductData(req.body); // ✅ Pass req.body directly
    if (result === -1) {
      return res.status(500).json({ message: "Failed to insert data" });
    }
    res.json({ message: "Product inserted", insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const deleteProduct = async (productId) => {
  try {
    const collection = client.db(dbname).collection("productData");
    const result = await collection.deleteOne({ id: productId });
  } catch (err) {
    console.log(err);
    return -1;
  }
};
router.delete("/delete-product/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const result = await deleteProduct(productId);
    if (result === -1) {
      return res.status(500).json({ message: "Failed to delete data" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.log(err);
  }
});

const getOrders = async () => {
  try {
    const collection = client.db(dbname).collection("orders");
    const data = await collection.find().toArray();
    return data;
  } catch (err) {
    console.error("Error fetching data from DB:", err);
    throw new Error("Database query failed");
  }
};

router.get("/orders", async (req, res) => {
  try {
    const result = await getOrders();
    if (result === -1) {
      return res.status(500).json({ message: "Failed to delete data" });
    }
    res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

const deleteOrder = async (orderId) => {
  try {
    console.log(orderId);
    const collection = client.db(dbname).collection("orders");
    const result = await collection.deleteOne({ id: orderId });
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return -1;
  }
};
router.delete("/delete-order/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = await deleteOrder(orderId);
    if (result === -1) {
      return res.status(500).json({ message: "Failed to delete data" });
    }
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.log(err);
  }
});

const updateOrderStatus = async (orderId, step) => {
  try {
    console.log(orderId);
    step = parseInt(step);
    const collection = client.db(dbname).collection("orders");
    const result = await collection.updateOne(
      { id: orderId },
      { $set: { currentStep: step } }
    );
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return -1;
  }
};

const getUser = async (orderId) => {
  try {
    console.log(orderId);
    const collection = client.db(dbname).collection("orders");
    const result = await collection.findOne({ id: orderId });
    console.log(result.user);
    return result.user;
  } catch (err) {
    console.log(err);
    return -1;
  }
};

const sendOrderStatusEmail = async (orderId, step) => {
  const user = await getUser(orderId);

  if (step == 1)
    sendEmail(
      user.email,
      "The payment for your order has been confirmed",
      "The order payment is confirmed"
    );
  if (step == 2)
    sendEmail(user.email, "Your order is confirmed", "Order is confirmed");
  if (step == 3)
    sendEmail(
      user.email,
      "The order has been shipped",
      "Order has been shipped"
    );
};
router.post("/update-order-status/:orderId/:step", async (req, res) => {
  try {
    const { orderId, step } = req.params;
    const result = await updateOrderStatus(orderId, step);
    if (result === -1) {
      return res.status(500).json({ message: "Failed to update data" });
    }
    console.log("l;abas");

    sendOrderStatusEmail(orderId, step);

    res.json({ message: "Order Updated" });
  } catch (err) {
    console.log(err);
  }
});
export default router;
