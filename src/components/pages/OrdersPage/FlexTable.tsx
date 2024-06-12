"use client";
import { faker } from "@faker-js/faker";
import { IconSearch, IconSelector } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import useTable from "./useTable";
import Dropdown from "@/components/elements/Dropdown";
import Pagination from "./Pagination";
import SearchBar from "./Searchbar";
import TableActions from "./TableActions";
const options = ["Name", "Price", "Rating"];
const list = Array.from({ length: 40 }).map((_, i) => {
  return {
    id: i + 1,
    industry: faker.helpers.arrayElement([
      "Gaming",
      "Health",
      "Pharma",
      "Business",
      "Agriculture",
      "Automotive",
    ]),
    name: faker.person.firstName(),
    img: `/images/user-${faker.helpers.arrayElement([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ])}.png`,
    country: faker.location.country(),
    designation: faker.person.jobTitle(),
    status: faker.helpers.arrayElement([
      "Online",
      "Working",
      "Offline",
      "Suspended",
    ]),
    relations: faker.helpers.arrayElements(
      [
        "/images/user.png",
        "/images/user-2.png",
        "/images/user-3.png",
        "/images/user-4.png",
        "/images/user-5.png",
      ],
      { min: 2, max: 5 },
    ),
  };
});

const FlexListTwo = () => {
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
      <div className="bb-dashed mb-6 flex flex-wrap items-center justify-between gap-3 pb-6">
        <p className="font-medium">Orders</p>
        <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
          <SearchBar handleSearch={search} />
          <div className="flex items-center gap-2">
            <p className="whitespace-nowrap">Sort By : </p>
            <Dropdown
              selected={selected}
              setSelected={setSelected}
              items={options}
            />
          </div>
        </div>
      </div>
      <div className="mb-6 overflow-x-auto rounded-2xl bg-primary/5 p-4 dark:bg-bg3 lg:p-6">
        <div className="min-w-min rounded-xl bg-n0 px-3 dark:bg-bg4">
          <table
            border={0}
            cellPadding={0}
            cellSpacing={0}
            style={{ borderSpacing: "0 12px" }}
            className="w-full border-separate whitespace-nowrap border-none p-0"
          >
            <thead>
              <tr className="font-semibold">
                <td onClick={() => sortData("id")} className="w-14">
                  <div className="flex cursor-pointer select-none items-center gap-1 rounded-s-xl bg-primary/5 px-3 py-5 pl-6 dark:bg-bg3">
                    Serial No <IconSelector size={18} />
                  </div>
                </td>
                <td onClick={() => sortData("name")}>
                  <div className="flex cursor-pointer select-none items-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
                    User <IconSelector size={18} />
                  </div>
                </td>
                <td onClick={() => sortData("country")}>
                  <div className="flex cursor-pointer select-none items-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
                    Location <IconSelector size={18} />
                  </div>
                </td>
                <td onClick={() => sortData("industry")}>
                  <div className="flex cursor-pointer select-none items-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
                    Industry <IconSelector size={18} />
                  </div>
                </td>
                <td onClick={() => sortData("status")}>
                  <div className="flex cursor-pointer select-none items-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
                    Status <IconSelector size={18} />
                  </div>
                </td>
                <td>
                  <div className="bg-primary/5 px-3 py-5 dark:bg-bg3">
                    Relations
                  </div>
                </td>
                <td>
                  <div className="rounded-e-xl bg-primary/5 px-3 py-5 text-center dark:bg-bg3">
                    Action
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              {tableData.map(
                (
                  {
                    country,
                    id,
                    img,
                    name,
                    industry,
                    status,
                    designation,
                    relations,
                  },
                  index,
                ) => (
                  <tr key={id}>
                    <td>
                      <div className="rounded-s-lg bg-primary/5 px-3 py-5 pl-6 dark:bg-bg3">
                        {id < 10 ? "0" + id : id}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3 bg-primary/5 px-3 py-2.5 pr-6 dark:bg-bg3">
                        <Image
                          width={32}
                          height={32}
                          className="shrink-0 rounded-full"
                          src={img}
                          alt="img"
                        />
                        <div className="flex flex-col">
                          <span className="mb-1 inline-block font-medium">
                            {name}
                          </span>
                          <span className="text-xs">{designation}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="bg-primary/5 px-3 py-5 dark:bg-bg3">
                        {country.slice(0, 14)}
                      </div>
                    </td>
                    <td>
                      <div className="bg-primary/5 px-3 py-5 dark:bg-bg3">
                        {industry}
                      </div>
                    </td>
                    <td>
                      <div className="bg-primary/5 px-3 py-[13px] dark:bg-bg3">
                        <span
                          className={`block w-28 rounded-[30px] border border-n30 py-2.5 text-center text-xs dark:border-n500 xxl:w-36 ${
                            status == "Online" &&
                            "bg-primary/10 text-primary dark:bg-bg3"
                          } ${
                            status == "Offline" &&
                            "bg-secondary1/10 text-secondary1 dark:bg-bg3"
                          } ${
                            status == "Suspended" &&
                            "bg-secondary2/10 text-secondary2 dark:bg-bg3"
                          }  ${
                            status == "Working" &&
                            "bg-secondary3dark/10 text-secondary3dark dark:bg-bg3"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex bg-primary/5 px-3 py-[17px] dark:bg-bg3">
                        {relations.map((item, i) => (
                          <Image
                            key={i}
                            src={item}
                            width={32}
                            height={32}
                            className="-mr-4 rounded-full border border-n0 dark:border-n500"
                            alt="img"
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center rounded-e-xl bg-primary/5 px-3 py-[21px] dark:bg-bg3">
                        <TableActions
                          onDelete={() => deleteItem(id)}
                          fromBottom={
                            index == tableData.length - 1 ||
                            index == tableData.length - 2
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
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
      {!tableData.length && (
        <div className="py-10 text-center">
          <div className="mx-auto max-w-[500px] flex-col items-center text-center max-md:flex">
            <div className="mb-5 flex justify-center">
              <IconSearch size={60} className="text-primary" />
            </div>
            <h3 className="h3 mb-3 lg:mb-6">No matching results</h3>
            <p>
              Looks like we couldn&nbsp;t find any matching results for your
              search terms. Try other search terms.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexListTwo;
