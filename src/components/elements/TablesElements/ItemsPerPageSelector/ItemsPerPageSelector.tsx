import { useEffect, useState } from "react";

import { IconChevronDown } from "@tabler/icons-react";
import { Props } from "./ItemsPerPageSelector.types";
import { tailwind } from "./ItemsPerPageSelector.styles";
import useDropdown from "./useDropdown";

const options = [10, 25, 50];

const ItemsPerPageSelector = ({
  onChange = (number: number) => console.log("Items Per Page", number),
}: any) => {
  const { open, ref, toggleOpen } = useDropdown();
  const [selected, setSelected] = useState(10);

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);
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
