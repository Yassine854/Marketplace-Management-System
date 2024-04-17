import LayoutTemplate from "@/components/templates/LayoutTemplate";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return <LayoutTemplate>{children}</LayoutTemplate>;
};

export default Layout;
