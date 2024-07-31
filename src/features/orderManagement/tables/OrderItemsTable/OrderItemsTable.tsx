import Head from "./OrderItemsTableHead";

import ShippedCounter from "./ShippedCounter";

const OrderItemsTable = ({ items, isInEditMode }: any) => {
  return (
    <div className="mb-6 w-full ">
      <table className="w-full whitespace-nowrap">
        <Head />
        <tbody>
          {items?.map(
            ({
              id,
              sku,
              productName,
              totalPrice,
              weight,
              pcb,
              orderedQuantity,
            }: any) => (
              <tr key={id} className="even:bg-primary/5 dark:even:bg-bg3">
                <td className="px-3 py-2 text-center">{sku || "*****"}</td>
                <td className="px-3 py-1">
                  <div className="mr-6 flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="mb-1 inline-block font-medium">
                        {productName || "*****"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2">
                  {isInEditMode && <ShippedCounter id={id} />}

                  {!isInEditMode && <div>{weight}</div>}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    {orderedQuantity || 0}
                  </div>
                </td>
                <td className="px-3 py-2">{orderedQuantity * pcb || 0}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    {totalPrice?.toFixed(2) || 0}
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;
