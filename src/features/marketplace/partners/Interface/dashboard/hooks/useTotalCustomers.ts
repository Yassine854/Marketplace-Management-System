import { useEffect, useState } from "react";
import axios from "axios";

export interface UseTotalCustomersResult {
  total: number;
  isLoading: boolean;
  isError: boolean;
}

export function useTotalCustomers(): UseTotalCustomersResult {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("/api/marketplace/vendorOrder/getAll")
      .then((res) => {
        const vendorOrders = res.data.vendorOrders || [];
        // Extract customer IDs from vendorOrders[].order.customer
        const customerIds = vendorOrders
          .map((vo: any) => vo.order?.customer?.id)
          .filter((id: string | undefined) => !!id);
        // Count unique customer IDs
        const uniqueCustomerIds = Array.from(new Set(customerIds));
        setTotal(uniqueCustomerIds.length);
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
