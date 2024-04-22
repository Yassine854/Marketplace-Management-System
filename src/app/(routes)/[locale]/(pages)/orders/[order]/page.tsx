import OrdersTable from "@/components/blocks/OrdersTable";

const OrdersPage = ({ params }: { params: { order: string } }) => {
  return (
    <div className="h-full w-full">
      <OrdersTable status={params.order} />
    </div>
  );
};

export default OrdersPage;
