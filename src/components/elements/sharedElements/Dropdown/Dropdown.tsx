"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { Props } from "./Dropdown.types";
import { defaultProps } from "./Dropdown.defaultProps";
import { tailwind } from "./Dropdown.styles";
import useDropdown from "./useDropdown";

const Dropdown = ({
  items = defaultProps.items,
  selected = defaultProps.selected,
  setSelected = defaultProps.setSelected,
  width = defaultProps.width,
  bg = defaultProps.bg,
}: Props) => {
  const { open, ref, toggleOpen } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <div onClick={toggleOpen} className={tailwind.container(width, bg)}>
        {selected.name}
        <IconChevronDown
          size={20}
          className={`duration-300 ${open && "rotate-180"}`}
        />
      </div>
      <ul className={tailwind.list(width, open)}>
        {items.map(({ name, key }: any, i: number) => (
          <li
            onClick={() => {
              setSelected(items[i]);
              toggleOpen();
            }}
            key={key}
            className={`cursor-pointer rounded-md px-4 py-2 text-xs duration-300 hover:text-primary ${
              selected.key == key && "bg-primary text-n0 hover:!text-n0"
            }`}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Dropdown;
