import { useState, useCallback, memo, useEffect, useContext } from "react";
import { CartSizeContext } from "@/contexts/cartSizeContext";
import { serverURL } from "../config.ts";
// Define interfaces for props
interface StandardFormProps {
  formData: FormData;
  fieldErrors: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string;
}

interface ShippingProps {
  formData: FormData;
  fieldErrors: Record<string, boolean>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  shippingOption: string;
  setShippingOption: (option: string) => void;
}

interface FormData {
  name: string;
  surname: string;
  phone: string;
  email: string;
  companyName: string;
  companyCode: string;
  companyVAT: string;
  city: string;
  pastomatas: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  [key: string]: string; // Index signature for dynamic access
}

// Memoized form components to prevent unnecessary re-renders
const StandardForm = memo(
  ({ formData, fieldErrors, onChange, errorMessage }: StandardFormProps) => {
    return (
      <div className="space-y-4 w-full">
        <p
          className={`${
            errorMessage.length == 0 ? "invisible" : "block"
          } bg-red-300 rounded-md px-4 py-2`}
        >
          {errorMessage}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Vardas
            </label>
            <input
              maxLength={35}
              type="text"
              id="name"
              value={formData.name}
              onChange={onChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.name ? "border-red-500 border-2" : "border"
              }`}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="surname" className="block text-sm font-medium">
              Pavardė
            </label>
            <input
              type="text"
              id="surname"
              maxLength={35}
              value={formData.surname}
              onChange={onChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.surname ? "border-red-500 border-2" : "border"
              }`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            El. paštas
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={onChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fieldErrors.email ? "border-red-500 border-2" : "border"
            }`}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">
            Telefono numeris
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={onChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fieldErrors.phone ? "border-red-500 border-2" : "border"
            }`}
          />
        </div>
      </div>
    );
  }
);

const CompanyForm = memo(
  ({ formData, fieldErrors, onChange, errorMessage }: StandardFormProps) => {
    return (
      <div className="space-y-4 w-full">
        <StandardForm
          formData={formData}
          fieldErrors={fieldErrors}
          onChange={onChange}
          errorMessage={errorMessage}
        />
        <div className="space-y-2">
          <label htmlFor="companyName" className="block text-sm font-medium">
            Įmonės pavadinimas
          </label>
          <input
            type="text"
            id="companyName"
            value={formData.companyName}
            onChange={onChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fieldErrors.companyName ? "border-red-500 border-2" : "border"
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="companyCode" className="block text-sm font-medium">
              Įmonės kodas
            </label>
            <input
              type="text"
              id="companyCode"
              value={formData.companyCode}
              onChange={onChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.companyCode ? "border-red-500 border-2" : "border"
              }`}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="companyVAT" className="block text-sm font-medium">
              PVM kodas
            </label>
            <input
              type="text"
              id="companyVAT"
              value={formData.companyVAT}
              onChange={onChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.companyVAT ? "border-red-500 border-2" : "border"
              }`}
            />
          </div>
        </div>
      </div>
    );
  }
);

const Shipping = memo(
  ({
    formData,
    fieldErrors,
    onChange,
    shippingOption,
    setShippingOption,
  }: ShippingProps) => {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Shipping</h3>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center">
            <input
              type="radio"
              name="shipping"
              id="pastomatas"
              checked={shippingOption === "pastomatas"}
              onChange={() => setShippingOption("pastomatas")}
              className="mr-2"
            />
            <label htmlFor="pastomatas">Paštomatas</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="shipping"
              id="kurjeris"
              checked={shippingOption === "kurjeris"}
              onChange={() => setShippingOption("kurjeris")}
              className="mr-2"
            />
            <label htmlFor="kurjeris">Kurjeris</label>
          </div>
        </div>

        {shippingOption === "pastomatas" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium">
                Miestas
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={onChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.city ? "border-red-500 border-2" : "border"
                }`}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pastomatas" className="block text-sm font-medium">
                Paštomatas
              </label>
              <input
                type="text"
                id="pastomatas"
                value={formData.pastomatas}
                onChange={onChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.pastomatas ? "border-red-500 border-2" : "border"
                }`}
              />
            </div>
          </div>
        )}

        {shippingOption === "kurjeris" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium">
                Miestas
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={onChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.city ? "border-red-500 border-2" : "border"
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="street" className="block text-sm font-medium">
                  Gatvė
                </label>
                <input
                  type="text"
                  id="street"
                  value={formData.street}
                  onChange={onChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.street ? "border-red-500 border-2" : "border"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="houseNumber"
                  className="block text-sm font-medium"
                >
                  Namo Nr. - (Buto Nr.)
                </label>
                <input
                  type="text"
                  id="houseNumber"
                  value={formData.houseNumber}
                  onChange={onChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.houseNumber
                      ? "border-red-500 border-2"
                      : "border"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="postalCode" className="block text-sm font-medium">
                Postal code
              </label>
              <input
                type="text"
                id="postalCode"
                value={formData.postalCode}
                onChange={onChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.postalCode ? "border-red-500 border-2" : "border"
                }`}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Cart summary component
const CartSummary = memo(
  ({
    cartData,
    loading,
    error,
  }: {
    cartData: any[];
    loading: boolean;
    error: string | null;
  }) => {
    // Get the effective price (sale price if on sale, regular price otherwise)
    const getEffectivePrice = (product: any) => {
      return product.onSale && product.salePrice
        ? product.salePrice
        : product.price;
    };

    // Calculate totals
    const subtotal = cartData.reduce((sum, product) => {
      const quantity = product.quantity || 1;
      const effectivePrice = getEffectivePrice(product);
      return sum + effectivePrice * quantity;
    }, 0);

    const savings = cartData.reduce((sum, product) => {
      const quantity = product.quantity || 1;
      if (product.onSale && product.salePrice) {
        return sum + (product.price - product.salePrice) * quantity;
      }
      return sum;
    }, 0);

    if (loading) return <p>Loading cart items...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (cartData.length === 0) return <p>Your cart is empty</p>;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="max-h-64 overflow-y-auto mb-4">
          {cartData.map((product) => (
            <div key={product.id} className="flex items-center py-3 border-b">
              <div className="w-12 h-12 mr-4">
                <img
                  src={product.images[0] || "/placeholder.jpg"}
                  alt={product.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium truncate">{product.title}</p>
                <div className="flex justify-between items-center mt-1">
                  <div>
                    {product.onSale && product.salePrice ? (
                      <span className="text-green-600 font-medium">
                        {product.salePrice.toFixed(2)} €
                      </span>
                    ) : (
                      <span>{product.price.toFixed(2)} €</span>
                    )}
                  </div>
                  <span className="text-gray-600">
                    Qty: {product.quantity || 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal:</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between py-1 text-green-600">
              <span>Savings:</span>
              <span>{savings.toFixed(2)} €</span>
            </div>
          )}
          <div className="flex justify-between py-1 text-gray-600">
            <span>Shipping:</span>
            <span>To be calculated</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-200 mt-2 pt-2">
            <span>Total:</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    );
  }
);

export default function Checkout() {
  const [companyFormActive, setCompanyFormActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shippingOption, setShippingOption] = useState<string>("");

  // Cart data states (from Cart component)
  const [cartIDs, setCartIDs] = useState<string[]>([]);
  const [localStorageCart, setLocalStorageCart] = useState<any[]>([]);
  const [cartData, setCartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    // Personal info
    name: "",
    surname: "",
    phone: "",
    email: "",

    // Company info
    companyName: "",
    companyCode: "",
    companyVAT: "",

    // Shipping info
    city: "",
    pastomatas: "",
    street: "",
    houseNumber: "",
    postalCode: "",
  });

  // Field validation state to track which fields have errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  // Cart data fetching logic (from Cart component)
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
    return localStorageCart.find((item) => item.productId == id)?.quantity || 1;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${serverURL}/api/cart`, {
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
      setCartData(result);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setError("Failed to load cart items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Memoize the input change handler to prevent it from being recreated on each render
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));

      // Clear error for this field if it exists
      if (fieldErrors[id]) {
        setFieldErrors((prev) => ({
          ...prev,
          [id]: false,
        }));
      }
    },
    [fieldErrors]
  );

  const createCheckoutSession = () => {
    fetch(`${serverURL}/api/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((e) => Promise.reject(e));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  // Memoize the shipping option setter
  const handleShippingOptionChange = useCallback((option: string) => {
    setShippingOption(option);
  }, []);

  const formIsEmpty = useCallback(() => {
    let fieldsToValidate: string[];
    let hasError = false;

    if (companyFormActive) {
      fieldsToValidate = [
        "name",
        "surname",
        "phone",
        "email",
        "companyName",
        "companyCode",
        "companyVAT",
      ];
    } else {
      fieldsToValidate = ["name", "surname", "phone", "email"];
    }

    // Add shipping fields based on selected option
    if (shippingOption === "pastomatas") {
      fieldsToValidate.push("city", "pastomatas");
    } else if (shippingOption === "kurjeris") {
      fieldsToValidate.push("city", "street", "houseNumber", "postalCode");
    }

    const newFieldErrors: Record<string, boolean> = {};

    // Check each required field
    fieldsToValidate.forEach((field) => {
      if (formData[field] === "") {
        newFieldErrors[field] = true;
        hasError = true;
      }
    });

    // Update field errors state
    setFieldErrors(newFieldErrors);

    // Set error message if needed
    if (hasError) {
      setErrorMessage("Please fill out all input boxes");
    } else {
      setErrorMessage("");
    }

    return hasError;
  }, [companyFormActive, shippingOption, formData]);

  const proceedToReview = async () => {
    try {
      const response = await fetch(`${serverURL}/api/insert-order-user-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      createCheckoutSession();
    } catch (err) {
      console.error("Error submitting user data:", err);
    }
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!formIsEmpty()) {
        proceedToReview();
      }
    },
    [formData, formIsEmpty]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Customer information form */}
        <div className="w-full md:w-3/5">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Užsakymo informacija</h2>

            <div className="flex gap-8 mb-6">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="customerType"
                  id="person"
                  checked={!companyFormActive}
                  onChange={() => setCompanyFormActive(false)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="person" className="text-sm font-medium">
                  Fizinis asmuo
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="customerType"
                  id="company"
                  checked={companyFormActive}
                  onChange={() => setCompanyFormActive(true)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="company" className="text-sm font-medium">
                  Juridinis asmuo
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {companyFormActive ? (
                <CompanyForm
                  formData={formData}
                  fieldErrors={fieldErrors}
                  onChange={handleInputChange}
                  errorMessage={errorMessage}
                />
              ) : (
                <StandardForm
                  formData={formData}
                  fieldErrors={fieldErrors}
                  onChange={handleInputChange}
                  errorMessage={errorMessage}
                />
              )}

              <Shipping
                formData={formData}
                fieldErrors={fieldErrors}
                onChange={handleInputChange}
                shippingOption={shippingOption}
                setShippingOption={handleShippingOptionChange}
              />

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Complete Order
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right column - Cart summary */}
        <div className="w-full md:w-2/5 mt-8 md:mt-0">
          <CartSummary cartData={cartData} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
