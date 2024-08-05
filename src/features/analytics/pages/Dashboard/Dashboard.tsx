import { useGetDeliveryAgents } from "@/features/shared/hooks/queries/useGetDeliveryAgents";
import NumberOfOrdersChart from "../../widgets/NumberOfOrdersChart";
import NumberOfUniqueCustomer from "../../widgets/NumberOfUniqueCustomer";
import { useEffect } from "react";
import GrossMarchandiseValue from "../../widgets/GrossMarchandiseValue";

const Dashboard = () => {
  const { isLoading, deliveryAgents } = useGetDeliveryAgents();

  useEffect(() => {
    console.log("🚀 ~ Dashboard ~ isLoading:", isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log("🚀 ~ Dashboard ~ deliveryAgents:", deliveryAgents);
  }, [deliveryAgents]);

  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <div className="flex h-[1500px] flex-col justify-between">
        <NumberOfOrdersChart />
        <NumberOfUniqueCustomer />
        <GrossMarchandiseValue />
      </div>
    </div>
  );
};

export default Dashboard;
