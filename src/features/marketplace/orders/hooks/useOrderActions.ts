import { useState } from "react";
import { axios } from "@/libs/axios";
import { Order } from "@/features/marketplace/orders/types/order";
import { toast } from "react-hot-toast";

export function useOrderActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editOrder = async (
    id: string,
    updatedOrder: Partial<Order> & { isActive?: boolean },
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.patch(
        `/api/marketplace/orders/${id}`,
        updatedOrder,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        toast.success("Order updated successfully");
        return response.data.order;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update order";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.delete(
        `/api/marketplace/orders/${id}`,
      );
      if (response.status === 200) {
        toast.success("Order deleted successfully");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete order";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderStatus = async (id: string, isActive: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.patch(
        `/api/marketplace/orders/${id}`,
        { isActive },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        const statusText = isActive ? "activated" : "deactivated";
        toast.success(`Order ${statusText} successfully`);
        return response.data.order;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update order status";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating order status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editOrder, deleteOrder, toggleOrderStatus, isLoading, error };
}
