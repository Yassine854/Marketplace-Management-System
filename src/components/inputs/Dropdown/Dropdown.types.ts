export type Item = {
  name: string;
  key: string;
};

export type Props = {
  items: Item[];
  onSelectedChange?: (key: string) => void;
};
