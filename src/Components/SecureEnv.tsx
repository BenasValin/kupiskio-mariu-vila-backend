import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

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
          navigate("/admin");
          return;
        }

        setIsAuth(true);
      } catch (err) {
        console.error(err);
        setIsAuth(false);
        navigate("/admin");
      }
    };

    checkAuth();
  }, [navigate]); // Add navigate to dependencies

  if (isAuth === null) return <p>Loading...</p>;
  return isAuth ? <Outlet /> : null;
}
