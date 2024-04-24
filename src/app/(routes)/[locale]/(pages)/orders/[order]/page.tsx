import OrdersTable from "@/components/blocks/OrdersTable";
const OrdersPage = ({ params }: { params: { order: string } }) => {
  return (
    <div className="flex flex-grow  ">
      <OrdersTable status={params.order} />
    </div>
  );
};

export default OrdersPage;
