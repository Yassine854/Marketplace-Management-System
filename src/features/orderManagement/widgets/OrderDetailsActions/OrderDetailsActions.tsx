import { IconBrightnessAuto } from "@tabler/icons-react";
import { useOrderDetailsActions } from "../../hooks/useOrderDetailsActions";
import OrderActionsDropdown from "../OrderActionsDropdown";
import { useEffect } from "react";

const OrderActions = ({ orderId }: any) => {
  const { isSomeActionPending, actions } = useOrderDetailsActions();

  return (
    <div className="flex">
      <div className="   flex  h-16 w-16  items-center justify-center rounded-full bg-n30 ">
        <IconBrightnessAuto stroke={2} size={48} />
      </div>

      <div className=" ml-2">
        <p className=" ml-2 pb-2 text-2xl font-bold text-black">Actions </p>
        <OrderActionsDropdown
          orderId={orderId}
          actions={actions}
          isPending={isSomeActionPending}
        />
      </div>
    </div>
  );
};

export default OrderActions;
