export type Item = {
  name: string;
  key: string;
};

export type Props = {
  items: Item[];
  selected?: Item;
  setSelected: (item: Item) => void;
  width?: string;
  bg?: string;
};
