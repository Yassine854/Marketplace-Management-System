export type Props = {
  totalItems: number;
  onItemsPerPageChanged: (itemsPerPage: number) => void;
  onPageChanged: (page: number) => void;
  selectedStatus: string;
};
