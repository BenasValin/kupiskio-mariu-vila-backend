import { useEffect, useState } from "react";
import { serverURL } from "../config.ts";

export default function useInsertData(path: string, body: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  console.log(`server: ${serverURL}`);

  useEffect(() => {
    if (!path || !body) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    const insertData = async () => {
      try {
        const response = await fetch(`${serverURL}/${path}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error("Failed to insert data");
        }
        setSuccess(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    insertData();
  }, [path, body]);

  return { success, loading };
}
