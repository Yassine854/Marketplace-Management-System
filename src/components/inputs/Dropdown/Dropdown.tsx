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
  (
    {
      items = defaultProps.items,
      onSelectedChange,
      placeholder = "Choose Action",
    },
    ref,
  ) => {
    const { open, ref: dropRef, toggleOpen } = useDropdown();
    const [selected, setSelected] = useState<{
      name: string;
      key: string;
    } | null>(null);

    const reset = () => {
      setSelected(null);
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
        <div className="relative rounded-3xl bg-n20" ref={dropRef}>
          <div onClick={toggleOpen} className={tailwind.container("", "")}>
            {selected?.name || placeholder}{" "}
            {/* Show placeholder if nothing is selected */}
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
                  selected?.key === key && "bg-primary text-n0 hover:!text-n0"
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
