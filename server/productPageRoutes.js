import express from "express";
import { client, dbname } from "./dbConnection.js";
import { generateID } from "./adminControl.js";
const router = express.Router();

async function getProductData(id) {
  try {
    const collection = client.db(dbname).collection("productData");
    const data = await collection.findOne({ id: `${id}` });
    return data;
  } catch (err) {
    console.error("Error fetching data from DB:", err);
    throw new Error("Database query failed");
  }
}

// Route to get product by ID
router.get("/shop/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const data = await getProductData(id);

    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function updateProductData(product) {
  try {
    const collection = client.db(dbname).collection("productData");
    const data = await collection.updateOne(
      { id: `${product.id}` },
      { $set: product }
    );
    return data;
  } catch (err) {
    console.error("Error fetching data from DB:", err);
    throw new Error("Database query failed");
  }
}

router.post("/shop/update-product/", async (req, res) => {
  const product = req.body.product;
  console.log(product);
  try {
    const data = await updateProductData(product);

    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getCartData = async (cartIDs) => {
  try {
    const collection = client.db(dbname).collection("productData");

    const stringIDs = cartIDs.map((id) => id.toString());

    const data = await collection.find({ id: { $in: stringIDs } }).toArray();
    return data;
  } catch (err) {
    console.log(err);
    return -1;
  }
};

router.post("/api/cart", async (req, res) => {
  try {
    const data = await getCartData(req.body);
    if (!data || data === -1) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const createNewOrder = async (document) => {
  try {
    const collection = client.db(dbname).collection("orders");
    const newID = generateID();
    const data = await collection.insertOne({
      id: newID,
      orderInfo: document,
      currentStep: 0,
    });
    return { data, newID };
  } catch (err) {
    console.log(err);
    return -1;
  }
};

const updateOrder = async (id, document) => {
  try {
    const collection = client.db(dbname).collection("orders");
    const data = await collection.updateOne(
      { id: id },
      { $set: { orderInfo: document } }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

router.post("/api/create-order-document", async (req, res) => {
  try {
    const orderID = req.cookies.order_id;
    console.log(orderID);
    if (orderID) {
      const data = await updateOrder(orderID, req.body);
      if (!data || data === -1) {
        return res.status(404).json({ message: "No products found" });
      }
      res.json(data.acknowledged);
    } else {
      const { data, newID } = await createNewOrder(req.body);

      if (!data || data === -1) {
        return res.status(404).json({ message: "No products found" });
      }

      res.cookie("order_id", newID, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax", // Change from "None" to "Lax" for localhost
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      });
      res.json(data);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const updateOrderUser = async (id, document) => {
  try {
    const collection = client.db(dbname).collection("orders");
    const data = await collection.updateOne(
      { id: id },
      { $set: { user: document, currentStep: 0 } }
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

router.post("/api/insert-order-user-data", async (req, res) => {
  try {
    const orderID = req.cookies.order_id;
    const data = await updateOrderUser(orderID, req.body);
    if (!data || data === -1) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(data.acknowledged);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

async function confirmOrder(id) {
  try {
    const collection = client.db(dbname).collection("productData");
    const data = await collection.findOne({ id: `${id}` });
    return data;
  } catch (err) {
    console.error("Error fetching data from DB:", err);
    throw new Error("Database query failed");
  }
}

// Route to get product by ID
router.get("/api/order-confirmation", async (req, res) => {
  const id = req.params.id;

  try {
    const data = await getProductData(id);

    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// const getCouponData = async (cartIDs) => {
//   try {
//     const collection = client.db(dbname).collection("productData");

//     const stringIDs = cartIDs.map((id) => id.toString());

//     const data = await collection.find({ id: { $in: stringIDs } }).toArray();
//     return data;
//   } catch (err) {
//     console.log(err);
//     return -1;
//   }
// };

// router.post("/api/coupon", async (req, res) => {
//   try {
//     const data = await getCartData(req.body);
//     if (!data || data === -1) {
//       return res.status(404).json({ message: "No products found" });
//     }
//     res.json(data);
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(500);
//   }
// });
export default router;
