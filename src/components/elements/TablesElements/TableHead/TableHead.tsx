const TableHead = ({ cells }: any) => {
  return (
    <thead>
      <tr className="sticky top-0  z-10 h-12 min-h-12  w-full    border bg-n40   font-semibold">
        {cells?.map(({ cell }: any, index: number) => (
          <td key={index} className="w-14">
            <div className="flex cursor-pointer select-none items-center justify-center gap-1 bg-primary/5 px-3 py-5 dark:bg-bg3">
              {cell}
            </div>
          </td>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
