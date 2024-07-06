export type Item = {
  name: string;
  key: string;
};

// export type Props = {
//   items: Item[];
//   onSelectedChange?: (key: string) => void;
//   label?: string;
// };

export type Props = {
  items: Array<{ name: string; key: string }>;
  onSelectedChange?: (key: string) => void;
  placeholder?: string; // Add placeholder prop
};
