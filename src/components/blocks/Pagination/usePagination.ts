import { useEffect, useState } from "react";

export const usePagination = (totalItems: any) => {
  //   let pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  //   if (currentPage < 5) {
  //     pages = pages.slice(0, 5);
  //   } else {
  //     pages = pages.slice(currentPage - 4, currentPage + 1);
  //   }

  const [showedNumbers, setShowedNumbers] = useState<number[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const onItemsPerPageChanged = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
  };
  const paginate = (page: any) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    let showedNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
    if (currentPage < 5) {
      setShowedNumbers(showedNumbers.slice(0, 5));
    } else {
      setShowedNumbers(showedNumbers.slice(currentPage - 4, currentPage + 1));
    }
  }, [currentPage, totalPages]);

  return {
    startIndex,
    endIndex,
    totalPages,
    itemsPerPage,
    onItemsPerPageChanged,
    showedNumbers,
    paginate,
    prevPage,
    nextPage,
    currentPage,
  };
};
