import { lazy, Suspense } from "react";
import "./App.css";
import NavBar from "./Components/NavBar";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import SecureEnv from "./Components/SecureEnv";
import Dashboard from "./Pages/Admin/Dashboard";
import AdminNavBar from "./Pages/Admin/Components/AdminNavBar";
import CartSizeContextProvider from "./contexts/cartSizeContext";

const Landing = lazy(() => import("./Pages/Landing"));
const Shop = lazy(() => import("./Pages/Shop"));
const Product = lazy(() => import("./Pages/Product"));
const Contacts = lazy(() => import("./Pages/Contacts"));
const Recipes = lazy(() => import("./Pages/Recipes"));

const Cart = lazy(() => import("./Pages/Cart"));
const Checkout = lazy(() => import("./Pages/Checkout"));

const Orders = lazy(() => import("./Pages/Admin/Orders"));
const AdminLogin = lazy(() => import("./Pages/AdminLogin"));
const AdminProducts = lazy(() => import("./Pages/Admin/AdminProducts"));
// Create a wrapper component to conditionally render NavBar
function AppContent() {
  const location = useLocation();
  const hideNavBarRoutes = [""];
  const UserLayout = () => {
    return (
      <div>
        {!hideNavBarRoutes.includes(location.pathname) && <NavBar />}
        <Outlet />
      </div>
    );
  };

  const AdminLayout = () => {
    return (
      <div>
        <AdminNavBar />
        <SecureEnv />
      </div>
    );
  };
  return (
    <>
      <CartSizeContextProvider>
        <Suspense
          fallback={
            <div className="w-20 h-20 animate-spin border-t-4 border-amber-400 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          }
        >
          <Routes>
            <Route element={<UserLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/product" element={<Product />} />

              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<AdminLogin />} />
            </Route>
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Routes>
        </Suspense>
      </CartSizeContextProvider>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
