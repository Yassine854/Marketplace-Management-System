"use client";

import { IconSearch } from "@tabler/icons-react";

const AnyMatchingResults = () => {
  return (
    <div className="text-center py-10">
      <div className="text-center mx-auto max-w-[500px] max-md:flex flex-col items-center">
        <div className="flex justify-center mb-5">
          <IconSearch size={60} className="text-primary" />
        </div>
        <h3 className="h3 mb-3 lg:mb-6">No matching results</h3>
        <p>
          Looks like we couldn&nbsp;t find any matching results for your search
          terms. Try other search terms.
        </p>
      </div>
    </div>
  );
};

export default AnyMatchingResults;
