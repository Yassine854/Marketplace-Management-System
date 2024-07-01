import { useEffect, useState } from "react";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useNavigation } from "@/hooks/useNavigation";
import { useRouter } from "next/navigation";

const OrdersTableHeader = ({ selectedOrders }: any) => {
  const { push } = useRouter();
  const [selected, setSelected] = useState({ name: "Actions", key: "a" });
  const { navigateBack } = useNavigation();

  useEffect(() => {
    setSelected({ name: "Actions", key: "a" });
  }, [selectedOrders]);

  return (
    <>
      <div className="flex  w-full  flex-grow       bg-n10">
        <div
          className="m-2 flex h-12 w-36 cursor-pointer items-center justify-start "
          onClick={() => navigateBack()}
        >
          <IconArrowNarrowLeft size={64} />
        </div>
        <div className=" m-2 flex h-12  w-full items-center  justify-center  ">
          <p className="text-3xl font-bold">Order 34534 Details : </p>
        </div>
      </div>
      <div className="bt-dashed flex  h-16 w-full flex-grow  items-center  justify-between  bg-n10   ">
        <div className="m-4 flex h-16 flex-grow items-center justify-center  ">
          <p className="text-xl font-bold">Customer : Mohamed Jrad</p>
        </div>
        <div className="m-4 flex h-16 flex-grow items-center justify-center ">
          <p className="text-xl font-bold">Delivery Date : 05/05/2024</p>
        </div>
        <div className="m-4 flex h-16 flex-grow items-center justify-center ">
          <p className="text-xl font-bold">Total : 3420</p>
        </div>
        <div className="m-4 flex h-16 w-32  items-center justify-center ">
          <button className="btn ">Edit</button>
        </div>
      </div>
    </>
  );
};

export default OrdersTableHeader;
