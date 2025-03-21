import OrdersTable from "../../tables/OrdersTable";
import OrdersToolBar from "../../widgets/OrdersToolBar";
import OrdersPagination from "../../widgets/OrdersPagination";
import AnyMatchingResults from "../../widgets/AnyMatchingResults";
import { useOrdersData } from "../../hooks/queries/useOrdersData";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "@mui/material/Pagination";
import styles from "../../styles/pagination.module.css";
import { useState } from "react";

const OrdersPage = () => {
  const { orders } = useOrdersData();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(orders.length / 10);

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between    ">
      <div className=" mt-[4.8rem]  flex  w-full items-center justify-center   ">
        <OrdersToolBar />
      </div>
      <Divider />
      <div className="    relative  flex w-full  flex-grow flex-col overflow-y-scroll  bg-n10 px-3">
        <OrdersTable />
        {orders?.length == 0 && <AnyMatchingResults />}
      </div>
      <Divider />
      <div className={styles.pagination}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
          className="pagination"
        />
      </div>
    </div>
  );
};

export default OrdersPage;
