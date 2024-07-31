import { IconCalendar } from "@tabler/icons-react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { useEffect, useState } from "react";

const Year = ({ year, onClick, selectedYear }: any) => (
  <div
    onClick={onClick}
    className={`m-1 flex h-12 w-20 cursor-pointer items-center justify-center rounded-md
      ${
        selectedYear === year
          ? "bg-blue-950 text-white"
          : "border-none bg-slate-50 text-blue-950"
      } 
      transition duration-150 hover:bg-gray-200`}
  >
    <p className="text-sm">{year}</p>
  </div>
);

const years = Array.from(
  { length: new Date().getFullYear() - 2019 },
  (_, index) => 2020 + index,
);

const YearPicker = ({ direction = "down", onYearChange }: any) => {
  const { open, ref: dropDownRef, toggleOpen } = useDropdown();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    toggleOpen();

    if (onYearChange) {
      onYearChange(selectedYear);
    }
  }, [selectedYear, onYearChange]);

  return (
    <div ref={dropDownRef} className="relative block w-[200px]">
      <div
        onClick={() => toggleOpen()}
        className="border-50 flex w-full cursor-pointer items-center justify-between
          gap-2 rounded-[30px] border bg-slate-100 px-4 py-3 dark:border-n500
            dark:bg-bg4 xxl:px-6"
      >
        <span className="flex select-none items-center gap-2">
          {selectedYear}
        </span>
        <div className="flex">
          <IconCalendar />
        </div>
      </div>
      <div
        className={` 
          absolute right-5 z-20 h-80 w-80 origin-top
          rounded-lg bg-white duration-300 
                  
          ${direction === "up" && "bottom-full"}
          ${direction === "down" && "top-full"}
          ${
            open
              ? "visible scale-100 opacity-100"
              : "invisible scale-0 opacity-0"
          }`}
      >
        <div className="flex h-full w-full flex-grow flex-wrap items-center justify-center bg-n10">
          {years.map((year: number) => (
            <Year
              key={year}
              year={year}
              selectedYear={selectedYear}
              onClick={() => setSelectedYear(year)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearPicker;
