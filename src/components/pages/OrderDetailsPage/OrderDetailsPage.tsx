import Box from "@/components/Layouts/Box";
import OrderItemsTable from "@/components/widgets/OrdersWidgets/OrderItemsTable";

const OrderDetailsPage = () => {
  return (
    <Box>
      Order Details
      <OrderItemsTable />;
    </Box>
  );
};
export default OrderDetailsPage;
