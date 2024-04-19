import { Props } from "./Pagination.types";

export const defaultProps: Props = {
  totalPages: 5,
  currentPage: 1,
  goToPage: (page: number) => {},
  nextPage: () => {},
  prevPage: () => {},
  startIndex: 1,
  endIndex: 50,
  total: 10,
  itemsPerPage: 10,
  setItemsPerPage: () => {},
};
