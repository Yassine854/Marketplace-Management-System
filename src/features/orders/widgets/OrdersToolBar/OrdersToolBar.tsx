import SortByDropdown from "../SortByDropdown";
import { useOrdersToolbar } from "./useOrdersToolBar";
import OrderCancelingModal from "../OrderCancelingModal";
import SearchBar from "@/features/shared/inputs/SearchBar";
import MultipleOrdersActionsDropdown from "../MultipleOrdersActionsDropdown";

const OrdersToolBar = () => {
  const {
    status,
    actions,
    sortRef,
    setSort,
    isPending,
    searchRef,
    setSearch,
    actionsRef,
    ordersCount,
    isCancelingModalOpen,
    cancelMultipleOrders,
    onCancelingModalClose,
    isSomeOrdersSelected,
    isCancelingPending,
  } = useOrdersToolbar();
  return (
    <div className=" flex flex-grow flex-wrap items-center justify-between gap-3  bg-n0 px-4">
      <div className="flex items-center justify-center">
        <p className="m-4 text-xl font-bold capitalize ">
          {`${status} Orders  `}
          {!!ordersCount && <span>: {ordersCount}</span>}
        </p>
        {isSomeOrdersSelected && (
          <MultipleOrdersActionsDropdown
            actions={actions}
            isPending={isPending}
            actionsRef={actionsRef}
          />
        )}
      </div>

      <div className="flex items-center justify-center gap-4 lg:gap-8 xl:gap-10">
        <SearchBar ref={searchRef} onSearch={setSearch} isWithInstantSearch />
        <SortByDropdown onSort={setSort} sortRef={sortRef} />
      </div>

      <OrderCancelingModal
        onConfirm={cancelMultipleOrders}
        isOpen={isCancelingModalOpen}
        isPending={isCancelingPending}
        onClose={onCancelingModalClose}
        message=" Are you sure you want to cancel those orders ? "
      />
    </div>
  );
};

export default OrdersToolBar;
