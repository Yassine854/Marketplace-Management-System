import Box from "@/components/layouts/Box";
import OrderItemsTable from "@/components/tables/OrderItemsTable";
import { useOrdersStore } from "@/stores/ordersStore";
import { useEffect } from "react";

const OrderDetailsPage = () => {
  const { orderOnReviewId } = useOrdersStore();

  useEffect(() => {
    console.log("🚀 ~ OrderDetailsPage ~ orderOnReviewId:", orderOnReviewId);
  }, [orderOnReviewId]);
  return (
    <Box>
      Order Details
      <OrderItemsTable />;
    </Box>
  );
};
export default OrderDetailsPage;
