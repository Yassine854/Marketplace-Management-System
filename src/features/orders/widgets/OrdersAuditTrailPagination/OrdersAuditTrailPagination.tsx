import PageSelector from "../PagesSelector";
import ItemsPerPageSelector from "../ItemsPerPageSelector";
import { useOrdersAuditTrailPagination } from "./useOrdersAuditTrailPagination";

const OrdersAuditTrailPagination = ({ count }: any) => {
  const { startIndex, endIndex } = useOrdersAuditTrailPagination(count);

  return (
    <div
      className=" col-span-12 flex h-14  w-full flex-wrap items-center
     justify-center gap-4  rounded-xl bg-n10 px-2 sm:justify-between"
    >
      <ItemsPerPageSelector />
      <p>
        {!!count &&
          `Showing ${startIndex + 1} to ${endIndex + 1} of ${count} orders`}
        {!count && "Showing  ***  to  ***  of  *** orders"}
      </p>

      <PageSelector />
    </div>
  );
};

export default OrdersAuditTrailPagination;
