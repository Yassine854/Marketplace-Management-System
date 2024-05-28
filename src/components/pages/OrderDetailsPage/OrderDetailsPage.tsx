import Box from "@/components/layouts/Box";
import OrderItemsTable from "@/components/tables/OrderItemsTable";

const OrderDetailsPage = () => {
  return (
    <Box>
      Order Details
      <OrderItemsTable />;
    </Box>
  );
};
export default OrderDetailsPage;
