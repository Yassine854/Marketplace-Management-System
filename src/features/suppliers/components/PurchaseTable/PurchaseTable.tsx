import PurchaseTableHead from "./PurchaseTableHead";
import PurchaseTableRow from "./PurchaseTableRow";
import PurchaseTableSkeleton from "./PurchaseTableSkeleton";

const PurchaseTable = ({
  data,
  loading,
}: {
  data: any[];
  loading: boolean;
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-lg">
      <table className="w-full">
        <PurchaseTableHead />
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <PurchaseTableSkeleton />
          ) : (
            data.map((order) => (
              <PurchaseTableRow key={order.id} order={order} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;
