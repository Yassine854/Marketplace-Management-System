export type Item = {
  name: string;
  key: string;
};

export type Props = {
  items: Array<Item>;
  onSelectedChange?: (item: Item) => void;
};

export type DropRef = {
  reset: () => void;
  changeSelected: (selected: Item) => void;
};
