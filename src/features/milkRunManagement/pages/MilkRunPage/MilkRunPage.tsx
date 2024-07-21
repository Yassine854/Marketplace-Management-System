import { Button } from "@nextui-org/react";
import MilRunMap from "../../widgets/MilkRunMap";
import { useMilkRunPage } from "./useMilkRunPage";
import DeliverySlotSelector from "../../widgets/DeliverySlotSelector";
import DeliveryAgentSelector from "../../widgets/DeliveryAgentSelector";
import DeliveryDatePicker from "@/features/shared/inputs/DeliveryDatePicker";

const MilkRunPage = () => {
  const {
    orders,
    ordersCount,
    onReset,
    isLoading,
    onValidate,
    onEditClick,
    deliveryAgents,
    onMilkRunChange,
    selectedOrdersIds,
    onOrderMarkerClick,
    onDeliveryDateChange,
    onDeliveryAgentChange,
    deliverySlotSelectorRef,
    deliveryAgentSelectorRef,
  } = useMilkRunPage();

  return (
    <div className="relative  mt-[4.8rem] flex  flex-grow p-2 ">
      <MilRunMap
        ordersMarkers={orders}
        onEditClick={onEditClick}
        selectedOrdersIds={selectedOrdersIds}
        onOrderMarkerClick={onOrderMarkerClick}
      />
      <div className="absolute left-4 top-4 z-10 flex h-32  flex-col items-center justify-between rounded-xl p-4 ">
        <div className=" flex  h-10 w-full items-center  rounded-xl bg-n20 p-4 shadow-lg ">
          <p>
            Number of Orders : <span className="font-bold">{ordersCount}</span>{" "}
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
                direction="up"
                onChange={onDeliveryDateChange}
              />
            </div>
            <div className=" mx-4 flex items-center justify-center ">
              <p className="mr-3 text-lg font-bold">Agent :</p>
              <DeliveryAgentSelector
                ref={deliveryAgentSelectorRef}
                deliveryAgents={deliveryAgents}
                onChange={onDeliveryAgentChange}
              />
            </div>
            <div className=" mx-4 flex items-center justify-center ">
              <p className="mr-3 text-lg font-bold">Milk Run :</p>
              <DeliverySlotSelector
                onChange={onMilkRunChange}
                ref={deliverySlotSelectorRef}
              />
            </div>
          </div>
        )}
        {isLoading && <div>Loading ....</div>}

        <div className="flex h-full items-center justify-center  ">
          <Button className="mx-4" color="primary" onClick={onValidate}>
            Validate
          </Button>
          <Button className="mx-4" color="danger" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilkRunPage;
