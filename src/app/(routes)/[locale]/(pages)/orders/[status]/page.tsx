import AdvancedSearch from "@/components/blocks/AdvancedSearch";
import OrdersTable from "@/components/blocks/OrdersTable";

const OrdersPage = ({ params }: { params: { status: string } }) => {
  return (
    <>
      {/* {"all" == "all" && <AdvancedSearch />} */}
      <OrdersTable status={"all"} />
    </>
  );
};

export default OrdersPage;
