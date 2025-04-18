import useDropdown from "./useDropdown";
import { useEffect, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { tailwind } from "./ItemsPerPageSelector.styles";
import { useOrdersStore } from "../../stores/ordersStore";
import { useOrdersTableStore } from "../../stores/ordersTableStore";

const options = [25, 50, 100];

const ItemsPerPageSelector = () => {
  const { status } = useOrdersStore();

  const [selected, setSelected] = useState(25);

  const { open, ref, toggleOpen } = useDropdown();

  // const { setItemsPerPage } = useOrdersTableStore();
  const { itemsPerPage, setItemsPerPage } = useOrdersTableStore();
  const { setCurrentPage } = useOrdersTableStore();
  const handleSelect = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1); // 👈 Reset à la première page quand on change le nombre d'items
  };

  useEffect(() => {
    setSelected(25);
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
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid #ccc",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background-color 0.3s, color 0.3s",
          }}
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
