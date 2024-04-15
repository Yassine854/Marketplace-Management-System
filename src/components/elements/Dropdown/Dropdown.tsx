"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { Props } from "./Dropdown.types";
import { defaultProps } from "./Dropdown.defaultProps";
import useDropdown from "@/utils/useDropdown";

const Dropdown = ({ items, selected, setSelected, width, bg }: Props) => {
  const { open, ref, toggleOpen } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <div
        onClick={toggleOpen}
        className={`border text-xs select-none cursor-pointer border-n30 dark:border-n500 flex gap-2 justify-between items-center rounded-[30px] px-3 py-1.5 sm:px-4 sm:py-2  ${
          width ? width : "min-w-max sm:min-w-[140px]"
        } ${bg ? bg : "bg-primary/5 dark:bg-bg3 "}`}
      >
        {selected}{" "}
        <IconChevronDown
          size={20}
          className={`duration-300 ${open && "rotate-180"}`}
        />
      </div>
      <ul
        className={`absolute flex-col z-20 rounded-md ${
          width ? width : "min-w-max sm:min-w-[140px]"
        } top-full max-h-40 overflow-y-auto ltr:right-0 rtl:left-0 border duration-300 origin-top bg-n0 dark:bg-bg4 shadow-md border-n30 p-1 rounded-md dark:border-n500 ${
          open
            ? "opacity-100 scale-100 visible flex"
            : "opacity-0 scale-0 invisible"
        }`}
      >
        {items.map((item) => (
          <li
            onClick={() => {
              setSelected(item);
              toggleOpen();
            }}
            key={item}
            className={`px-4 py-2 text-xs cursor-pointer hover:text-primary rounded-md duration-300 ${
              selected == item && "bg-primary text-n0 hover:!text-n0"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
Dropdown.defaultProps = defaultProps;
export default Dropdown;
