import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { IconChevronDown } from "@tabler/icons-react";
import { Props } from "./Dropdown.types";
import { defaultProps } from "./Dropdown.defaultProps";
import { tailwind } from "./Dropdown.styles";
import useDropdown from "./useDropdown";

export type DropRef = {
  reset: () => void;
  changeSelected: (selected: string) => void;
};

// eslint-disable-next-line react/display-name
const Dropdown = forwardRef<DropRef, Props>(
  ({ items = defaultProps.items, onSelectedChange, label }, ref) => {
    // ({ items = defaultProps.items, onSelectedChange }: Props) => {
    const { open, ref: dropRef, toggleOpen } = useDropdown();
    const [selected, setSelected] = useState(items[0]);

    const reset = () => {
      setSelected(items[0]);
    };

    useEffect(() => {
      if (selected && onSelectedChange) {
        onSelectedChange(selected.key);
      }
    }, [selected, onSelectedChange]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        reset();
      },
      changeSelected: (selected: any) => {
        setSelected(selected);
      },
    }));

    return (
      <div className="col-span-2 flex items-center justify-center md:col-span-1">
        <label
          htmlFor="role"
          className="mb-2 ml-2 block font-medium md:text-lg"
        >
          {label}
        </label>

        <div className="relative  rounded-3xl bg-n20" ref={dropRef}>
          <div onClick={toggleOpen} className={tailwind.container("", "")}>
            {selected?.name}
            <IconChevronDown
              size={20}
              className={`duration-300 ${open && "rotate-180"}`}
            />
          </div>
          <ul className={tailwind.list("", open)}>
            {items.map(({ name, key }: any, i: number) => (
              <li
                onClick={() => {
                  setSelected(items[i]);
                  toggleOpen();
                }}
                key={key}
                className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold duration-300 hover:text-primary ${
                  selected?.key == key && "bg-primary text-n0 hover:!text-n0"
                }`}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);

export default Dropdown;
