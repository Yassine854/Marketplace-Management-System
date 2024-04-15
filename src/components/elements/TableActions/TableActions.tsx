import { IconDotsVertical } from "@tabler/icons-react";
import useDropdown from "@/utils/useDropdown";

const TableActions = ({ fromBottom }: { fromBottom?: boolean }) => {
  const { open, ref, toggleOpen } = useDropdown();

  return (
    <>
      <div className="relative top-0 " ref={ref}>
        <IconDotsVertical onClick={toggleOpen} className="cursor-pointer" />
        <ul
          className={`${
            open
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-0 invisible"
          } absolute ${
            fromBottom ? "bottom-0" : "top-0"
          } ltr:right-5 rtl:left-5 border z-30 dark:border-n500 min-w-max p-1.5 rounded-md bg-n0 dark:bg-bg4`}
        >
          <li>
            <button className="py-1.5 hover:bg-primary rounded-md hover:text-n30 duration-300 block px-3">
              Edit
            </button>
          </li>
          <li>
            <button className="py-1.5 hover:bg-primary rounded-md hover:text-n30 duration-300 block px-3">
              Delete
            </button>
          </li>
          <li>
            <button className="py-1.5 hover:bg-primary rounded-md hover:text-n30 duration-300 block px-3">
              Block
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TableActions;
