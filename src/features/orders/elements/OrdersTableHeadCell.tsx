const OrdersTableHeadCell = ({ children, onClick }: any) => (
  <td
    className={`h-14 px-8 ${
      onClick ? "cursor-pointer" : ""
    } bg-primary text-white  `}
    onClick={onClick}
  >
    <div className="flex items-center justify-center gap-2 whitespace-nowrap ">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadCell;
