import TableHead from "@/components/elements/TablesElements/TableHead";
import TableRow from "@/components/elements/TablesElements/TableRow";
import TableRowSkeleton from "@/components/elements/TablesElements/TableRowSkeleton";

const Table = ({ headCells, rows, isLoading = true, columns = 9 }: any) => {
  return (
    <table
      border={0}
      cellPadding={0}
      cellSpacing={0}
      className="relative w-full border-separate overflow-hidden overflow-x-scroll whitespace-nowrap  "
    >
      <TableHead cells={headCells} />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(15)].map((_, i) => (
                <TableRowSkeleton key={i} number={columns} />
              ))}
            </>
          ) : (
            <>
              {rows?.map((rowCells: any, i: number) => (
                <TableRow key={i} cells={rowCells} />
              ))}
            </>
          )}
        </>
      </tbody>
    </table>
  );
};

export default Table;
