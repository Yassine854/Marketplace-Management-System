import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { useAuth } from "@/shared/hooks/useAuth";

// Define VendorOrder type based on Prisma schema and included relations
export type VendorOrder = {
  id: string;
  orderCode: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  status?: {
    id: string;
    name: string;
  } | null;
  state?: {
    id: string;
    name: string;
  } | null;
  partner: {
    id: string;
    name?: string;
    // Add more fields as needed
  };
  order: {
    id: string;
    // Add more fields as needed
  };
  orderAgent?: {
    id: string;
    // Add more fields as needed
  } | null;
  itemsSnapshot?: any;
};

export const useGetAllOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // No partnerId needed, backend uses session
      const { data } = await axios.servicesClient.get<{
        vendorOrders: VendorOrder[];
      }>(`/api/marketplace/vendorOrder/getAll`);
      setOrders(data.vendorOrders || []);
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
    if (user?.id) {
      fetchOrders();
    }
    // Optionally, clear orders if user logs out
    // else setOrders([]);
  }, [user?.id]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
    isEmpty: !isLoading && !error && orders.length === 0,
  };
};
