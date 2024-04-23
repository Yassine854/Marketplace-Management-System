"use client";

import { IconSearch, IconSelector } from "@tabler/icons-react";

import AnyMatchingResults from "@/components/elements/OrdersTableElements/AnyMatchingResults";
import Dropdown from "@/components/elements/sharedElements/Dropdown";
import Image from "next/image";
import { Order } from "@/types/order";
import OrdersTableHead from "@/components/elements/OrdersTableElements/OrdersTableHead";
import OrdersTableHeader from "@/components/elements/OrdersTableElements/OrdersTableHeader";
import Pagination from "@/components/elements/OrdersTableElements/Pagination";
import SearchBar from "@/components/elements/OrdersTableElements/SearchBar";
import TableActions from "@/components/elements/OrdersTableElements/TableActions";
import TableRow from "@/components/elements/OrdersTableElements/TableRow";
import TableRowSkeleton from "@/components/elements/OrdersTableElements/TableRowSkeleton";
import { faker } from "@faker-js/faker";
import { useOrdersTable } from "@/hooks/useOrdersTable";
import { useState } from "react";

// import OrdersTableHead from "@/components/elements/OrdersTableElements/OrdersTableHead";
// import OrdersTableHeader from "@/components/elements/OrdersTableElements/OrdersTableHeader";
// import Pagination from "@/components/elements/OrdersTableElements/Pagination";
// import TableRowSkeleton from "@/components/elements/OrdersTableElements/TableRowSkeleton";
// import { useOrdersTable } from "@/hooks/useOrdersTable";

// const OrdersTable = ({ status = "open" }: { status?: string }) => {
//   const title = status.toString() + " " + "Orders";

//   const {
//     currentPage,
//     paginate,
//     total,
//     totalPages,
//     nextPage,
//     prevPage,
//     startIndex,
//     endIndex,
//     orders,
//     isLoading,
//     itemsPerPage,
//     setItemsPerPage,
//   } = useOrdersTable(status);

//   const skeleton = Array.apply(null, Array(itemsPerPage)).map((e, i) => {
//     i: i;
//   });

//   return (
//     <div className="box ">
//       <OrdersTableHeader title={title} />
//       <div className="bb-dashed mb-6 overflow-x-auto pb-6">
//         <table className="w-full whitespace-nowrap">
//           <OrdersTableHead />

//           {false && (
//             <tbody>
//               {orders?.map((order: Order) => (
//                 <TableRow order={order} key={order.id} onClick={() => {}} />
//               ))}
//             </tbody>
//           )}
//           {true && (
//             <tbody>
//               {skeleton.map((e, i) => (
//                 <TableRowSkeleton key={i} />
//               ))}
//             </tbody>
//           )}
//         </table>
//       </div>
//       {!isLoading && !orders?.length && <AnyMatchingResults />}
//       <Pagination
//         endIndex={endIndex}
//         total={total}
//         totalPages={totalPages}
//         currentPage={currentPage}
//         goToPage={paginate}
//         nextPage={nextPage}
//         prevPage={prevPage}
//         startIndex={startIndex}
//         itemsPerPage={itemsPerPage}
//         setItemsPerPage={setItemsPerPage}
//       />
//     </div>
//   );
// };

// export default OrdersTable;

const OrdersTable = ({ status = "open" }: { status?: string }) => {
  const title = status.toString() + " " + "Orders";
  const {
    currentPage,
    paginate,
    total,
    totalPages,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
    orders,
    isLoading,
    itemsPerPage,
    setItemsPerPage,
  } = useOrdersTable(status);

  const skeleton = Array.apply(null, Array(itemsPerPage)).map((e, i) => {
    i: i;
  });
  return (
    <div className="box     flex flex-grow flex-col  ">
      <OrdersTableHeader title={title} />
      <div className="mb-6 overflow-x-auto rounded-2xl bg-primary/5  dark:bg-bg3 ">
        <div className="min-w-min rounded-xl bg-n0 px-3 dark:bg-bg4">
          <table
            border={0}
            cellPadding={0}
            cellSpacing={0}
            style={{ borderSpacing: "0 12px" }}
            className="w-full border-separate whitespace-nowrap border-none p-0"
          >
            <OrdersTableHead />

            {!isLoading && (
              <tbody>
                {orders?.map((order: Order) => (
                  <TableRow order={order} key={order.id} onClick={() => {}} />
                ))}
              </tbody>
            )}
            {isLoading && (
              <tbody>
                {skeleton.map((e, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {!isLoading && !orders?.length && <AnyMatchingResults />}
      {!isLoading && orders?.length > 0 && (
        <Pagination
          endIndex={endIndex}
          total={total}
          totalPages={totalPages}
          currentPage={currentPage}
          goToPage={paginate}
          nextPage={nextPage}
          prevPage={prevPage}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      )}
    </div>
  );
};

export default OrdersTable;
