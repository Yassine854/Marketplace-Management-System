import OrdersTable from "@/components/blocks/OrdersTable";

const OrdersPage = ({ params }: { params: { status: string } }) => {
  return (
    <>
      <OrdersTable status={params.status} />
    </>
  );
};

export default OrdersPage;
