import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [isPending, setIsPending] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);

  const navigate = useNavigate();

  const getInputValues = () => {
    const username: string = usernameRef.current.value;
    const password: string = passwordRef.current.value;

    return { password: password, username: username };
  };

  const login = async (): Promise<void> => {
    try {
      if (
        usernameRef.current.value.length == 0 ||
        passwordRef.current.value.length == 0
      ) {
        window.alert("Please fill out all input boxes");
        return;
      }

      setIsPending(true);

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(getInputValues()),
      });

      if (!response.ok) {
        setIsPending(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON response
      console.log(data);

      if (data.isAuthenticated) navigate("/admin/dashboard");
      setIsPending(false);
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col gap-3">
      <input
        className="border-2 border-amber-500 "
        type="text"
        name=""
        id=""
        placeholder="username"
        ref={usernameRef}
      />
      <input
        className=" border-2 border-amber-200"
        type="password"
        placeholder="password"
        ref={passwordRef}
      />
      {!isPending && (
        <button className="bg-amber-400 p-5" onClick={() => login()}>
          Login
        </button>
      )}
      {isPending && <p>loading</p>}
    </div>
  );
}
