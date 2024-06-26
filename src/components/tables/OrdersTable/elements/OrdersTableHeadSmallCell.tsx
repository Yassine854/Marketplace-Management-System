const OrdersTableHeadSmallCell = ({ children, onClick }: any) => (
  <td className=" h-14 w-20 " onClick={onClick}>
    <div className="flex h-full w-full items-center justify-center  font-bold ">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadSmallCell;
