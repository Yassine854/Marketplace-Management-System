import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Order } from "@/features/marketplace/orders/types/order";

export const useGetAllOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        orders: Order[];
      }>("/api/marketplace/orders/getAll");

      setOrders(data.orders || []);
    } catch (err) {
      let errorMessage = "Failed to fetch orders";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
    isEmpty: !isLoading && !error && orders.length === 0,
  };
};
