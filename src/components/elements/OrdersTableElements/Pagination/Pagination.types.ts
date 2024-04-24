export type Props = {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  startIndex: number;
  endIndex: number;
  total: number;
  itemsPerPage: number;
  setItemsPerPage: (num: number) => void;
};
