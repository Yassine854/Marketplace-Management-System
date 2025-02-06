import PageSelector from "../PagesSelector";
import ItemsPerPageSelector from "../ItemsPerPageSelector";
import { useOrdersPagination } from "./useOrdersPagination";

const OrdersPagination = () => {
  const { totalItems, startIndex, endIndex } = useOrdersPagination();

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
        {!totalItems && "No orders found"}
      </p>

      <PageSelector />
    </div>
  );
};

export default OrdersPagination;
