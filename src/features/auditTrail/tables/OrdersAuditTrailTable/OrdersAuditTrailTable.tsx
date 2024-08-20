import TableRowSkeleton from "./elements/RowSkeleton";
import TableHead from "./elements/TableHead/TableHead";
import TableRow from "./elements/TableRow";

const OrdersAuditTrailTable = ({ auditTrail, isLoading }: any) => {
  return (
    <table border={0} cellPadding={0} cellSpacing={0}>
      <TableHead />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <TableRowSkeleton key={i} number={5} />
              ))}
            </>
          ) : (
            <>
              {auditTrail?.map(
                ({ id, username, action, orderId, time, storeId }: any) => (
                  <TableRow
                    key={id}
                    username={username}
                    action={action}
                    orderId={orderId}
                    time={time}
                    storeId={storeId}
                  />
                ),
              )}
            </>
          )}
        </>
      </tbody>
    </table>
  );
};

export default OrdersAuditTrailTable;
