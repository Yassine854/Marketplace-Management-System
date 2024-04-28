"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { Props } from "./ItemsPerPageSelector.types";
import { tailwind } from "./ItemsPerPageSelector.styles";
import useDropdown from "@/hooks/useDropdown";
const options = [10, 25, 50];

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
      <ul className={tailwind.list(open)}>
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
