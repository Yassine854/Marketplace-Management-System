const RowItem = ({ content }: any) => (
  <td>
    <div className=" flex h-20 items-center  justify-center  ">{content}</div>
  </td>
);

const OrderItemsTableRow = ({
  order,
  onClick,
  onCheckClick,
  actions,
  line,
}: any) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={onClick}
    >
      <RowItem content={line.sku} />
      <RowItem content={line.productName} />
      <RowItem content={"true"} />
      <RowItem content={line.productPrice} />
      <RowItem content={line.quantity} />
      <RowItem content={line.totalPrice} />
    </tr>
  );
};
export default OrderItemsTableRow;
