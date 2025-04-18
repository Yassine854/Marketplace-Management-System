import { useState, useEffect } from "react";
import SortByDropdown from "../SortByDropdown";
import { useOrdersToolbar } from "./useOrdersToolBar";
import OrderCancelingModal from "../OrderCancelingModal";
import SearchBar from "@/features/shared/inputs/SearchBar";
import MultipleOrdersActionsDropdown from "../MultipleOrdersActionsDropdown";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { useOrdersData } from "../../hooks/queries/useOrdersData";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { refetch } = useOrdersData();

  const [orderId, setOrderId] = useState("");
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [deliveryAgent, setDeliveryAgent] = useState("");
  const [productsnames, setproductsnames] = useState("");
  const [sku, setsku] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const { setFilters, filters } = useFiltersStore();

  const handleDropdownToggle = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleResetFilters = () => {
    // Reset all the form fields to their initial state
    setOrderId("");
    setClientFirstName("");
    setClientLastName("");
    setDeliveryAgent("");
    setproductsnames("");
    setsku("");
    setDateRange([null, null]);

    // Reset the filters store
    setFilters("");
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Building filter string based on inputs
    let filterString = ``;
    if (orderId) {
      filterString += `incrementId:=${orderId}`;
    }
    if (productsnames) {
      filterString += `, productsNames:=${productsnames}`;
    }
    if (sku) {
      filterString += `, items.sku:=${sku}`;
    }
    if (clientFirstName) {
      filterString += `, customerFirstname:=${clientFirstName}`;
    }
    if (clientLastName) {
      filterString += `, customerLastname:=${clientLastName}`;
    }
    if (deliveryAgent) {
      filterString += `, deliveryAgentName:=${deliveryAgent}`;
    }
    if (dateRange[0] && dateRange[1]) {
      const date1 = new Date(dateRange[0]).getTime() / 1000 + 3600;
      const date2 = new Date(dateRange[1]).getTime() / 1000 + 3600;

      if (date1 === date2) filterString += `, deliveryDate:=${date1} `;
      else filterString += `, deliveryDate:>=${date1}, deliveryDate:<=${date2}`;
    }

    if (filterString.startsWith(",")) {
      filterString = filterString.slice(1);
    }
    setFilters(filterString);

    setDropdownVisible(false);
  };

  // Determine if there are filters applied
  const hasFilters =
    orderId ||
    clientFirstName ||
    clientLastName ||
    deliveryAgent ||
    productsnames ||
    sku ||
    dateRange[0] ||
    dateRange[1];

  return (
    <div className=" mx-auto flex-grow flex-wrap items-center justify-between gap-3 bg-n0 px-4">
      {/* Main Toolbar Content */}
      <div className="flex w-full items-center justify-between gap-4">
        {/* Order Status Text */}
        <p className=" text-xl font-bold capitalize">
          {`${status} Orders `}
          {!!ordersCount && <span>: {ordersCount}</span>}
          {isSomeOrdersSelected && (
            <MultipleOrdersActionsDropdown
              actions={actions}
              isPending={isPending}
              actionsRef={actionsRef}
            />
          )}
        </p>

        <div className="ml-auto flex items-center justify-center gap-4">
          {/* Search Bar */}
          <SearchBar ref={searchRef} onSearch={setSearch} isWithInstantSearch />

          {/* Sort Dropdown */}
          <SortByDropdown onSort={setSort} sortRef={sortRef} />

          {/* Filter Button */}
          <button
            onClick={handleDropdownToggle}
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            AdvFilter
          </button>

          {/* Reset Filters Button */}
          <button
            type="button"
            onClick={handleResetFilters}
            className={`rounded-md px-4 py-2 text-white ${
              hasFilters ? "bg-red-500" : "bg-gray-500"
            } transition-colors duration-300`}
            disabled={!hasFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Dropdown will be part of the flow and expand the page */}
      <div
        className={`w-full overflow-hidden bg-white transition-all duration-300 ease-in-out ${
          isDropdownVisible ? "h-auto" : "visibility-hidden h-0"
        } mt-8`}
        style={{
          visibility: isDropdownVisible ? "visible" : "hidden",
          height: isDropdownVisible ? "auto" : "0",
        }}
      >
        <form onSubmit={handleSubmitForm} className="w-full space-y-4">
          {/* First Row of Inputs */}
          <div className="flex flex-wrap gap-4">
            {/* Order ID */}
            <div className="min-w-[180px] flex-1">
              <label htmlFor="orderId" className="block text-sm font-medium">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Client First Name */}
            <div className="min-w-[180px] flex-1">
              <label
                htmlFor="clientFirstName"
                className="block text-sm font-medium"
              >
                Client First Name
              </label>
              <input
                id="clientFirstName"
                type="text"
                value={clientFirstName}
                onChange={(e) => setClientFirstName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Client Last Name */}
            <div className="min-w-[180px] flex-1">
              <label
                htmlFor="clientLastName"
                className="block text-sm font-medium"
              >
                Client Last Name
              </label>
              <input
                id="clientLastName"
                type="text"
                value={clientLastName}
                onChange={(e) => setClientLastName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Products Names */}
            <div className="min-w-[180px] flex-1">
              <label
                htmlFor="productsnames"
                className="block text-sm font-medium"
              >
                Product Name
              </label>
              <input
                id="productsnames"
                type="text"
                value={productsnames}
                onChange={(e) => setproductsnames(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Second Row of Inputs */}
          <div className="flex flex-wrap gap-4">
            {/* SKU */}
            <div className="min-w-[180px] flex-1">
              <label htmlFor="sku" className="block text-sm font-medium">
                SKU
              </label>
              <input
                id="sku"
                type="text"
                value={sku}
                onChange={(e) => setsku(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Delivery Agent */}
            <div className="min-w-[180px] flex-1">
              <label
                htmlFor="deliveryAgent"
                className="block text-sm font-medium"
              >
                Delivery Agent
              </label>
              <input
                id="deliveryAgent"
                type="text"
                value={deliveryAgent}
                onChange={(e) => setDeliveryAgent(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Delivery Date Range */}
            <div className="min-w-[180px] flex-1">
              <label
                htmlFor="deliveryDate"
                className="block text-sm font-medium"
              >
                Delivery Date Range
              </label>
              <DatePicker
                selected={dateRange[0]}
                onChange={(dates: [Date | null, Date | null]) =>
                  setDateRange(dates)
                }
                startDate={dateRange[0] || undefined}
                endDate={dateRange[1] || undefined}
                selectsRange
                isClearable
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholderText="Select date range"
                wrapperClassName="relative"
                calendarClassName="z-50"
              />
            </div>
            {/* Apply Filter Button */}
            <div>
              <button
                type="submit"
                className="mr-4 mt-6 rounded-md bg-green-500 px-2 py-1 text-white"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* OrderCancelingModal remains the same */}
      <OrderCancelingModal
        onConfirm={cancelMultipleOrders}
        isOpen={isCancelingModalOpen}
        isPending={isCancelingPending}
        onClose={onCancelingModalClose}
        message="Are you sure you want to cancel those orders?"
      />
    </div>
  );
};

export default OrdersToolBar;
