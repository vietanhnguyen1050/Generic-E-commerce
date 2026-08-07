import { useEffect, useState } from "react";
import { getHealth } from "../services/api/systemApi";
import type { HealthResponse } from "../types/item";

export const useHealth = () => {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await getHealth();
        setData(response);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error ? fetchError.message : "Unable to fetch health status.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return { data, loading, error };
};
