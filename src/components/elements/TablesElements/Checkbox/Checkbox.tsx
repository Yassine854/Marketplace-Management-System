"use client";

import { useEffect, useState } from "react";

import { Props } from "./Checkbox.types";

const Checkbox = ({ label, img, isChecked = false, onClick }: any) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full  pl-2 hover:bg-n70"
      onClick={() => {
        onClick(!checked);
      }}
    >
      <input
        type="checkbox"
        id={label}
        name="A3-confirmation"
        value={label}
        defaultChecked={checked}
        onChange={() => {
          setChecked((e: boolean) => !e);
        }}
        className="absolute  h-8 w-8 cursor-pointer bg-blue-500 opacity-0"
        checked={checked}
      />
      <div className=" flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-n0 focus-within:border-primary dark:bg-bg4 ltr:mr-2 rtl:ml-2">
        <svg
          className="pointer-events-none hidden h-[10px] w-[10px] fill-current text-primary"
          version="1.1"
          viewBox="0 0 17 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(-9 -11)" fill="#363AED" fillRule="nonzero">
              <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Checkbox;
