import { useEffect, useState } from "react";

import Box from "@/components/widgets/Box";
import OrdersToolBar from "@/components/widgets/OrdersToolBar";
import Pagination from "@/components/widgets/Pagination";
import Table from "@/components/widgets/Table";

const OrdersLayout = ({ tableRows, totalOrders, tableHeadCells }: any) => {
  return (
    <Box>
      <div className="absolute left-0 right-0 top-0 z-30 h-20 w-full bg-n10">
        <OrdersToolBar />
      </div>
      <div className="mt-16 flex  w-full overflow-y-scroll  bg-n10 px-4">
        <Table headCells={tableHeadCells} rows={tableRows} isLoading={false} />
      </div>
      <div className="bt-dashed absolute bottom-0 left-0 right-0 z-10 h-16 w-full bg-n10">
        <Pagination totalItems={totalOrders} />
      </div>
    </Box>
  );
};

export default OrdersLayout;
