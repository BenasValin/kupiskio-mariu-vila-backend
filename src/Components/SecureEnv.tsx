import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminLogin from "../Pages/AdminLogin"; // adjust path if needed

export default function SecureEnv() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        
        const response = await fetch("http://localhost:3000/verify-jwt", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || !result.isAuthenticated) {
          console.error("Failed to authenticate token");

          setIsAuth(false);
          return;
        }

        setIsAuth(true);
      } catch (err) {
        console.error(err);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuth === null) return <p>Loading...</p>;

  return isAuth ? <Outlet /> : <AdminLogin />;
}
