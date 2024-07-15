import { Button } from "@nextui-org/react";
import { useMilkRun } from "@/hooks/milkRunHooks/useMilkRun";
import MilRunMap from "./MilkRunMap";
import DeliveryDatePicker from "../OrderDetailsPage/DeliveryDatePicker";
import DeliveryAgentSelector from "./DeliveryAgentSelector";
import MilkRunSelector from "./MilkRunSelector";

const MilkRunPage = () => {
  const {
    deliveryAgents,
    orders,
    deliveryDate,
    isLoading,
    selectedOrdersIds,
    onDeliveryDateChange,
    onOrderMarkerClick,
    onDeliveryAgentChange,
    reset,
  } = useMilkRun();

  return (
    <div className="relative  mt-[4.8rem] flex  flex-grow p-2 ">
      <MilRunMap
        ordersMarkers={orders}
        selectedOrdersIds={selectedOrdersIds}
        onOrderMarkerClick={onOrderMarkerClick}
      />

      <div className="absolute left-4 top-4 z-10 flex h-32  flex-col items-center justify-between rounded-xl p-4 ">
        <div className=" flex  h-10 w-full items-center  rounded-xl bg-n20 p-4 shadow-lg ">
          <p>
            Number of Orders :{" "}
            <span className="font-bold">{orders?.length}</span>{" "}
          </p>
        </div>
        <div className="flex  h-10 w-full items-center  rounded-xl bg-n20 p-4 shadow-lg  ">
          <p>
            Selected Orders :{" "}
            <span className="font-bold">{selectedOrdersIds?.length}</span>{" "}
          </p>
        </div>
      </div>

      <div className="absolute -right-4 bottom-0 left-1 z-10 flex h-20 w-full  justify-between bg-n20">
        {!isLoading && (
          <div className="flex">
            <div className=" mx-4 flex items-center justify-center ">
              <p className="mr-3 text-lg font-bold">Delivery Date :</p>
              <DeliveryDatePicker
                onChange={onDeliveryDateChange}
                selectedDate={deliveryDate}
              />
            </div>
            <div className=" mx-4 flex items-center justify-center ">
              <p className="mr-3 text-lg font-bold">Agent :</p>
              <DeliveryAgentSelector
                deliveryAgents={deliveryAgents}
                onChange={onDeliveryAgentChange}
              />
            </div>
            <div className=" mx-4 flex items-center justify-center ">
              <p className="mr-3 text-lg font-bold">Milk Run :</p>
              <MilkRunSelector />
            </div>
          </div>
        )}
        {isLoading && <div>Loading ....</div>}

        <div className="flex h-full items-center justify-center  ">
          <Button className="mx-4" color="primary">
            Validate
          </Button>
          <Button className="mx-4" color="danger" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilkRunPage;
