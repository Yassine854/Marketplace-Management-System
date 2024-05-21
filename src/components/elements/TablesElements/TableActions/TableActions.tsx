import { IconDotsVertical } from "@tabler/icons-react";
import useDropdown from "@/hooks/useDropdown";

const TableActions = ({
  fromBottom,
  actions,
  orderId,
}: {
  fromBottom?: boolean;
  actions: any;
  orderId: any;
}) => {
  const { open, ref, toggleOpen } = useDropdown();

  return (
    <div
      onClick={(event: any) => {
        event.stopPropagation();
        toggleOpen();
      }}
      className="relative top-0 z-0 rounded-full p-2 hover:bg-n10 "
      ref={ref}
    >
      <IconDotsVertical className="cursor-pointer" />
      <ul
        className={`${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        } absolute ${
          fromBottom ? "bottom-0" : "top-0"
        } z-30 min-w-max rounded-md border bg-n0 p-1.5 dark:border-n500 dark:bg-bg4 ltr:right-5 rtl:left-5`}
      >
        {actions?.map((e: any, i: number) => {
          return (
            <li
              key={i}
              onClick={() => {
                e.action(orderId);
              }}
            >
              <button className="block rounded-md px-3 py-1.5 duration-300 hover:bg-primary hover:text-n30">
                {e.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableActions;
