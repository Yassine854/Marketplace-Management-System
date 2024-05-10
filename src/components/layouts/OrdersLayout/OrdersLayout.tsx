import Box from "@/components/widgets/Box";
import OrdersToolBar from "@/components/widgets/OrdersToolBar";
import Pagination from "@/components/widgets/Pagination";
import Table from "@/components/widgets/Table";

const OrdersLayout = () => {
  return (
    <Box>
      <OrdersToolBar />
      <Table />
      <Pagination />
    </Box>
  );
};

export default OrdersLayout;
