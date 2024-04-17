import { ReactNode } from "react";

export type Props = {
  label?: string;
  img?: ReactNode;
  checked?: boolean;
  onChange?: () => void;
};
