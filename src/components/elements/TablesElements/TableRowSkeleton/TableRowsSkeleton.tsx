const TableRowsSkeleton = ({ number = 5 }: { number?: number }) => {
  return (
    <tr>
      {[...Array(number)].map((_, i) => (
        <td key={i} className="animate-pulse  p-2">
          <div className="h-12  rounded-xl bg-n40 dark:bg-n400" />
        </td>
      ))}
    </tr>
  );
};

export default TableRowsSkeleton;
