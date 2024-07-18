import Dropdown from "../Dropdown/Dropdown";
import { sortOptions } from "./sortOptions";

const SortByDropdown = ({ onSort, sortRef }: any) => {
  return (
    <div className="flex items-center justify-center">
      <>
        <div className="flex items-center  justify-center">
          <p className="mr-2 whitespace-nowrap font-bold">Sort By : </p>
          <Dropdown
            ref={sortRef}
            items={sortOptions}
            onSelectedChange={onSort}
          />
        </div>
      </>
    </div>
  );
};

export default SortByDropdown;
