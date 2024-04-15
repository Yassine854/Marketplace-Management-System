import { IconSearch } from "@tabler/icons-react";

const SearchBar = ({
  handleSearch,
}: {
  handleSearch: (term: string) => void;
}) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-primary/5 dark:bg-bg3 hidden md:flex gap-3 rounded-[30px] border border-transparent focus-within:border-primary px-3 xxl:px-5 items-center justify-between max-w-[250px] w-full"
    >
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search"
        className="bg-transparent py-2 text-sm focus:outline-none w-full"
      />
      <button>
        <IconSearch size={20} />
      </button>
    </form>
  );
};
SearchBar.defaultProps = {
  handleSearch: () => {},
};
export default SearchBar;
