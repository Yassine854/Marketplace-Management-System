import { useEffect, useState } from "react";
import { IconSelector } from "@tabler/icons-react";
import OrdersTableHeadCell from "../OrdersTableHeadCell";
import { useOrdersStore } from "../../stores/ordersStore";
import { useOrdersTableHead } from "@/features/orders/hooks";
import OrdersTableHeadSmallCell from "../OrdersTableHeadSmallCell";

const OrdersTableHead = ({
  changeSelectedSort,
  onSelectAllClick,
  isAllOrdersSelected,
}: any) => {
  const { onCustomerClick, onDeliveryDateClick, onTotalClick } =
    useOrdersTableHead(changeSelectedSort);
  const { selectedOrders } = useOrdersStore();
  return (
    <tr>
      <OrdersTableHeadSmallCell>
        <div className="relative px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          {!!selectedOrders.length && (
            <div className="absolute right-0">{selectedOrders.length}</div>
          )}

          <Checkbox
            onClick={onSelectAllClick}
            isChecked={isAllOrdersSelected}
          />
        </div>
      </OrdersTableHeadSmallCell>
      <OrdersTableHeadCell>ID</OrdersTableHeadCell>
      <OrdersTableHeadCell onClick={onCustomerClick}>
        Customer <IconSelector size={18} />
      </OrdersTableHeadCell>
      <OrdersTableHeadCell onClick={onTotalClick}>
        Total
        <IconSelector size={18} />
      </OrdersTableHeadCell>
      <OrdersTableHeadCell onClick={onDeliveryDateClick}>
        Delivery Date <IconSelector size={18} />
      </OrdersTableHeadCell>
      <OrdersTableHeadCell>Delivery Agent</OrdersTableHeadCell>
      <OrdersTableHeadCell>Delivery Status</OrdersTableHeadCell>
      <OrdersTableHeadSmallCell>Summary</OrdersTableHeadSmallCell>
      <OrdersTableHeadSmallCell>Actions</OrdersTableHeadSmallCell>
    </tr>
  );
};

export default OrdersTableHead;

const Checkbox = ({ checkboxRef, isChecked = false, onClick }: any) => {
  const [checked, setChecked] = useState(isChecked);

  const { selectedOrders } = useOrdersStore();
  useEffect(() => {
    if (!selectedOrders.length) {
      setChecked(false);
    }
  }, [selectedOrders]);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);
  return (
    <div
      ref={checkboxRef}
      className="flex h-5 w-5 items-center justify-center rounded-full   hover:bg-n70"
      onClick={(event: any) => {
        //  event.stopPropagation();
        onClick(!checked);
      }}
    >
      <input
        type="checkbox"
        // defaultChecked={checked}
        onChange={() => {
          setChecked((e: boolean) => !e);
        }}
        //className="h-3 w-3 cursor-pointer appearance-none rounded-full border-2 border-gray-400 transition-colors checked:border-blue-500 checked:bg-blue-500 hover:border-blue-600 hover:bg-blue-200"
        className="absolute   flex  h-3 w-3 cursor-pointer items-center justify-center  rounded-full border-2 border-gray-400 opacity-0 transition-colors checked:border-blue-500 checked:bg-blue-500 hover:border-blue-600 hover:bg-blue-200"
        checked={checked}
      />
      <div className=" flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-n0 focus-within:border-primary dark:bg-bg4 ">
        <svg
          className="pointer-events-none hidden h-[8px] w-[8px] fill-current text-primary"
          version="1.1"
          viewBox="0 0 17 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(-9 -11)" fill="#363AED" fillRule="nonzero">
              <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
