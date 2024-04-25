import OrdersTable from "@/components/blocks/OrdersTable";
const OrdersPage = ({ params }: { params: { order: string } }) => {
  return (
    <>
      <OrdersTable status={params.order} />
    </>
  );
};

export default OrdersPage;
