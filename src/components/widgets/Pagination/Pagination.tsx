import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import ItemsPerPageSelector from "@/components/elements/TablesElements/ItemsPerPageSelector";
import { Props } from "./Pagination.types";
import cn from "@/utils/cn";
import { usePagination } from "./usePagination";

const Pagination = ({ totalOrders = 1000 }: any) => {
  const {
    startIndex,
    endIndex,
    totalPages,
    onItemsPerPageChanged,
    showedNumbers,
    currentPage,
    nextPage,
    prevPage,
    paginate,
    itemsPerPage,
  } = usePagination(totalOrders);

  return (
    <div className="  col-span-12 flex h-20 flex-wrap items-center justify-center gap-4 bg-n10  p-4 sm:justify-between">
      <ItemsPerPageSelector onChange={onItemsPerPageChanged} />
      {!!totalOrders && (
        <p>
          Showing {startIndex + 1} to {endIndex + 1} of {totalOrders} entries
        </p>
      )}

      <ul className="flex flex-wrap items-center gap-2 md:gap-3 md:font-semibold">
        <li>
          <button
            onClick={prevPage}
            disabled={currentPage == 1}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180",
            )}
          >
            <IconChevronLeft />
          </button>
        </li>
        {showedNumbers?.map((page, i) => (
          <li key={i}>
            <button
              onClick={() => paginate(page)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 md:h-10 md:w-10",
                {
                  "bg-primary text-n0": currentPage == page,
                },
              )}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={nextPage}
            disabled={currentPage == totalPages}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180",
            )}
          >
            <IconChevronRight />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
