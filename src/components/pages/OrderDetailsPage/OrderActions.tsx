import { IconBrightnessAuto } from "@tabler/icons-react";
import ActionsDropdown from "@/components/widgets/ActionsDropdown";

const OrderActions = ({ actions, orderId, isPending, dropRef }: any) => {
  return (
    <div className="flex">
      <div className="   flex  h-16 w-16  items-center justify-center rounded-full bg-n30 ">
        <IconBrightnessAuto stroke={2} size={48} />
      </div>

      <div className=" ml-2">
        <p className=" ml-2 pb-2 text-2xl font-bold text-black">Actions </p>
        <ActionsDropdown
          dropRef={dropRef}
          actions={actions}
          isPending={isPending}
          orderId={orderId}
        />
      </div>
    </div>
  );
};

export default OrderActions;
