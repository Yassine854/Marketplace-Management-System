import SortByDropdown from "../SortByDropdown";
import SearchBar from "@/features/shared/inputs/SearchBar";
import MultipleOrdersActionsDropdown from "../MultipleOrdersActionsDropdown";

const OrdersToolBar = ({
  onSort,
  sortRef,
  actions,
  onSearch,
  isPending,
  searchRef,
  actionsRef,
  ordersCount,
  selectedStatus,
  isSomeOrdersSelected,
}: any) => {
  return (
    <div className=" flex flex-grow flex-wrap items-center justify-between gap-3  bg-n0 px-4">
      <div className="flex items-center justify-center">
        <p className="m-4 text-xl font-bold capitalize ">
          {`${selectedStatus} Orders  `}
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
        <SearchBar ref={searchRef} onSearch={onSearch} isWithInstantSearch />
        <SortByDropdown onSort={onSort} sortRef={sortRef} />
      </div>
    </div>
  );
};

export default OrdersToolBar;
