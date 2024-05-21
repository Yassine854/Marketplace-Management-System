import { Item } from "./Dropdown.types";

export const defaultProps = {
  items: [
    { name: "Edit", key: "edit" },
    { name: "Delete", key: "edit" },
    { name: "Block", key: "block" },
  ],
  selected: { name: "Edit", key: "edit" },
  setSelected: (item: Item) => console.log(item),
  width: "10",
  bg: "red",
};
