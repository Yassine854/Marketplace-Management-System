import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";

const placeholder = "Choose Action";

const Dropdown = ({ items, selectedAction, setSelectedAction }: any) => {
  const { open, ref: dropRef, toggleOpen } = useDropdown();

  const handleItemClick = (item: any) => {
    setSelectedAction(item);
    toggleOpen();
  };

  return (
    <div className="col-span-2 flex items-center justify-center md:col-span-1">
      <div className="relative rounded-3xl bg-n20" ref={dropRef}>
        <div onClick={toggleOpen} className={tailwind.container("", "")}>
          {selectedAction?.name || placeholder}
          <IconChevronDown
            size={20}
            className={`duration-300 ${open && "rotate-180"}`}
          />
        </div>
        <ul className={tailwind.list("", open)}>
          {items?.map((item: any, i: number) => (
            <li
              key={item.key}
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold duration-300   hover:bg-slate-600 hover:text-white ${
                selectedAction?.key === item.key &&
                "bg-primary text-n0 hover:!text-n0"
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;

const tailwind = {
  container(width: string, bg: string): string {
    return ` font-semibold flex cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n30 px-3 py-1.5 text-xs dark:border-n500 sm:px-4 sm:py-2 
    min-w-48
    

    `;
  },
  list(width: string, open: boolean): string {
    return `absolute z-20 flex-col rounded-md ${
      width ? width : "min-w-max sm:min-w-[140px]"
    } top-full max-h-72 origin-top overflow-y-auto rounded-md border border-n30 bg-n0 p-1 shadow-md duration-300 dark:border-n500 dark:bg-bg4 ltr:right-0 rtl:left-0 ${
      open
        ? "visible flex scale-100 opacity-100"
        : "invisible scale-0 opacity-0"
    }`;
  },
};
