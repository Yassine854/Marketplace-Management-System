"use client";

import { FocusEvent, useState } from "react";

import Dropdown from "@/components/elements/sharedElements/Dropdown";
import { IconSearch } from "@tabler/icons-react";

//import Location from "./Location";

const classes = ["class", "class 2", "class 3"];
const fromlocations = ["From", "New York", "London", "Paris", "Riyad", "Dubai"];
const tolocations = ["To", "Kabul", "Islamabad", "Dhaka", "Mumbai", "Bihar"];
const Hero = ({ onSearch, status }: any) => {
  const [selectedClass, setClass] = useState(classes[0]);
  const [from, setFrom] = useState(fromlocations[0]);
  const [to, setTo] = useState(tolocations[0]);

  const handleFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    try {
      e.currentTarget.showPicker();
    } catch (error) {}
  };
  return (
    <div className="m-4 flex h-48 w-[60%] flex-col rounded-2xl bg-n30 p-3 dark:bg-bg4 sm:p-4 lg:px-6 lg:py-5">
      <p className="mb-4 text-2xl font-bold">{status} Orders </p>
      <div className="flex flex-grow items-center justify-center ">
        <div className=" flex  w-[40%] flex-wrap items-center justify-center gap-4 ">
          <div className="flex items-center gap-2 accent-primary">
            <p className="text-xl font-bold">Order By :</p>
            <input
              type="radio"
              id="one-way"
              name="trip"
              className="scale-125"
              defaultChecked
            />
            <label className="cursor-pointer" htmlFor="one-way">
              Earliest
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
              Latest
            </label>
          </div>
        </div>
        <form>
          <div className=" flex  flex-grow  justify-between ">
            <div className="col-span-12  m-4 sm:col-span-6 lg:col-span-2">
              <label
                htmlFor="date"
                className="flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n40 bg-primary/5 px-6 py-2.5 dark:border-n500 dark:bg-bg3"
              >
                <p className="text-xl font-bold">From</p>
                <input
                  type="date"
                  onFocus={handleFocus}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </label>
            </div>
            <div className="col-span-12 m-4 sm:col-span-6 lg:col-span-2">
              <label
                htmlFor="date"
                className="flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n40 bg-primary/5 px-6 py-2.5 dark:border-n500 dark:bg-bg3"
              >
                <p className="text-xl font-bold">To</p>
                <input
                  type="date"
                  onFocus={handleFocus}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </label>
            </div>

            <div className="col-span-12 m-4 sm:col-span-6 lg:col-span-1">
              <button
                className="btn flex w-36 justify-center px-5 py-2.5 max-lg:px-16 max-[400px]:w-full lg:py-3"
                onClick={() => onSearch()}
              >
                <IconSearch />
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* 
      <div className="col-span-12 sm:col-span-6 lg:col-span-1">
        <div className="mb-6 flex  flex-wrap items-center gap-4 ">
          <div className="flex items-center gap-2 accent-primary">
            <p className="text-xl font-bold">Order By :</p>
            <input
              type="radio"
              id="one-way"
              name="trip"
              className="scale-125"
              defaultChecked
            />
            <label className="cursor-pointer" htmlFor="one-way">
              Earliest
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
              Latest
            </label>
          </div>
        </div>
      </div>
      <form>
        <div className="grid grid-cols-12 gap-4 lg:grid-cols-9">
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <label
              htmlFor="date"
              className="flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n40 bg-primary/5 px-6 py-2.5 dark:border-n500 dark:bg-bg3"
            >
              <p className="text-xl font-bold">From</p>
              <input
                type="date"
                onFocus={handleFocus}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </label>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <label
              htmlFor="date"
              className="flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n40 bg-primary/5 px-6 py-2.5 dark:border-n500 dark:bg-bg3"
            >
              <p className="text-xl font-bold">To</p>
              <input
                type="date"
                onFocus={handleFocus}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </label>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-1">
            <button
              className="btn flex justify-center px-5 py-2.5 max-lg:px-16 max-[400px]:w-full lg:py-3"
              onClick={() => onSearch()}
            >
              <IconSearch />
            </button>
          </div>
        </div>
      </form> */}
    </div>
  );
};

export default Hero;
