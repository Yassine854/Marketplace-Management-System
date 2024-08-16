import TableRowSkeleton from "./elements/RowSkeleton";
import TableHead from "./elements/TableHead/TableHead";
import TableRow from "./elements/TableRow";

const OrdersAuditTrailTable = ({ trails, isLoading }: any) => {
  return (
    <table border={0} cellPadding={0} cellSpacing={0}>
      <TableHead />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <TableRowSkeleton key={i} number={4} />
              ))}
            </>
          ) : (
            <>
              {trails?.map(({ id, username, action, orderId, time }: any) => (
                <TableRow
                  key={id}
                  username={username}
                  action={action}
                  orderId={orderId}
                  time={time}
                />
              ))}
            </>
          )}
        </>
      </tbody>
    </table>
  );
};

export default OrdersAuditTrailTable;
