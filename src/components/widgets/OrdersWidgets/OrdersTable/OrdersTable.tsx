import OrdersTableHead from "./OrdersTableHead";
import OrdersTableRow from "./OrdersTableRow";
import TableRowSkeleton from "@/components/elements/TablesElements/TableRowSkeleton";

const OrdersTable = ({ orders, isLoading }: any) => {
  return (
    <table
      border={0}
      cellPadding={0}
      cellSpacing={0}
      className="relative w-full border-separate overflow-hidden overflow-x-scroll whitespace-nowrap  "
    >
      <OrdersTableHead />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(10)].map((_, i) => (
                <TableRowSkeleton key={i} number={10} />
              ))}
            </>
          ) : (
            <>
              {orders?.map((order: any) => (
                <OrdersTableRow key={order?.id} order={order} />
              ))}
            </>
          )}
        </>
      </tbody>
    </table>
  );
};

export default OrdersTable;
