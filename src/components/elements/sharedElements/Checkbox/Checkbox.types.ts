import { ReactNode } from "react";

export type Props = {
  label?: string;
  img?: ReactNode;
  isChecked?: boolean;
  onClick: (isChecked: boolean) => void;
};
