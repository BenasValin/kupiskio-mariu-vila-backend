import { CartSizeContext } from "@/contexts/cartSizeContext";
import { useState, useEffect, useContext, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartIDs, setCartIDs] = useState<string[]>([]);
  const [localStorageCart, setLocalStorageCart] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { cartSize, setCartSize } = useContext(CartSizeContext);
  const [coupon, setCoupon] = useState<string>("");
  const navigate = useNavigate();

  const getCartItems = () => {
    const items = localStorage.getItem("cart_products");
    if (!items) {
      setCartIDs([]);
      return;
    }
    try {
      const parsedItems = JSON.parse(items);
      const itemsIDs = parsedItems.map((item: any) => item.productId);
      setLocalStorageCart(parsedItems);
      console.log(itemsIDs);
      setCartIDs(itemsIDs);
    } catch (err) {
      console.error("Error parsing cart items from localStorage:", err);
      setCartIDs([]);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    // Only fetch data if we have cartIDs
    if (cartIDs.length > 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [cartIDs]);

  const calculateQuantity = (id: string) => {
    return localStorageCart.find((item) => item.productId == id).quantity;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartIDs),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      result.forEach((product: any) => {
        product.quantity = calculateQuantity(product.id);
      });
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setError("Failed to load cart items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Get the effective price (sale price if on sale, regular price otherwise)
  const getEffectivePrice = (product: any) => {
    return product.onSale && product.salePrice
      ? product.salePrice
      : product.price;
  };

  const calculateTotal = (product: any, quantity: number = 1) => {
    const effectivePrice = getEffectivePrice(product);
    return (effectivePrice * quantity).toFixed(2);
  };

  const removeItem = (id: string) => {
    let cartProducts: { productId: string; quantity: number }[] = JSON.parse(
      localStorage.getItem("cart_products") || "[]"
    );

    cartProducts = cartProducts.filter(
      (product) => product.productId !== id.toString()
    );
    localStorage.setItem("cart_products", JSON.stringify(cartProducts));

    const newCartIDs = cartProducts.map((item) => item.productId);
    setCartIDs(newCartIDs);

    setData((prevData) =>
      prevData.filter((product) => product.id.toString() !== id.toString())
    );

    setCartSize(cartProducts.length);
  };

  const applyCoupon = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/apply-coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coupon),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      console.log(response);
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const proceedToCheckout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/create-order-document",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const responseData = await response.json();
      navigate("/checkout");
    } catch {}
  };

  return (
    <div className="container mx-auto p-4 flex flex-col ">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {loading ? (
        <p>Loading cart items...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : data.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-5 gap-4 mb-4 font-semibold border-b pb-2">
            <p>Prekė</p>
            <p>Kaina</p>
            <p>Kiekis</p>
            <p>Iš viso</p>
            <p>Veiksmai</p>
          </div>

          {data.map((product: any) => (
            <div
              key={product.id}
              className="grid grid-cols-5 gap-4 items-center py-4 border-b"
            >
              <div className="flex items-center">
                <img
                  src={product.images[0] || "/placeholder.jpg"}
                  alt={product.title}
                  className="w-16 h-16 object-cover mr-4"
                />
                <p>{product.title}</p>
              </div>
              <div>
                {product.onSale && product.salePrice ? (
                  <div>
                    <p className="text-green-600 font-medium">
                      {product.salePrice.toFixed(2)} €
                    </p>
                    <p className="text-gray-500 line-through text-sm">
                      {product.price.toFixed(2)} €
                    </p>
                  </div>
                ) : (
                  <p>{product.price.toFixed(2)} €</p>
                )}
              </div>
              <input
                type="number"
                min="1"
                className="border rounded px-2 py-1 w-16"
                value={product.quantity || 1}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;

                  setData(
                    data.map((item) =>
                      item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                    )
                  );
                  let cartProducts: { productId: string; quantity: number }[] =
                    JSON.parse(localStorage.getItem("cart_products") || "[]");

                  const index = cartProducts.findIndex(
                    (item) => item.productId === product.id
                  );
                  cartProducts[index].quantity = newQuantity;
                  localStorage.setItem(
                    "cart_products",
                    JSON.stringify(cartProducts)
                  );
                }}
              />
              <p className="font-medium">
                {calculateTotal(product, product.quantity || 1)} €
              </p>
              <button
                onClick={() => removeItem(product.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>
                  {data
                    .reduce((sum, product) => {
                      const quantity = product.quantity || 1;
                      const effectivePrice = getEffectivePrice(product);
                      return sum + effectivePrice * quantity;
                    }, 0)
                    .toFixed(2)}{" "}
                  €
                </span>
              </div>
              <div className="flex justify-between py-2 text-green-600">
                <span>Savings:</span>
                <span>
                  {data
                    .reduce((sum, product) => {
                      const quantity = product.quantity || 1;
                      if (product.onSale && product.salePrice) {
                        return (
                          sum + (product.price - product.salePrice) * quantity
                        );
                      }
                      return sum;
                    }, 0)
                    .toFixed(2)}{" "}
                  €
                </span>
              </div>
              <button
                onClick={() => proceedToCheckout()}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
