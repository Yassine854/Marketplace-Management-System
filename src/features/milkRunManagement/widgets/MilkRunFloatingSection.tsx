import { Button } from "@nextui-org/react";
import DeliveryDatePicker from "@/features/shared/inputs/DeliveryDatePicker";

const MilkRunFloatingSection = ({
  onReset,
  ordersCount,
  selectedOrdersIds,
  onDeliveryDateChange,
}: any) => {
  return (
    <div className="absolute left-1 top-1 z-10 flex   flex-col items-center justify-between rounded-xl p-4 ">
      <div className="m-2 flex w-full flex-col items-center justify-center  rounded-xl bg-n20 p-2 shadow-xl ">
        <p className="mr-3 text-lg font-bold">Delivery Date </p>
        <DeliveryDatePicker direction="down" onChange={onDeliveryDateChange} />
      </div>
      <div className="m-1 flex  h-10 w-full items-center  rounded-xl bg-n20 p-4 shadow-lg ">
        <p>
          Number of Orders : <span className="font-bold">{ordersCount}</span>{" "}
        </p>
      </div>
      <div className="m-1  flex h-10 w-full items-center  rounded-xl bg-n20 p-4 shadow-lg  ">
        <p>
          Selected Orders :{" "}
          <span className="font-bold">{selectedOrdersIds?.length}</span>{" "}
        </p>
      </div>
      <div className="mt-2 w-full">
        <Button className="shadow-xl" color="danger" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default MilkRunFloatingSection;
