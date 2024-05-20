import TableActions from "@/components/elements/TablesElements/OpenOrdersTableElements/TableActions";

const ActionsCell = ({ actions, orderId }: any) => {
  return (
    <td>
      <div className="flex h-20 w-20 items-center justify-center border ">
        <TableActions actions={actions} orderId={orderId} />
      </div>
    </td>
  );
};

export default ActionsCell;
