import TableHead from "@/components/elements/TablesElements/TableHead";
import TableRow from "@/components/elements/TablesElements/TableRow";
import TableRowSkeleton from "@/components/elements/TablesElements/TableRowSkeleton";

const Table = ({ headCells, rows, isLoading = true }: any) => {
  return (
    <table
      border={0}
      cellPadding={0}
      cellSpacing={0}
      className="w-full border-separate overflow-hidden overflow-x-scroll whitespace-nowrap border-none pb-16 "
    >
      <TableHead cells={headCells} />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(15)].map((_, i) => (
                <TableRowSkeleton key={i} number={10} />
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
