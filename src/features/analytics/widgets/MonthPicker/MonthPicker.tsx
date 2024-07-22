import { IconCalendar } from "@tabler/icons-react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { useEffect, useState } from "react";

const Month = ({ name, onClick, selectedMonth }: any) => (
  <div
    onClick={onClick}
    className={`btn m-2 flex h-12 w-20 cursor-pointer items-center justify-center rounded-xl bg-blue-700 p-2
      ${selectedMonth.name === name && `bg-emerald-700`}
      
      `}
  >
    <p className=" text-sm font-bold">{name}</p>
  </div>
);

const months = [
  { name: "January", key: "01" },
  { name: "February", key: "02" },
  { name: "March", key: "03" },
  { name: "April", key: "04" },
  { name: "May", key: "05" },
  { name: "June", key: "06" },
  { name: "July", key: "07" },
  { name: "August", key: "08" },
  { name: "September", key: "09" },
  { name: "October", key: "10" },
  { name: "November", key: "11" },
  { name: "December", key: "12" },
];

const MonthPicker = ({ direction = "down", onMonthChange }: any) => {
  const { open, ref: dropDownRef, toggleOpen } = useDropdown();

  const [selectedMonth, setSelectedMonth] = useState(months[0]);

  useEffect(() => {
    toggleOpen();

    onMonthChange && onMonthChange(selectedMonth);
  }, [selectedMonth, onMonthChange]);

  return (
    <div ref={dropDownRef} className="relative  block w-[180px] ">
      <div
        onClick={() => {
          toggleOpen();
        }}
        className="flex w-full cursor-pointer items-center justify-between gap-2
           rounded-[30px] border border-n30 bg-n0 px-4 py-3 dark:border-n500
            dark:bg-bg4 xxl:px-6"
      >
        <span className="flex select-none items-center gap-2">
          {selectedMonth.name}
        </span>
        <div className="flex">
          <IconCalendar />
        </div>
      </div>
      <div
        className={` 
           absolute right-5 z-20 h-80  w-80  origin-top
           rounded-lg bg-n0  shadow-md duration-300 dark:bg-n800
                  
           ${direction === "up" && "bottom-full"}
           ${direction === "down" && "top-full"}
           ${
             open
               ? "visible scale-100 opacity-100"
               : "invisible scale-0 opacity-0"
           }`}
      >
        <div className="flex h-8 w-full items-center justify-center bg-n30 text-xl font-bold">
          2024
        </div>
        <div className="flex h-full w-full flex-grow flex-wrap items-center justify-center bg-n10 ">
          {months.map((month: any) => (
            <Month
              key={month.key}
              name={month.name}
              selectedMonth={selectedMonth}
              onClick={() => setSelectedMonth(month)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthPicker;
