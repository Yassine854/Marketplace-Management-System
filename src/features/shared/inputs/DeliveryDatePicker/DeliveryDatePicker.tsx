import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { IconCalendar } from "@tabler/icons-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

//To Refactor

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
};

const matcher = (day: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return day <= today;
};

const today = new Date();
const tomorrow = new Date(today);

//@ts-ignore
// eslint-disable-next-line react/display-name
const DeliveryDatePicker = forwardRef(
  ({ onChange, direction = "down", isReadOnly, defaultValue }: any, ref) => {
    const defaultDate = new Date(defaultValue * 1000);

    const { open, ref: dropDownRef, toggleOpen } = useDropdown();
    const [selected, setSelected] = useState(defaultDate || tomorrow);
    const [placeholder, setPlaceholder] = useState(formatDate(selected));

    const onSelect = (date: any) => {
      toggleOpen();
      setSelected(date);
      setPlaceholder(formatDate(date));
    };

    useEffect(() => {
      onChange && onChange(selected);
    }, [selected]);

    // useEffect(() => {
    //   console.log("🚀 ~ defaultValue:", defaultValue);

    //   const date = new Date(defaultValue * 1000);

    //   defaultValue && setSelected(date);
    // }, [defaultValue]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setSelected(tomorrow);
        setPlaceholder(formatDate(tomorrow));
      },
    }));

    return (
      <div ref={dropDownRef} className="relative  block w-[180px] ">
        <div
          onClick={() => {
            !isReadOnly && toggleOpen();
          }}
          className={` ${
            true
              ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
              : "bg-primary/5 dark:bg-bg3"
          } flex w-full cursor-pointer items-center justify-between gap-2 rounded-[30px] px-4 py-3 xxl:px-6`}
        >
          <span className="flex select-none items-center gap-2">
            {placeholder}
          </span>
          <div className="flex">
            <IconCalendar />
          </div>
        </div>
        <div
          className={` absolute bottom-full z-20 h-80  w-80  origin-top rounded-lg bg-n0  shadow-md duration-300 dark:bg-n800
                   
           ${
             open
               ? "visible scale-100 opacity-100"
               : "invisible scale-0 opacity-0"
           }
           ${direction === "up" && "bottom-full"}
           ${direction === "down" && "top-full"}
        
        `}
        >
          <DayPicker
            mode="single"
            disabled={matcher}
            selected={selected}
            onSelect={onSelect}
          />
        </div>
      </div>
    );
  },
);

export default DeliveryDatePicker;
