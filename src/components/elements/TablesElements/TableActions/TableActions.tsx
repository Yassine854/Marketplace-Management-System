import { IconDotsVertical } from "@tabler/icons-react";
import { useDropdown } from "@/hooks/useDropdown";

const TableActions = ({
  actionsList,
  orderId,
}: {
  actionsList: any;
  orderId: any;
}) => {
  const { open, ref, toggleOpen } = useDropdown();

  return (
    <div
      className="relative top-0 rounded-full p-2 hover:bg-n10"
      ref={ref}
      onClick={(event) => {
        event.stopPropagation();

        toggleOpen();
      }}
    >
      <IconDotsVertical className="cursor-pointer" size={20} />

      <ul
        className={`${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        } absolute top-0 z-30 min-w-max rounded-md border bg-n0 p-1.5 dark:border-n500 dark:bg-bg4 ltr:right-5 rtl:left-5`}
      >
        {actionsList?.map(({ action, name }: any, i: number) => {
          return (
            <li
              key={i}
              onClick={(event) => {
                event.stopPropagation();
                action(orderId);
              }}
            >
              <button className="block w-full rounded-md px-3 py-1.5 duration-300 hover:bg-primary hover:text-n30">
                {name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableActions;
