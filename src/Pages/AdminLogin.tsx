import { useRef, useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../config.ts";

interface LoginResponse {
  isAuthenticated: boolean;
  message?: string;
}

export default function AdminLogin() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if username is saved in localStorage
    const savedUsername = localStorage.getItem("adminUsername");
    if (savedUsername && usernameRef.current) {
      usernameRef.current.value = savedUsername;
      setRememberMe(true);
    }

    // Focus on username field on load
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const getInputValues = (): { username: string; password: string } => ({
    username: usernameRef.current?.value || "",
    password: passwordRef.current?.value || "",
  });

  const login = async (): Promise<void> => {
    try {
      // Clear any previous errors
      setError("");

      if (!usernameRef.current?.value || !passwordRef.current?.value) {
        setError("Prašome užpildyti visus laukelius");
        return;
      }

      setIsPending(true);

      const response = await fetch(`${serverURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(getInputValues()),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError("Neteisingas vartotojo vardas arba slaptažodis");
        } else {
          setError(`Klaida: ${data.message || "Įvyko nenumatyta klaida"}`);
        }
        setIsPending(false);
        return;
      }

      // Handle Remember Me functionality
      if (rememberMe && usernameRef.current) {
        localStorage.setItem("adminUsername", usernameRef.current.value);
      } else {
        localStorage.removeItem("adminUsername");
      }

      if (data.isAuthenticated) {
        // Show success message briefly before redirecting
        setError("");
        setTimeout(() => {
          navigate("/admin/kalendorius");
        }, 500);
      } else {
        setError("Prisijungimas nepavyko");
      }

      setIsPending(false);
    } catch (err) {
      console.error("Error during login:", err);
      setError("Ryšio klaida. Bandykite vėliau");
      setIsPending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      login();
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 flex flex-col gap-6 border ">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-600">
            Administratoriaus Prisijungimas
          </h2>
          <p className="text-gray-500 mt-2">Įveskite prisijungimo duomenis</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Vartotojo vardas
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="username"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                type="text"
                placeholder="Įveskite vartotojo vardą"
                ref={usernameRef}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Slaptažodis
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="password"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                type={showPassword ? "text" : "password"}
                placeholder="Įveskite slaptažodį"
                ref={passwordRef}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-amber-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-amber-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Prisiminti mane
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={login}
          disabled={isPending}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center shadow-md
          "
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Jungiamasi...
            </>
          ) : (
            "Prisijungti"
          )}
        </button>

        <div className="text-center text-sm text-gray-500">
          Iškilus problemoms, susisiekite su{" "}
          <span className="text-amber-600">administratoriumi</span>
        </div>
      </div>
    </div>
  );
}
