import OrdersTable from "../../tables/OrdersTable";
import OrdersToolBar from "../../widgets/OrdersToolBar";
import OrdersPagination from "../../widgets/OrdersPagination";
import AnyMatchingResults from "../../widgets/AnyMatchingResults";
import { useOrdersData } from "../../hooks/queries/useOrdersData";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "@/features/shared/elements/Pagination/Pagination";

import { useState } from "react";

const OrdersPage = () => {
  const { orders } = useOrdersData();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Pagination des commandes
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[4.8rem]  flex  w-full items-center justify-center   ">
        <OrdersToolBar />
      </div>
      <Divider />
      <div className="    relative  flex w-full  flex-grow flex-col overflow-y-scroll  bg-n10 px-3">
        <OrdersTable orders={paginatedOrders} />
        {orders?.length == 0 && <AnyMatchingResults />}
      </div>
      <Divider />
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
