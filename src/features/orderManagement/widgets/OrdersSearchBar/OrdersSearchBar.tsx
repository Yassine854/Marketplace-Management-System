"use client";

import { FocusEvent, useState } from "react";

import Dropdown from "@/features/shared/inputs/Dropdown";
import { IconSearch } from "@tabler/icons-react";

//import Location from "./Location";

const classes = ["class", "class 2", "class 3"];
const fromlocations = ["From", "New York", "London", "Paris", "Riyad", "Dubai"];
const tolocations = ["To", "Kabul", "Islamabad", "Dhaka", "Mumbai", "Bihar"];
const Hero = () => {
  const [selectedClass, setClass] = useState(classes[0]);
  const [from, setFrom] = useState(fromlocations[0]);
  const [to, setTo] = useState(tolocations[0]);

  const handleFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    try {
      e.currentTarget.showPicker();
    } catch (error) {}
  };
  return (
    <div className=")] relative col-span-12 flex h-full justify-center rounded-2xl bg-blue-500 bg-cover bg-no-repeat p-4 shadow-[0px_6px_30px_0px_rgba(0,0,0,0.06)] after:absolute after:inset-0 after:h-[95%] after:w-full after:rounded-2xl after:bg-no-repeat sm:p-6 md:p-10 xxl:p-[72px] xxl:pb-[139px] rtl:after:scale-x-[-1] ">
      <div className="relative z-[2]">
        <h1 className="h1 mb-10 max-w-[752px] text-black ">Orders Search</h1>

        <div className=" w-full rounded-2xl  bg-n0 p-3 dark:bg-bg4 sm:p-4 lg:px-6 lg:py-5 "></div>
      </div>
    </div>
  );
};

export default Hero;
