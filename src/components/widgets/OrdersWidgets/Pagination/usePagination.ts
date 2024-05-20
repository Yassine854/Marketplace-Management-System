import { useEffect, useState } from "react";

export const usePagination = (
  totalItems: number,
  onItemsPerPageChanged: any,
  onPageChanged: any,
  selectedStatus: string,
) => {
  const [showedNumbers, setShowedNumbers] = useState<number[]>([]);
  const [showedNumbersHolder, setShowedNumbersHolder] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const reset = () => {
    setShowedNumbers([]);
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const onItemsPerPageChange = (itemsPerPage: number) => {
    // Ensure itemsPerPage is a positive integer
    if (itemsPerPage > 0 && Number.isInteger(itemsPerPage)) {
      setItemsPerPage(itemsPerPage);
    }
  };

  const paginate = (page: number) => {
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

  // // Update showedNumbers when currentPage or totalPages change
  useEffect(() => {
    let showedNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
    if (currentPage <= 5) {
      setShowedNumbers(showedNumbers.slice(0, Math.min(5, totalPages)));
    } else {
      setShowedNumbers(showedNumbers.slice(currentPage - 5, currentPage));
    }
  }, [currentPage, totalPages]);

  // Reset currentPage to 1 when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, onItemsPerPageChanged]);

  // Trigger callback when currentPage changes
  useEffect(() => {
    onPageChanged && onPageChanged(currentPage);
  }, [currentPage, onPageChanged]);

  // Trigger callback when itemsPerPage changes
  useEffect(() => {
    onItemsPerPageChanged && onItemsPerPageChanged(itemsPerPage);
  }, [itemsPerPage, onItemsPerPageChanged]);

  useEffect(() => {
    if (showedNumbers.length) {
      setShowedNumbersHolder(showedNumbers);
    }
  }, [showedNumbers, setShowedNumbersHolder]);

  useEffect(() => {
    reset();
  }, [selectedStatus]);

  return {
    startIndex,
    endIndex,
    totalPages,
    onItemsPerPageChange,
    showedNumbers,
    showedNumbersHolder,
    paginate,
    prevPage,
    nextPage,
    currentPage,
  };
};
