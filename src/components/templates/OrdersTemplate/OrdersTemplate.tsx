import Box from "@/components/blocks/Box";
import OrdersToolBar from "@/components/blocks/OrdersToolBar";
import Pagination from "@/components/blocks/Pagination";
import Table from "@/components/blocks/Table";

const OrdersTemplate = () => {
  return (
    <Box>
      <OrdersToolBar />
      <Table />
      <Pagination />
    </Box>
  );
};

export default OrdersTemplate;
