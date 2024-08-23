import PageSelector from "../PagesSelector";
import ItemsPerPageSelector from "../ItemsPerPageSelector";
import { useOrdersAuditTrailPagination } from "./useOrdersAuditTrailPagination";

const OrdersAuditTrailPagination = () => {
  const { totalItems, startIndex, endIndex } = useOrdersAuditTrailPagination();

  return (
    <div
      className=" col-span-12 flex h-14  w-full flex-wrap items-center
     justify-center gap-4  rounded-xl bg-n10 px-2 sm:justify-between"
    >
      <ItemsPerPageSelector />
      <p>
        {!!totalItems &&
          `Showing ${startIndex + 1} to ${
            endIndex + 1
          } of ${totalItems} orders`}
        {!totalItems && "Showing  ***  to  ***  of  *** orders"}
      </p>

      <PageSelector />
    </div>
  );
};

export default OrdersAuditTrailPagination;
