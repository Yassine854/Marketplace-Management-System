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
      .get("/api/marketplace/orders/getAll?page=1&limit=10000")
      .then((res) => {
        const orders = res.data.orders || [];
        const total = orders.reduce(
          (sum: number, order: { amountTTC: number }) =>
            sum + (order.amountTTC || 0),
          0,
        );
        setTotalAmount(total);
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
