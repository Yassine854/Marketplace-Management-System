import MilRunMap from "../../widgets/MilkRunMap";
import { useMilkRunPage } from "./useMilkRunPage";
import MilkRunToolbar from "../../widgets/MilkRunToolbar";
import MilkRunFloatingSection from "../../widgets/MilkRunFloatingSection";

const MilkRunPage = () => {
  const {
    orders,
    onReset,
    isLoading,
    onValidate,
    onDetailsClick,
    ordersCount,
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
    <div className="relative  mt-[4.8rem] flex  flex-grow overflow-hidden p-2">
      <MilRunMap
        ordersMarkers={orders}
        onDetailsClick={onDetailsClick}
        selectedOrdersIds={selectedOrdersIds}
        onOrderMarkerClick={onOrderMarkerClick}
      />

      <MilkRunFloatingSection
        onReset={onReset}
        ordersCount={ordersCount}
        selectedOrdersIds={selectedOrdersIds}
        onDeliveryDateChange={onDeliveryDateChange}
      />

      {/* <div className="  fixed  bottom-2 left-1 z-10 flex h-20 w-full justify-between  bg-n20 px-8"> */}
      <MilkRunToolbar
        isLoading={isLoading}
        onValidate={onValidate}
        deliveryAgents={deliveryAgents}
        onMilkRunChange={onMilkRunChange}
        onDeliveryAgentChange={onDeliveryAgentChange}
        deliverySlotSelectorRef={deliverySlotSelectorRef}
        deliveryAgentSelectorRef={deliveryAgentSelectorRef}
      />
      {/* </div> */}
    </div>
  );
};

export default MilkRunPage;
