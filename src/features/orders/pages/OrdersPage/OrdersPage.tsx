import OrdersTable from "../../tables/OrdersTable";
import OrdersToolBar from "../../widgets/OrdersToolBar";
import OrdersPagination from "../../widgets/OrdersPagination";
import AnyMatchingResults from "../../widgets/AnyMatchingResults";
import { useOrdersData } from "../../hooks/queries/useOrdersData";
import Divider from "@/features/shared/elements/SidebarElements/Divider";

import { useState, useEffect, useMemo } from "react";

const OrdersPage = () => {
  const { orders, totalOrders, isLoading } = useOrdersData();
  //const [currentPage, setCurrentPage] = useState(1);
  //const [itemsPerPage, setItemsPerPage] = useState(25);

  // const totalPages = Math.ceil(totalOrders / itemsPerPage); // Calcul du nombre total de pages

  // Pagination des commandes
  // const startIndex = (currentPage - 1) * itemsPerPage;
  //const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  /*useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages); // Réinitialiser la page si elle dépasse le nombre total de pages
    }
  }, [totalPages, currentPage]);*/

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        paddingTop: "100px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <OrdersToolBar />
      </div>
      <Divider />
      <div className="    relative  flex w-full  flex-grow flex-col overflow-hidden  bg-n10 px-3">
        <div style={{ flexGrow: 1, margin: "16px 0", maxHeight: "600px" }}>
          <OrdersTable orders={orders} />
          {orders?.length == 0 && <AnyMatchingResults />}
        </div>
      </div>
      <Divider />
      <div className=" flex  w-full items-center justify-center bg-n0 ">
        <OrdersPagination />
      </div>
    </div>
  );
};

export default OrdersPage;
