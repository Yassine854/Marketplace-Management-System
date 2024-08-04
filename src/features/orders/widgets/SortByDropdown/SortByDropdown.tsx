import Dropdown from "../Dropdown";
import { useEffect, useState } from "react";
import { sortOptions } from "./sortOptions";

const SortByDropdown = ({ onSort, sortRef }: any) => {
  const [selected, setSelected] = useState<any>([sortOptions[0]]);

  useEffect(() => {
    if (selected) {
      onSort(selected?.key);
    }
  }, [selected, onSort]);

  return (
    <div className="flex items-center justify-center">
      <>
        <div className="flex items-center  justify-center">
          <p className="mr-2 whitespace-nowrap font-bold">Sort By : </p>
          <Dropdown
            ref={sortRef}
            items={sortOptions}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </>
    </div>
  );
};

export default SortByDropdown;
