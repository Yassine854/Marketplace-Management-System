import cn from "@/utils/cn";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
type paginationProps = {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  startIndex: number;
  endIndex: number;
  total: number;
};
const Pagination = ({
  totalPages,
  currentPage,
  goToPage,
  total,
  startIndex,
  endIndex,
  nextPage,
  prevPage,
}: paginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="col-span-12 flex flex-wrap items-center justify-center gap-4 sm:justify-between">
      <p>
        Showing {startIndex + 1} to {endIndex + 1} of {total} entries
      </p>

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
        {pages.map((page, i) => (
          <li key={i}>
            <button
              onClick={() => goToPage(page)}
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
