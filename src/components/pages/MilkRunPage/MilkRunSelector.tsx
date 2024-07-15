import { forwardRef, useImperativeHandle, useState } from "react";

import { useDropdown } from "@/hooks/useDropdown";
import { IconChevronDown } from "@tabler/icons-react";

export const layoutList = ["All", "Tunis", "Sousse", "Kamarket"];

const options = ["Morning", "Afternoon"];

//@ts-ignore
// eslint-disable-next-line react/display-name
const MilkRunSelector = forwardRef(({ onChange }: any, ref) => {
  const { open, ref: dropDownRef, toggleOpen } = useDropdown();

  const [layout, setLayout] = useState("Select Milk Run");

  useImperativeHandle(ref, () => ({
    reset: () => {
      onChange("");
      setLayout("Select Milk Run");
    },
  }));

  return (
    <div
      ref={dropDownRef}
      className="relative hidden min-w-[250px] lg:block xxl:min-w-[272px]"
    >
      <div
        onClick={toggleOpen}
        className={` ${
          true
            ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
            : "bg-primary/5 dark:bg-bg3"
        } flex w-full cursor-pointer items-center justify-between gap-2 rounded-[30px] px-4 py-3 xxl:px-6`}
      >
        <span className="flex select-none items-center gap-2">{layout}</span>
        <IconChevronDown
          className={`shrink-0 ${open && "rotate-180"} duration-300`}
        />
      </div>
      <ul
        className={`absolute bottom-full left-0 z-20 w-full origin-top rounded-lg bg-n0 p-2 shadow-md duration-300 dark:bg-n800 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        }`}
      >
        {options?.map((option: any) => (
          <li
            onClick={() => {
              setLayout(option);
              toggleOpen();
            }}
            className={`block cursor-pointer select-none rounded-md p-2 duration-300 hover:bg-slate-200 hover:text-primary ${
              layout == option ? "bg-primary text-n0 hover:!text-n0" : ""
            }`}
            key={option}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default MilkRunSelector;
