import { IconSearch } from "@tabler/icons-react";

const SearchBar = ({
  handleSearch,
}: {
  handleSearch: (term: string) => void;
}) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="hidden w-full max-w-[250px] items-center justify-between gap-3 rounded-[30px] border border-transparent bg-primary/5 px-3 focus-within:border-primary dark:bg-bg3 md:flex xxl:px-5"
    >
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
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
