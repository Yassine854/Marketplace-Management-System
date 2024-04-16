"use client";

import AnyMatchingResults from "@/components/elements/AnyMatchingResults";
import Dropdown from "@/components/elements/Dropdown";
import { IconSelector } from "@tabler/icons-react";
import Pagination from "@/components/elements/Pagination";
import SearchBar from "@/components/elements/SearchBar";
import TableRow from "@/components/elements/TableRow";
import { faker } from "@faker-js/faker";
import { useState } from "react";
import useTable from "@/utils/useTable";

Dropdown;
const options = ["Name", "Price", "Rating"];

const list = Array.from({ length: 40 }).map((_, i) => {
  return {
    id: i + 1,
    name: faker.person.firstName(),
    icon: `/images/files/${faker.helpers.arrayElement([
      "mp4",
      "html",
      "gif",
      "wma",
      "pdf",
    ])}.png`,
    img: `/images/user-${faker.helpers.arrayElement([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ])}.png`,
    type: faker.person.jobDescriptor(),
    size: `${faker.number.float({ multipleOf: 8 })}MB`,
    version: "1.0.0",
    time: faker.date.recent(),
  };
});

const OrdersTable = () => {
  const [selected, setSelected] = useState(options[0]);

  const {
    currentPage,
    deleteItem,
    paginate,
    search,
    sortData,
    tableData,
    totalPages,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
    totalData,
  } = useTable(list, 10);

  return (
    <div className="box">
      <div className="flex flex-wrap gap-3 justify-between items-center bb-dashed mb-6 pb-6 w-full">
        <p className="font-medium">Table List View</p>
        <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
          <SearchBar handleSearch={search} />
          <div className="flex items-center shrink-0 gap-2">
            <p className="text-xs sm:text-sm">Sort By : </p>
            <Dropdown
              selected={selected}
              setSelected={setSelected}
              items={options}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto mb-6 pb-6 bb-dashed">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-primary/5 dark:bg-bg3 font-semibold">
              <td className="p-5">#</td>
              <td onClick={() => sortData("type")} className="p-5">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  Type <IconSelector size={18} />
                </div>
              </td>
              <td onClick={() => sortData("size")} className="p-5 w-[16%]">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  Size <IconSelector size={18} />
                </div>
              </td>
              <td className="p-5 w-[16%]">Version</td>
              <td onClick={() => sortData("name")} className="p-5">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  Last Updated <IconSelector size={18} />
                </div>
              </td>
              <td className="p-5 text-center">Action</td>
            </tr>
          </thead>
          <tbody>
            {tableData.map(
              ({ id, img, name, icon, size, time, type, version }, index) => (
                <TableRow
                  key={id}
                  img={img}
                  icon={icon}
                  size={size}
                  time={time}
                  type={type}
                  version={version}
                  index={index}
                />
              )
            )}
          </tbody>
        </table>
      </div>
      {tableData.length > 0 && (
        <Pagination
          endIndex={endIndex}
          total={totalData}
          totalPages={totalPages}
          currentPage={currentPage}
          goToPage={paginate}
          nextPage={nextPage}
          prevPage={prevPage}
          startIndex={startIndex}
        />
      )}
      {!tableData.length && <AnyMatchingResults />}
    </div>
  );
};

export default OrdersTable;
