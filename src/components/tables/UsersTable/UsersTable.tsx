import TableRowSkeleton from "./elements/RowSkeleton";
import UsersTableHead from "./elements/UsersTableHead/UsersTableHead";
import UsersTableRow from "./elements/UsersTableRow";

const UsersTable = ({
  users,
  isLoading,
  changeSelectedSort,
  onSelectAllClick,
  isAllOrdersSelected,
}: any) => {
  return (
    <table border={0} cellPadding={0} cellSpacing={0}>
      <UsersTableHead
        changeSelectedSort={changeSelectedSort}
        onSelectAllClick={onSelectAllClick}
        isAllOrdersSelected={isAllOrdersSelected}
      />

      <tbody>
        <>
          {isLoading ? (
            <>
              {[...Array(12)].map((_, i) => (
                <TableRowSkeleton key={i} number={8} />
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
