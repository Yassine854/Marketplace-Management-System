import { ChangeEvent, useEffect, useState } from "react";

import { IconSearch } from "@tabler/icons-react";

type Props = {
  onSearch?: (text: string) => void;
  withInstantSearch?: boolean;
};

const SearchBar = ({
  onSearch = (text) => console.log(text),
  withInstantSearch = false,
}: Props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (withInstantSearch) {
      const timer = setTimeout(() => {
        onSearch(text);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [text, onSearch, withInstantSearch]);

  return (
    <form
      onSubmit={() => {
        !withInstantSearch && onSearch(text);
      }}
      className="hidden w-full max-w-[250px] items-center justify-between gap-3 rounded-[30px] border border-transparent bg-primary/5 px-3 focus-within:border-primary dark:bg-bg3 md:flex xxl:px-5"
    >
      <input
        type="text"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setText(event.target.value);
        }}
        placeholder="Search"
        className="w-full bg-transparent py-2 text-sm focus:outline-none"
      />
      <button>
        <IconSearch size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
