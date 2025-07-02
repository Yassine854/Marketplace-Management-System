import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";

interface Brand {
  id: string;
  img: string;
  name: string | null;
}

export const useGetAllBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.servicesClient.get<{
        brands: Brand[];
      }>("/api/marketplace/brand/getAll");
      setBrands(data.brands || []);
    } catch (err) {
      let errorMessage = "Failed to fetch brands";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
      setBrands([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return {
    brands,
    isLoading,
    error,
    refetch: fetchBrands,
    isEmpty: !isLoading && !error && brands.length === 0,
  };
};
