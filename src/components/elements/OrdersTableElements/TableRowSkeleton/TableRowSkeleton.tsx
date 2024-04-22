const TableRowSkeleton = () => {
  return (
    <tr className=" m-8 mx-auto h-12 w-[20%] min-w-max justify-center gap-8 rounded-lg border border-n30 bg-n0 p-4 dark:border-n500 dark:bg-bg4">
      <td className="  animate-pulse  ">
        <div className="h-6 w-[80%] rounded-xl bg-n40 dark:bg-n400" />
      </td>
      <td className="  animate-pulse  ">
        <div className="h-6 w-[80%] rounded-xl bg-n40 dark:bg-n400" />
      </td>
      <td className="  animate-pulse  ">
        <div className="h-6 w-[80%] rounded-xl bg-n40 dark:bg-n400" />
      </td>
      <td className="  animate-pulse  ">
        <div className="h-6 w-[80%] rounded-xl bg-n40 dark:bg-n400" />
      </td>
      <td className="  animate-pulse  ">
        <div className="h-6 w-[80%] rounded-xl bg-n40 dark:bg-n400" />
      </td>
      <td className="  animate-pulse  ">
        <div className="h-6 w-[80%] rounded-xl bg-n40 dark:bg-n400" />
      </td>
    </tr>
  );
};

export default TableRowSkeleton;
