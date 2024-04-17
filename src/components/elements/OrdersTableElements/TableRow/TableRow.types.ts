export type Props = {
  id: number;
  customer: string;
  total: number;
  deliveryDate: string;
  onClick: (id: number) => void;
};
