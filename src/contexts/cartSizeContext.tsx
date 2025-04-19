import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

// Define the type for your context (without the null option)
type CartSizeContextType = {
  cartSize: number;
  setCartSize: Dispatch<SetStateAction<number>>;
};

// Create a default value that matches the type
const defaultContextValue: CartSizeContextType = {
  cartSize: 0,
  setCartSize: () => {},
};

// Initialize with the default value
export const CartSizeContext =
  createContext<CartSizeContextType>(defaultContextValue);

// Create a custom hook to safely use the context
export const useCartSizeContext = () => {
  const context = useContext(CartSizeContext);
  if (!context) {
    throw new Error(
      "useCartSizeContext must be used within a CartSizeContextProvider"
    );
  }
  return context;
};

export default function CartSizeContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Arrays don't have a size() method in JavaScript, use length property instead
  const initialCartSize = () => {
    const cartProducts = JSON.parse(
      localStorage.getItem("cart_products") || "[]"
    );
    const suma: number = cartProducts.reduce(
      (sum: number, product: any) => sum + product.quantity,
      0
    );
    return suma;
  };

  const [cartSize, setCartSize] = useState<number>(initialCartSize());

  return (
    <CartSizeContext.Provider value={{ cartSize, setCartSize }}>
      {children}
    </CartSizeContext.Provider>
  );
}
