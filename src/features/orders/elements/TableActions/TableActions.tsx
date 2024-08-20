import { IconDotsVertical } from "@tabler/icons-react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { useOrdersStore } from "../../stores/ordersStore";

const TableActions = ({
  actionsList,
  orderId,
}: {
  actionsList: any;
  orderId: any;
}) => {
  const { open, ref, toggleOpen } = useDropdown();
  const { resetSelectedOrders } = useOrdersStore();
  return (
    <div
      className="relative top-0 rounded-full p-2 hover:bg-n10"
      ref={ref}
      onClick={(event) => {
        event.stopPropagation();
        resetSelectedOrders();
        toggleOpen();
      }}
    >
      <IconDotsVertical className="cursor-pointer" size={20} />
      <ul
        className={`${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        } absolute top-0 z-30 min-w-max rounded-md border bg-n0 p-2 dark:border-n500 dark:bg-bg4 ltr:right-5 rtl:left-5`}
      >
        <div className="mb-1 mt-1 border-t-2  border-dashed border-primary/20 text-xs font-semibold " />

        {actionsList?.map(({ action, name, key }: any, i: number) => {
          return (
            <li
              key={key}
              onClick={(event) => {
                event.stopPropagation();
                action(orderId);
                toggleOpen();
              }}
            >
              <button className="block w-full rounded-md px-3 py-1.5 font-bold duration-300 hover:bg-primary hover:text-n30">
                <p className="font-bold">{name}</p>
              </button>
              <div className="mb-1 mt-1 border-t-2  border-dashed border-primary/20 text-xs font-semibold " />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableActions;
