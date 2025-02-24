// components/Pagination.tsx
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Gestion des ellipsis
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    if (start > 1) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push("...");

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      {/* Bouton Précédent */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-gray-200 p-2 transition-colors hover:bg-gray-50 disabled:opacity-30"
        aria-label="Page précédente"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
      </button>

      {/* Numéros de page */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all
                ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          ) : (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          ),
        )}
      </div>

      {/* Bouton Suivant */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-lg border border-gray-200 p-2 transition-colors hover:bg-gray-50 disabled:opacity-30"
        aria-label="Page suivante"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-600" />
      </button>

      {/* Affichage de la position */}
      <div className="ml-4 hidden text-sm text-gray-500 sm:block">
        Page <span className="font-semibold">{currentPage}</span> / {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
