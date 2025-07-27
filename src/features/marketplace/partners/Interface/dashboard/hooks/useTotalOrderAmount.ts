import { useEffect, useState } from "react";
import axios from "axios";

export interface UseTotalOrderAmountResult {
  totalAmount: number;
  isLoading: boolean;
  isError: boolean;
}

export function useTotalOrderAmount(): UseTotalOrderAmountResult {
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("/api/marketplace/vendorOrder/totalAmount")
      .then((res) => {
        const totalAmount = res.data.totalAmount || 0;
        setTotalAmount(totalAmount);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  return {
    totalAmount,
    isLoading,
    isError,
  };
}
