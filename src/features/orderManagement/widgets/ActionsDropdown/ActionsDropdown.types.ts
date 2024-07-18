export type Item = {
  name: string;
  key: string;
  action: () => void;
};
export type Props = {
  items: Array<Item>;
  onSelectedChange?: (item: Item) => void;
};

export type DropRef = {
  reset: () => void;
  changeSelected: (selected: Item) => void;
};
