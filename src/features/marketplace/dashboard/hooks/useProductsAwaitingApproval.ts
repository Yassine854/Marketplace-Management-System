import { useEffect, useState } from "react";
import axios from "axios";

export interface UseProductsAwaitingApprovalResult {
  awaiting: number;
  isLoading: boolean;
  isError: boolean;
}

export function useProductsAwaitingApproval(): UseProductsAwaitingApprovalResult {
  const [awaiting, setAwaiting] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("/api/marketplace/products/getAll")
      .then((res) => {
        const products = res.data.products || [];
        setAwaiting(
          products.filter((p: { accepted: boolean }) => !p.accepted).length,
        );
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  return {
    awaiting,
    isLoading,
    isError,
  };
}
