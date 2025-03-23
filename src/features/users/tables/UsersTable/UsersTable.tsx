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
    <div style={{ overflowX: "auto" }}>
      <div
        className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-4 dark:bg-bg3"
        style={{ maxHeight: "600px" }}
      >
        <table
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: "100%" }}
        >
          <UsersTableHead
            changeSelectedSort={changeSelectedSort}
            onSelectAllClick={onSelectAllClick}
            isAllOrdersSelected={isAllOrdersSelected}
          />

          <tbody className="divide-y divide-gray-200">
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
      </div>
    </div>
  );
};

export default UsersTable;
