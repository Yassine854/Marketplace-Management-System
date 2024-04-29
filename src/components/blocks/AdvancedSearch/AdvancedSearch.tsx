"use client";

import { FocusEvent, useState } from "react";

import Dropdown from "@/components/elements/sharedElements/Dropdown";
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
    <div className="m-4 rounded-2xl bg-n0 p-3 dark:bg-bg4 sm:p-4 lg:px-6 lg:py-5">
      <form>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 accent-primary">
            <input
              type="radio"
              id="one-way"
              name="trip"
              className="scale-125"
              defaultChecked
            />
            <label className="cursor-pointer" htmlFor="one-way">
              One Way
            </label>
          </div>
          <div className="flex items-center gap-2 accent-primary">
            <input
              type="radio"
              id="round-trip"
              name="trip"
              className="scale-125"
            />
            <label className="cursor-pointer" htmlFor="round-trip">
              Round Trip
            </label>
          </div>
          <div className="flex items-center gap-2 accent-primary">
            <input
              type="radio"
              id="multi-city"
              name="trip"
              className="scale-125"
            />
            <label className="cursor-pointer" htmlFor="multi-city">
              Multi City
            </label>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 lg:grid-cols-9">
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            {/* <Location
                  setSelected={setFrom}
                  selected={from}
                  width="w-full"
                  items={fromlocations}
                /> */}
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            {/* <Location
                  width="w-full"
                  setSelected={setTo}
                  selected={to}
                  items={tolocations}
                /> */}
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <label
              htmlFor="date"
              className="flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n40 bg-primary/5 px-6 py-2.5 dark:border-n500 dark:bg-bg3"
            >
              <input
                type="date"
                onFocus={handleFocus}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </label>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <Dropdown
              setSelected={setClass}
              items={classes}
              selected={selectedClass}
              width="w-full !py-3"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-1">
            <button className="btn flex justify-center px-5 py-2.5 max-lg:px-16 max-[400px]:w-full lg:py-3">
              <IconSearch />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Hero;
