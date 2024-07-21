import useDropdown from "./useDropdown";
import { useEffect, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { tailwind } from "./ItemsPerPageSelector.styles";
import { useOrdersStore } from "../../stores/ordersStore";
import { useOrdersTableStore } from "../../stores/ordersTableStore";

const options = [10, 25, 50];

const ItemsPerPageSelector = () => {
  const { status } = useOrdersStore();

  const [selected, setSelected] = useState(10);

  const { open, ref, toggleOpen } = useDropdown();

  const { setItemsPerPage } = useOrdersTableStore();

  useEffect(() => {
    setSelected(10);
  }, [status]);

  useEffect(() => {
    setItemsPerPage(selected);
  }, [selected, setItemsPerPage]);

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
