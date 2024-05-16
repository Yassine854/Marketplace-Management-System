import { Props } from "./Pagination.types";

export const defaultProps: Props = {
  totalItems: 1000,
  onItemsPerPageChanged: () => {},
  onPageChanged: () => {},
};
