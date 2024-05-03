import AnyMatchingResults from "@/components/elements/TablesElements/AnyMatchingResults";
import Box from "../Box";
import OrdersTableBody from "@/components/elements/TablesElements/OpenOrdersTableElements/OrdersTableBody";
import OrdersTableHeader from "@/components/elements/TablesElements/OpenOrdersTableElements/OrdersTableHeader";
import Pagination from "@/components/blocks/Pagination";
import TableHead from "@/components/elements/TablesElements/TableHead";
import TableRow from "@/components/elements/TablesElements/TableRow";
import TableRowSkeleton from "@/components/elements/TablesElements/TableRowSkeleton";
import { tailwind } from "./Table.styles";
import { useEffect } from "react";
import { useOrdersTable } from "./useTable";
const rows = [1, 2, 3, 4, 5];

const Table = () => {
  // const title = status.toString() + " " + "Orders";

  // const setStatus = (status: string): string => {
  //   if (status == "ready") {
  //     return "shipped";
  //   }
  //   if (status == "all") {
  //     return "";
  //   }

  //   return status;
  // };

  // const {
  //   currentPage,
  //   paginate,
  //   totalOrders,
  //   totalPages,
  //   nextPage,
  //   prevPage,
  //   startIndex,
  //   endIndex,
  //   orders,
  //   isLoading,
  //   itemsPerPage,
  //   setItemsPerPage,
  //   sortOptions,
  //   sortBy,
  //   setSortBy,
  //   setSortOrder,
  //   setSearch,
  //   setSelectedOrders,
  //   selectAllOrders,
  //   selectedOrders,
  //   unSelectAllOrders,
  //   selectOrder,
  //   unSelectOrder,
  //   onRowClick,
  //   actions,
  // } = useOrdersTable(setStatus(status));
  const isLoading = false;
  return (
    <table
      border={0}
      cellPadding={0}
      cellSpacing={0}
      className="w-full border-separate overflow-x-scroll whitespace-nowrap border-none pb-16  "
    >
      <TableHead />
      {/* <OrdersTableHead
        onSortClick={(sortBy: any, sortOrder: any) => {
          setSortBy(sortBy);
          setSortOrder(sortOrder);
        }}
        selectAllOrders={selectAllOrders}
        unSelectAllOrders={unSelectAllOrders}
      /> */}

      <tbody>
        <>
          {!isLoading &&
            rows?.map((row: any, i: number) => (
              <TableRow
                key={i}
                // actions={actions}
                // order={order}
                // key={order.id}
                // onClick={() => onRowClick(order.id)}
                // onCheckClick={(isChecked: boolean) => {
                //   if (isChecked) {
                //     selectOrder(order.id);
                //   } else {
                //     unSelectOrder(order.id);
                //   }
                // }}
              />
            ))}
        </>
        <>
          {isLoading &&
            [...Array(15)].map((_, i) => (
              <TableRowSkeleton key={i} number={10} />
            ))}
        </>
        <> {!isLoading && !rows?.length && <AnyMatchingResults />}</>
      </tbody>
    </table>

    // <Box>
    //   <div className={tailwind.header}>
    //     <OrdersTableHeader
    //       title={title}
    //       sortOptions={sortOptions}
    //       sortBy={sortBy}
    //       setSortBy={setSortBy}
    //       setSearch={setSearch}
    //       selectedOrders={selectedOrders}
    //     />
    //   </div>

    //   <div className={tailwind.main}>
    // <OrdersTableBody
    //   onRowClick={onRowClick}
    //   isLoading={isLoading}
    //   orders={orders}
    //   error={""}
    //   setSortOrder={setSortOrder}
    //   setSortBy={setSortBy}
    //   setSelectedOrders={setSelectedOrders}
    //   selectAllOrders={selectAllOrders}
    //   unSelectAllOrders={unSelectAllOrders}
    //   selectOrder={selectOrder}
    //   unSelectOrder={unSelectOrder}
    //   actions={actions}
    // />
    //   </div>
    //   <div className={tailwind.footer}>
    //     {orders?.length !== 0 && (
    //       <Pagination
    //         endIndex={endIndex}
    //         totalOrders={totalOrders}
    //         totalPages={totalPages}
    //         currentPage={currentPage}
    //         goToPage={paginate}
    //         nextPage={nextPage}
    //         prevPage={prevPage}
    //         startIndex={startIndex}
    //         itemsPerPage={itemsPerPage}
    //         setItemsPerPage={setItemsPerPage}
    //       />
    //     )}
    //   </div>
    // </Box>
  );
};

export default Table;
