export type Props = {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  startIndex: number;
  endIndex: number;
  totalOrders: number;
  itemsPerPage: number;
  setItemsPerPage: (num: number) => void;
};
