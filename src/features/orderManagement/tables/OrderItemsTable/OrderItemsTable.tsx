import { useEffect } from "react";
import Head from "./OrderItemsTableHead";

import ShippedCounter from "./ShippedCounter";

const OrderItemsTable = ({ items, isInEditMode }: any) => {
  //console.log("🚀 ~ OrderItemsTable ~ items:", items[0]);

  useEffect(() => {
    if (items?.length > 0)
      items?.map((item: any) => {
        console.log("🚀 ~ PCB:", item?.pcb);
        console.log("🚀 ~ Quantity:", item?.orderedQuantity);
      });
  }, [items]);

  return (
    <div className="mb-6 w-full ">
      <table className="w-full whitespace-nowrap">
        <Head />
        <tbody>
          {items?.map((item: any) => (
            <tr key={item?.sku} className="even:bg-primary/5 dark:even:bg-bg3">
              <td className="px-3 py-2 text-center">{item?.sku || "*****"}</td>
              <td className="px-3 py-1">
                <div className="mr-6 flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="mb-1 inline-block font-medium">
                      {item?.productName || "*****"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2">
                {isInEditMode && <ShippedCounter id={item?.id} />}

                {!isInEditMode && <div>{item?.weight}</div>}
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-3">
                  {item?.orderedQuantity || 0}
                </div>
              </td>
              <td className="px-3 py-2">
                {item?.orderedQuantity * item?.pcb || 0}
              </td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  {item?.totalPrice?.toFixed(2) || 0}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;
