import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import Dropdown from "../../sharedElements/Dropdown";
import { Props } from "./Pagination.types";
import cn from "@/utils/cn";

const options = ["10", "25", "50", "100"];

const Pagination = ({
  totalPages,
  currentPage,
  goToPage,
  total,
  startIndex,
  endIndex,
  nextPage,
  prevPage,
  itemsPerPage,
  setItemsPerPage,
}: Props) => {
  let pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (currentPage < 5) {
    pages = pages.slice(0, 5);
  } else {
    pages = pages.slice(currentPage - 4, currentPage + 1);
  }

  return (
    <div className="sticky bottom-0 z-10 col-span-12 flex h-16 flex-wrap items-center justify-center gap-4 bg-n10 sm:justify-between">
      <Dropdown
        selected={itemsPerPage.toString()}
        setSelected={(item) => {
          setItemsPerPage(Number(item));
        }}
        items={options}
      />
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
