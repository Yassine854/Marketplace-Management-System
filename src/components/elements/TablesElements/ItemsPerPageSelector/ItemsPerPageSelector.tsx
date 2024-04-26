"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { Props } from "./ItemsPerPageSelector.types";
import { tailwind } from "./ItemsPerPageSelector.styles";
import useDropdown from "@/hooks/useDropdown";
const options = [10, 25, 100];

const ItemsPerPageSelector = ({ selected = 10, setSelected }: Props) => {
  const { open, ref, toggleOpen } = useDropdown();
  return (
    <div className={tailwind.container} ref={ref}>
      <div onClick={toggleOpen} className={tailwind.main}>
        {selected}
        <IconChevronDown
          size={20}
          className={`duration-300 ${open && "rotate-180"}`}
        />
      </div>
      <ul
        className={`
        lef-16  absolute bottom-0
        
        right-24
        z-40 max-h-40
       min-w-max origin-top
        
        flex-col overflow-y-auto rounded-md  border border-n30 bg-n0 p-1 shadow-md duration-300 dark:border-n500 dark:bg-bg4 sm:min-w-[140px] ltr:right-0 rtl:left-0 
        
        ${
          open
            ? "visible flex scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }

        
        `}
      >
        {options.map((item, i) => (
          <li
            onClick={() => {
              setSelected(item);
              toggleOpen();
            }}
            key={i}
            className={tailwind.listItem(selected, item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ItemsPerPageSelector;
