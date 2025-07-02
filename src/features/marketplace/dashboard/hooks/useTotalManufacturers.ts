import { useEffect, useState } from "react";
import axios from "axios";

export interface UseTotalManufacturersResult {
  total: number;
  isLoading: boolean;
  isError: boolean;
}

export function useTotalManufacturers(): UseTotalManufacturersResult {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("/api/marketplace/supplier/getAll")
      .then((res) => {
        setTotal(res.data.manufacturers?.length || 0);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  return {
    total,
    isLoading,
    isError,
  };
}
