import { useGetDeliveryAgents } from "@/features/shared/hooks/queries/useGetDeliveryAgents";
import NumberOfOrdersChart from "../../widgets/NumberOfOrdersChart";
import NumberOfUniqueCustomer from "../../widgets/NumberOfUniqueCustomer";
import { useEffect } from "react";

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
      <NumberOfOrdersChart />
      <div className="mt-10">
        <NumberOfUniqueCustomer />
      </div>
    </div>
  );
};

export default Dashboard;
