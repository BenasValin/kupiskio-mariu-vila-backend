import { lazy, Suspense } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useLocation, Outlet } from "react-router-dom";
// import Dashboard from "./Pages/Admin/Dashboard";
import AdminNavBar from "./Pages/Admin/Components/AdminNavBar";
import NavBar from "./Components/NavBar/NavBar.tsx";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; // for MonthPickerInput and other date components
import "dayjs/locale/lt";
// const Shop = lazy(() => import("./Pages/Shop"));
// const Cart = lazy(() => import("./Pages/Cart"));
// const Checkout = lazy(() => import("./Pages/Checkout"));
// const PaymentSuccessful = lazy(() => import("./Pages/PaymentSuccessful"));
// const PaymentFailed = lazy(() => import("./Pages/PaymentFailed"));
// const Orders = lazy(() => import("./Pages/Admin/Orders"));
// const AdminProducts = lazy(() => import("./Pages/Admin/AdminProducts"));

const Galerija = lazy(() => import("./Pages/Galerija/Galerija"));
const Reservation = lazy(() => import("./Pages/Reservation/Reservation"));
const Rules = lazy(() => import("./Pages/Rules/Rules"));
const Home = lazy(() => import("./Pages/Home/Home"));
const Kontaktai = lazy(() => import("./Pages/Kontaktai/Kontaktai"));
const Apylinkes = lazy(() => import("./Pages/Apylinkes/Apylinkes"));
const Error = lazy(() => import("./Pages/Error/Error"));
const DUK = lazy(() => import("./Pages/DUK/DUK"));
const Sventes = lazy(() => import("./Pages/Sventes/Sventes"));
const Poilsis = lazy(() => import("./Pages/Poilsis/Poilsis"));
const Kalendorius = lazy(() => import("./Pages/Admin/Kalendorius.tsx"));
const SecureEnv = lazy(() => import("./Components/SecureEnv.tsx"));
const AdminLogin = lazy(() => import("./Pages/AdminLogin.tsx"));

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
        <SecureEnv />
      </div>
    );
  };
  return (
    <>
      <Suspense
        fallback={
          <div className="w-20 h-20 animate-spin border-t-4 border-amber-400 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        }
      >
        <MantineProvider>
          <DatesProvider settings={{ locale: "lt" }}>
            <Routes>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="kontaktai" element={<Kontaktai />} />
                <Route path="rezervacija" element={<Reservation />} />
                <Route path="galerija" element={<Galerija />} />
                <Route path="apylinkes" element={<Apylinkes />} />
                <Route path="taisykles" element={<Rules />} />
                <Route path="duk" element={<DUK />} />
                <Route path="sventes" element={<Sventes />} />
                <Route path="poilsis" element={<Poilsis />} />
                <Route path="admin" element={<AdminLogin />} />
                <Route path="*" element={<Error />} />
              </Route>
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="kalendorius" element={<Kalendorius />} />
              </Route>
            </Routes>
          </DatesProvider>
        </MantineProvider>
      </Suspense>
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
