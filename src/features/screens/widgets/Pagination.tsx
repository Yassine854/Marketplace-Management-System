import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-l-lg bg-gray-300 px-4 py-2"
      >
        Previous
      </button>
      <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-r-lg bg-gray-300 px-4 py-2"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
