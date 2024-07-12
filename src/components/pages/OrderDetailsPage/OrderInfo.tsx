import { IconShoppingCart } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const OrderInfo = ({ id, total, storeId }: any) => {
  const [store, setStore] = useState("Tunis");

  useEffect(() => {
    switch (storeId) {
      case "1":
        setStore("Tunis");
        break;
      case "2":
        setStore("Sousse");
        break;
      case "3":
        setStore("Kmarket");
    }
  }, [storeId]);

  return (
    <div className=" flex h-32">
      <div className="   flex  h-16 w-16  items-center justify-center rounded-full bg-n30 ">
        <IconShoppingCart stroke={2} size={48} />
      </div>

      <div className="ml-4  flex h-full w-full flex-grow flex-col  ">
        <p className=" pb-2 text-2xl font-bold text-black">Order Info</p>
        <div className="flex flex-col ">
          <p className="text-black  ">
            <span className="text-n90 ">ID : </span>#{id}
          </p>
          <p className="text-black  ">
            <span className="text-n90 ">Total : </span>
            {total} TND
          </p>
          <p className="text-black  ">
            <span className="text-n90 ">Store : </span>
            {store}

            {/* {total && total?.toFixed(2)} TND */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
