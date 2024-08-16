import TableRowSkeleton from "./elements/RowSkeleton";
import UsersTableHead from "./elements/TableHead/TableHead";
import UsersTableRow from "./elements/TableRow";

const UsersTable = ({
  users,
  isLoading,
  changeSelectedSort,
  onSelectAllClick,
  isAllOrdersSelected,
}: any) => {
  return (
    <table border={0} cellPadding={0} cellSpacing={0}>
      <UsersTableHead />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <TableRowSkeleton key={i} number={4} />
              ))}
            </>
          ) : (
            <>
              {users?.map((user: any) => (
                <UsersTableRow key={user?.id} user={user} />
              ))}
            </>
          )}
        </>
      </tbody>
    </table>
  );
};

export default UsersTable;
