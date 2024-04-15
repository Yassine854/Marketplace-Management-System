import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { Props } from "./Pagination.types";
import cn from "@/utils/cn";
import { defaultProps } from "./Pagination.defaultProps";

const Pagination = ({
  totalPages,
  currentPage,
  goToPage,
  total,
  startIndex,
  endIndex,
  nextPage,
  prevPage,
}: Props) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="flex col-span-12 gap-4 sm:justify-between justify-center items-center flex-wrap">
      <p>
        Showing {startIndex + 1} to {endIndex + 1} of {total} entries
      </p>

      <ul className="flex gap-2 md:gap-3 flex-wrap md:font-semibold items-center">
        <li>
          <button
            onClick={prevPage}
            disabled={currentPage == 1}
            className={cn(
              "hover:bg-primary disabled:hover:bg-transparent disabled:hover:text-primary text-primary rtl:rotate-180 disabled:cursor-not-allowed hover:text-n0 border md:w-10 duration-300 md:h-10 w-8 h-8 flex items-center rounded-full justify-center border-primary"
            )}
          >
            <IconChevronLeft />
          </button>
        </li>
        {pages.map((page, i) => (
          <li key={i}>
            <button
              onClick={() => goToPage(page)}
              className={cn(
                "hover:bg-primary text-primary hover:text-n0 border md:w-10 duration-300 md:h-10 w-8 h-8 flex items-center rounded-full justify-center border-primary",
                {
                  "bg-primary text-n0": currentPage == page,
                }
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
              "hover:bg-primary disabled:hover:bg-transparent disabled:hover:text-primary rtl:rotate-180 text-primary disabled:cursor-not-allowed hover:text-n0 border md:w-10 duration-300 md:h-10 w-8 h-8 flex items-center rounded-full justify-center border-primary"
            )}
          >
            <IconChevronRight />
          </button>
        </li>
      </ul>
    </div>
  );
};

Pagination.defaultProps = defaultProps;
export default Pagination;
