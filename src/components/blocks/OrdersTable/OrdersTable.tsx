"use client";

import AnyMatchingResults from "@/components/elements/AnyMatchingResults";
import OrdersTableHead from "@/components/elements/OrdersTableHead";
import OrdersTableHeader from "@/components/elements/OrdersTableHeader";
import Pagination from "@/components/elements/Pagination";
import TableRow from "@/components/elements/TableRow";
import { faker } from "@faker-js/faker";
import useTable from "@/utils/useTable";

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
      <OrdersTableHeader search={search} />
      <div className="bb-dashed mb-6 overflow-x-auto pb-6">
        <table className="w-full whitespace-nowrap">
          <OrdersTableHead sortData={sortData} />
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
              ),
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
