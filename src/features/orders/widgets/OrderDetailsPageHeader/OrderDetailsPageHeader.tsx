import { IconArrowLeft } from "@tabler/icons-react";
import { Chip } from "@nextui-org/react";

const OrderDetailsPageHeader = ({ onArrowClick, status }: any) => {
  return (
    <div className=" mb-2  flex w-full items-center justify-between px-4">
      <div className=" flex cursor-pointer  " onClick={onArrowClick}>
        <IconArrowLeft stroke={4} size={32} />
      </div>
      <div className=" flex  items-center justify-center ">
        <p className="mr-4 text-2xl font-bold text-black">Status : </p>
        {status != "corrupted" && (
          <Chip color="success" size="lg">
            <p className="text-xl font-semibold">{status}</p>
          </Chip>
        )}

        {status == "corrupted" && (
          <Chip color="danger" size="lg">
            <p className="text-xl font-semibold">Corrupted</p>
          </Chip>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPageHeader;
