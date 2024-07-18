export type Item = {
  name: string;
  key: string;
};

export type Props = {
  items: Array<Item>;
  onSelectedChange?: (key: string) => void;
};

export type DropRef = {
  reset: () => void;
  // changeSelected: (key: string) => void;
};
