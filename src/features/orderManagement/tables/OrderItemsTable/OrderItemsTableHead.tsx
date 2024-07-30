const Cell = ({ children }: any) => {
  return (
    <td className="p-5">
      <div className="  flex w-full cursor-pointer select-none items-center justify-center gap-1 ">
        {children}
      </div>
    </td>
  );
};

const OrderItemsTableHead = () => {
  return (
    <thead className="sticky left-0 right-0 top-0 z-10 bg-n20">
      <tr className="bg-primary/5 font-semibold dark:bg-bg3">
        <Cell>SKU</Cell>
        <Cell>Name</Cell>
        <Cell>Shipped</Cell>
        <Cell>PCB</Cell>
        <Cell>Quantity</Cell>
        <Cell>Total</Cell>
      </tr>
    </thead>
  );
};

export default OrderItemsTableHead;
