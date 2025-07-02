import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";

interface Tax {
  id: string;
  value: number;
}

export const useGetAllTaxes = () => {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTaxes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.servicesClient.get<{
        taxes: Tax[];
      }>("/api/marketplace/tax/getAll");
      setTaxes(data.taxes || []);
    } catch (err) {
      let errorMessage = "Failed to fetch taxes";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
      setTaxes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  return {
    taxes,
    isLoading,
    error,
    refetch: fetchTaxes,
    isEmpty: !isLoading && !error && taxes.length === 0,
  };
};
