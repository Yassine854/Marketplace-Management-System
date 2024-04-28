const TableRowSkeleton = ({ number }: { number: number }) => {
  return (
    <tr
      className=" m-8 mx-auto  h-12 max-h-12 w-[20%]
     min-w-max  justify-center gap-8 rounded-lg border border-n30 bg-n0 p-4 dark:border-n500 dark:bg-bg4"
    >
      {[...Array(number)].map((_, i) => (
        <td key={i} className="   animate-pulse  p-2 ">
          <div className="h-6 w-[80%] rounded-xl bg-n40 dark:bg-n400" />
        </td>
      ))}
    </tr>
  );
};

export default TableRowSkeleton;
