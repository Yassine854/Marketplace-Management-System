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
    onEditClick,
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
    <div className="relative  mt-[4.8rem] flex  flex-grow p-2 ">
      <MilRunMap
        ordersMarkers={orders}
        onEditClick={onEditClick}
        selectedOrdersIds={selectedOrdersIds}
        onOrderMarkerClick={onOrderMarkerClick}
      />

      <MilkRunFloatingSection
        onReset={onReset}
        ordersCount={ordersCount}
        selectedOrdersIds={selectedOrdersIds}
        onDeliveryDateChange={onDeliveryDateChange}
      />
      <MilkRunToolbar
        isLoading={isLoading}
        onValidate={onValidate}
        deliveryAgents={deliveryAgents}
        onMilkRunChange={onMilkRunChange}
        onDeliveryAgentChange={onDeliveryAgentChange}
        deliverySlotSelectorRef={deliverySlotSelectorRef}
        deliveryAgentSelectorRef={deliveryAgentSelectorRef}
      />
    </div>
  );
};

export default MilkRunPage;
