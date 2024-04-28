"use client";

import { IconSearch } from "@tabler/icons-react";

const AnyMatchingResults = () => {
  return (
    <div className="absolute bottom-0 left-0  right-0  top-40 z-10 flex flex-grow items-center justify-center bg-n10 py-10 text-center">
      <div className="mx-auto max-w-[500px] flex-col items-center text-center max-md:flex">
        <div className="mb-5 flex justify-center">
          <IconSearch size={60} className="text-primary" />
        </div>
        <h3 className="h3 mb-3 lg:mb-6">No matching results</h3>
        <p>
          Looks like we couldn&nbsp;t find any matching results for your search
          terms.
        </p>
        <p>Try other search terms.</p>
      </div>
    </div>
  );
};

export default AnyMatchingResults;
