import Pagination, {
  PaginationRef,
} from "@/components/widgets/OrdersWidgets/Pagination";
import { useEffect, useRef } from "react";

import Box from "@/components/widgets/Box";
import OrdersTable from "@/components/widgets/OrdersWidgets/OrdersTable";
import OrdersToolBar from "@/components/widgets/OrdersWidgets/OrdersToolBar";

const OrdersTemplate = ({
  orders,
  totalOrders,
  isLoading,
  onItemsPerPageChanged,
  onPageChanged,
  onSearch,
  selectedStatus,
}: any) => {
  const ref = useRef<PaginationRef>(null);

  useEffect(() => {
    console.log("🚀 ~ selectedStatus:", selectedStatus);

    ref.current?.reset();
  }, [selectedStatus]);

  return (
    <Box>
      <div className="absolute left-0 right-0 top-0 z-30 h-20 w-full bg-n10">
        <OrdersToolBar onSearch={onSearch} selectedStatus={selectedStatus} />
      </div>
      <div className="mt-16 flex  w-full overflow-y-scroll  bg-n10 px-4">
        <OrdersTable isLoading={isLoading} orders={orders} />
      </div>
      <div className="bt-dashed absolute bottom-0 left-0 right-0 z-10 h-16 w-full bg-n10">
        <Pagination
          ref={ref}
          selectedStatus={selectedStatus}
          totalItems={totalOrders}
          onItemsPerPageChanged={onItemsPerPageChanged}
          onPageChanged={onPageChanged}
        />
      </div>
    </Box>
  );
};

export default OrdersTemplate;
