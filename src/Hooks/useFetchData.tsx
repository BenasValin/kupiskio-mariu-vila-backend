import { useEffect, useState, useCallback } from "react";

export default function useFetchData(path: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${path}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path, refreshTrigger]); // Runs once when `path` changes

  return { data, loading, error, refresh };
}
