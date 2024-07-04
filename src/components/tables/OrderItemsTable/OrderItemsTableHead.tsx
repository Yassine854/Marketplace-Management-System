const OrderItemsTableHead = () => {
  return (
    <thead className="sticky left-0 right-0 top-0 bg-n20">
      <tr className="bg-primary/5 font-semibold dark:bg-bg3">
        <td className="p-5">
          <div className="flex w-10 cursor-pointer select-none items-center gap-1">
            SKU{" "}
          </div>
        </td>
        <td className="p-5">
          <div className="flex cursor-pointer select-none items-center gap-1">
            Name
          </div>
        </td>
        <td className="p-5">
          <div className="flex cursor-pointer select-none items-center gap-1">
            Shipped
          </div>
        </td>
        <td className="p-5">
          <div className="flex cursor-pointer select-none items-center gap-1">
            PCB{" "}
          </div>
        </td>
        <td className="p-5">
          <div className="flex cursor-pointer select-none items-center gap-1">
            Quantity{" "}
          </div>
        </td>
        <td className="p-5">
          <div className="flex cursor-pointer select-none items-center gap-1">
            Total{" "}
          </div>
        </td>
      </tr>
    </thead>
  );
};

export default OrderItemsTableHead;
