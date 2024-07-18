import useDropdown from "./useDropdown";
import { tailwind } from "./Dropdown.styles";
import { IconChevronDown } from "@tabler/icons-react";
import { Props, Item, DropRef } from "./Dropdown.types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

// eslint-disable-next-line react/display-name
const Dropdown = forwardRef<DropRef, Props>(
  ({ items = [], onSelectedChange }, ref) => {
    const { open, ref: dropRef, toggleOpen } = useDropdown();
    const [selected, setSelected] = useState<Item>(items[0]);

    const reset = () => {
      setSelected(items[0]);
    };

    useEffect(() => {
      if (selected && onSelectedChange) {
        onSelectedChange(selected.key);
      }
    }, [selected, onSelectedChange]);

    useImperativeHandle(ref, () => ({
      reset,
      // changeSelected: (selected: Item): void => {
      //   setSelected(selected);
      // },
    }));

    return (
      <div className="col-span-2 flex items-center justify-center md:col-span-1">
        <div className="relative rounded-3xl bg-n20" ref={dropRef}>
          <div onClick={toggleOpen} className={tailwind.container("", "")}>
            {selected?.name}
            <IconChevronDown
              size={20}
              className={`duration-300 ${open ? "rotate-180" : ""}`}
            />
          </div>
          <ul className={tailwind.list("", open)}>
            {items.map(
              ({ name, key }: { name: string; key: string }, i: number) => (
                <li
                  onClick={() => {
                    setSelected(items[i]);
                    toggleOpen();
                  }}
                  key={key}
                  className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold duration-300 hover:bg-slate-400 hover:text-primary ${
                    selected?.key === key
                      ? "bg-primary text-n0 hover:!text-n0"
                      : ""
                  }`}
                >
                  {name}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    );
  },
);

export default Dropdown;
