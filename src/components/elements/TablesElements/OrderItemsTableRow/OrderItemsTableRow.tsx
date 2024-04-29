const RowItem = ({ content }: any) => (
  <td>
    <div className=" flex h-20 items-center  justify-center  ">{content}</div>
  </td>
);

const OrderItemsTableRow = ({ order, onClick, onCheckClick, actions }: any) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={onClick}
    >
      <RowItem content={order.id} />
      <RowItem content={order.id} />
      <RowItem content={order.customer.name} />
      <RowItem content={order.customer.name} />
      <RowItem content={order.deliveryDate} />
      <RowItem content={order.total} />
    </tr>
  );
};
export default OrderItemsTableRow;
