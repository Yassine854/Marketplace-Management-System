import AdvancedSearch from "@/components/blocks/AdvancedSearch";
import OrdersTable from "@/components/blocks/OrdersTable";
import OrdersTable2 from "@/components/blocks/OrdersTable2";
const OrdersPage = ({ params }: { params: { status: string } }) => {
  return (
    <>
      {/* {"all" == "all" && <AdvancedSearch />} */}
      {params.status === "open" && <OrdersTable status={params.status} />}
      {params.status !== "open" && <OrdersTable2 status={params.status} />}
    </>
  );
};

export default OrdersPage;
