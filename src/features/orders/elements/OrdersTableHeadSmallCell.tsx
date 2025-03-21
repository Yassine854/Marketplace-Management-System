const OrdersTableHeadSmallCell = ({ children, onClick }: any) => (
  <td className=" h-14 w-10 " onClick={onClick}>
    <div className="flex items-center justify-center border-b border-gray-100 bg-gray-50">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadSmallCell;
