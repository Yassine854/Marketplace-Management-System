const OrdersTableHeadSmallCell = ({ children, onClick }: any) => (
  <td
    className=" h-14 w-10 whitespace-nowrap bg-primary text-white "
    onClick={onClick}
  >
    <div className="flex items-center justify-center border-b border-gray-100 ">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadSmallCell;
