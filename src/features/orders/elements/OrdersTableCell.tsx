const OrdersTableCell = ({ children }: any) => (
  <td className="">
      <div className="items flex justify-center overflow-hidden whitespace-nowrap text-ellipsis px-3 py-2 text-center text-sm">
          {children && children.length > 25 ? `${children.slice(0, 18)}...` : children}
      </div>
  </td>
  
  );
  
  export default OrdersTableCell;
  
