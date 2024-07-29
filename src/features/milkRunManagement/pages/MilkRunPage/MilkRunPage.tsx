import MilRunMap from "../../widgets/MilkRunMap/MilkRunMap";
import { useMilkRunPage } from "./useMilkRunPage";
import MilkRunToolbar from "../../widgets/MilkRunToolbar";
import MilkRunFloatingSection from "../../widgets/MilkRunFloatingSection";

const MilkRunPage = () => {
  const {
    orders,
    onReset,
    isLoading,
    onValidate,
    ordersCount,
    deliveryAgents,
    onDetailsClick,
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
