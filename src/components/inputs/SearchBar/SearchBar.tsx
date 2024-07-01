import { forwardRef, useImperativeHandle } from "react";

import { IconSearch } from "@tabler/icons-react";
import { useSearchBar } from "./useSearchBar";

export type Props = {
  onSearch?: (text: string) => void;
  isWithInstantSearch?: boolean;
};
export type searchRef = {
  reset: () => void;
};

// eslint-disable-next-line react/display-name
const SearchBar = forwardRef<searchRef, Props>(
  (
    {
      onSearch = (text: string) => console.log(text),
      isWithInstantSearch = false,
    },
    ref,
  ) => {
    const { handleSubmit, handleInputChange, reset, text } = useSearchBar(
      isWithInstantSearch,
      onSearch,
    );

    useImperativeHandle(ref, () => ({
      reset: () => {
        reset();
      },
    }));

    return (
      <div className="hidden w-full max-w-[250px] items-center justify-between gap-3 rounded-[30px] border border-transparent bg-n30 bg-primary/5 px-3 focus-within:border-primary dark:bg-bg3 md:flex xxl:px-5">
        <input
          onChange={handleInputChange}
          value={text}
          type="text"
          placeholder="Search"
          className="w-full bg-transparent py-2 text-sm focus:outline-none"
        />
        <button onClick={handleSubmit} className="cursor-pointer">
          <IconSearch size={24} />
        </button>
      </div>
    );
  },
);
export default SearchBar;
