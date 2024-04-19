const TableRowSkeleton = () => {
  return (
    <div className="mx-auto flex w-full min-w-max gap-8 rounded-lg border border-n30 bg-n0  p-4 dark:border-n500 dark:bg-bg4">
      <div className="flex w-48 animate-pulse items-center gap-4">
        <div className="h-2 w-32 rounded-xl bg-n40 dark:bg-n400"></div>
      </div>
      <div className="flex w-48 animate-pulse items-center gap-4">
        <div className="h-2 w-32 rounded-xl bg-n40 dark:bg-n400"></div>
      </div>
      <div className="flex w-48 animate-pulse items-center gap-4">
        <div className="h-2 w-32 rounded-xl bg-n40 dark:bg-n400"></div>
      </div>
      <div className="flex w-48 animate-pulse items-center gap-4">
        <div className="h-2 w-32 rounded-xl bg-n40 dark:bg-n400"></div>
      </div>
    </div>
  );
};

export default TableRowSkeleton;
